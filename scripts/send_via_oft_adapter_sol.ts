import { Options } from "@layerzerolabs/lz-v2-utilities";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { zeroPad } from "@ethersproject/bytes";
import { ethers } from "hardhat";
import PATHWAY_CONFIG from "./layer0_bridge_data";
import bs58 from 'bs58';

const OFTAdapter_CONTRACT_NAME = "ORACoinOFTAdapter";

const ERC20_TOKEN_APPROVE_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

// Via the OFTAdapter contract, send erc20 tokens on the source chain (e.g. Sepolia) to the destination chain (e.g. BNB testnet)
async function sendOFTViaAdapter(
    oftContractAddressOnSrcChain: string,
    oftContractAddressOnRemoteChain: string,
    lzEndpointIdOnSrcChain: string,
    lzEndpointIdOnDestChain: string,
    gasDropInWeiOnDestChain: string,
    executorLzReceiveOptionMaxGas: string,
    sendingAccountPrivKey: string,
    receivingAccountAddress: string,
    amount: string,
    erc20TokenAddress: string,
) {
    const sender = new ethers.Wallet(sendingAccountPrivKey, ethers.provider);

    console.log(
        `sendOFT - oftContractAddressOnSrcChain:${oftContractAddressOnSrcChain}, oftContractAddressOnRemoteChain:${oftContractAddressOnRemoteChain}, lzEndpointIdOnSrcChain:${lzEndpointIdOnSrcChain}, lzEndpointIdOnDestChain:${lzEndpointIdOnDestChain}, gasDropInWeiOnDestChain:${gasDropInWeiOnDestChain}, executorLzReceiveOptionMaxGas:${executorLzReceiveOptionMaxGas}, receivingAccountAddress:${receivingAccountAddress}, sender: ${sender.address}, amount:${amount}, erc20TokenAddress:${erc20TokenAddress}`,
    );

    // It is the OFTAdapter contract whose send() func is to be called to transfer tokens cross-chain
    const myOFTAdapterContract = await ethers.getContractAt(
        OFTAdapter_CONTRACT_NAME,
        oftContractAddressOnSrcChain,
        sender,
    );

    const erc20TokenContract = await ethers.getContractAt(
        ERC20_TOKEN_APPROVE_ABI,
        erc20TokenAddress,
        sender,
    );

    const amountInWei = ethers.parseEther(amount);
    const receiverAddressDecoded = bs58.decode(receivingAccountAddress);
    const receiverAddressInBytes32 = zeroPad(receiverAddressDecoded, 32);
    
    // Step 1: the sender approves his erc20 tokens for the OFTAdapter contract
    const approveTx = await erc20TokenContract.approve(oftContractAddressOnSrcChain, amountInWei);
    const approveTxReceipt = await approveTx.wait();
    console.log("sendOFT - approve tx:", approveTxReceipt?.hash);

    // Set the required options for cross-chain send
    let computeUnits = 200000;
    let lamports = 2500000;
    // Set the required options for cross-chain send
    const options = Options.newOptions()
        // addExecutorNativeDropOption is optional
        // .addExecutorNativeDropOption(BigInt(gasDropInWeiOnDestChain), receivingAccountAddress as any)
        // Without addExecutorLzReceiveOption, will get execution reverted. Why???
        .addExecutorLzReceiveOption(BigInt(computeUnits), lamports)
        .toHex()
        .toString();

    // Set the send param
    // https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/oapp/contracts/oft/interfaces/IOFT.sol#L10
    const sendParam = [
        lzEndpointIdOnDestChain,
        receiverAddressInBytes32,
        amountInWei,
        amountInWei,
        options, // additional options
        "0x", // composed message for the send() operation
        "0x", // OFT command to be executed, unused in default OFT implementations
    ];

    // Step 2: call the func quoteSend() to estimate cross-chain fee to be paid in native on the source chain
    // https://github.com/LayerZero-Labs/LayerZero-v2/blob/main/oapp/contracts/oft/interfaces/IOFT.sol#L127C60-L127C73
    // false is set for _payInLzToken Flag indicating whether the caller is paying in the LZ token
    const [nativeFee] = await myOFTAdapterContract.quoteSend(sendParam as any, false);
    console.log("sendOFT - estimated nativeFee:", ethers.formatEther(nativeFee));

    // Step 3: call the func send() to transfer tokens on source chain to destination chain
    const sendTx = await myOFTAdapterContract.send(
        sendParam as any,
        [nativeFee, 0] as any, // set 0 for lzTokenFee
        sender.address, // refund address
        {
            value: nativeFee,
        },
    );
    console.log("tx sent")
    const sendTxReceipt = await sendTx.wait();
    console.log("sendOFT - send tx on source chain:", sendTxReceipt?.hash);

    // Wait for cross-chain tx finalization by LayerZero
    console.log("Wait for cross-chain tx finalization by LayerZero ...");
    const deliveredMsg = await waitForMessageReceived(
        Number(lzEndpointIdOnDestChain),
        sendTxReceipt?.hash as string,
    );
    console.log("sendOFT - received tx on destination chain:", deliveredMsg?.dstTxHash);
}

async function main() {
    const { PATHWAY } = process.env;
    if (!PATHWAY) {
        throw new Error("Missing PATHWAY");
    }

    const [srcChain, destChain] = PATHWAY.split("->");

    const {
        tokenContractAddress,
        oftContractAddress,
        oftContractAddressOnRemoteChain,
        lzEndpointIdOnCurrentChain,
        lzEndpointIdOnRemoteChain
    } = PATHWAY_CONFIG(srcChain, destChain);


    const {
        gasDropInWeiOnDestChain,
        executorLzReceiveOptionMaxGas,
        SENDER_ACCOUNT_PRIV_KEY,
        RECEIVER_ACCOUNT_ADDRESS,
        SEND_AMOUNT,
    } = process.env;

    // Check input params
    if (!oftContractAddress) {
        throw new Error("Missing oftContractAddress");
    } else if (!lzEndpointIdOnCurrentChain) {
        throw new Error("Missing lzEndpointIdOnSrcChain");
    } else if (!lzEndpointIdOnRemoteChain) {
        throw new Error("Missing lzEndpointIdOnDestChain");
    } else if (!gasDropInWeiOnDestChain) {
        throw new Error("Missing gasDropInWeiOnDestChain");
    } else if (!executorLzReceiveOptionMaxGas) {
        throw new Error("Missing executorLzReceiveOptionMaxGas");
    } else if (!SENDER_ACCOUNT_PRIV_KEY) {
        throw new Error("Missing SENDER_ACCOUNT_PRIV_KEY");
    } else if (!RECEIVER_ACCOUNT_ADDRESS) {
        throw new Error("Missing RECEIVER_ACCOUNT_ADDRESS");
    } else if (!SEND_AMOUNT) {
        throw new Error("Missing AMOUNT");
    } else if (!tokenContractAddress) {
        throw new Error("Missing tokenContractAddress");
    }

    await sendOFTViaAdapter(
        oftContractAddress,
        oftContractAddressOnRemoteChain,
        lzEndpointIdOnCurrentChain,
        lzEndpointIdOnRemoteChain,
        gasDropInWeiOnDestChain,
        executorLzReceiveOptionMaxGas,
        SENDER_ACCOUNT_PRIV_KEY,
        RECEIVER_ACCOUNT_ADDRESS,
        SEND_AMOUNT,
        tokenContractAddress
    );
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
