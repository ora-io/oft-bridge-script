const CHAIN_CONFIG: any = {
    ARBITRUM: {
        oftContractAddress: "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
        lzEndpointIdOnCurrentChain: 30110,
    },
    BASE: {
        oftContractAddress: "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
        lzEndpointIdOnCurrentChain: 30184,
    },
    BINANCE: {
        oftContractAddress: "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
        lzEndpointIdOnCurrentChain: 30102,
    },
    ETHEREUM: {
        tokenContractAddress: "0x33333333fede34409fb7f67c6585047e1f653333",
        oftContractAddress: "0x5e1f75388dc768f6129b9ee859bfb1361631a77e",
        lzEndpointIdOnCurrentChain: 30101,
    },
    SOLANA: {
        oftContractAddress: "BVf9xuRTRLmb8DjfaxDgPuGBdy9qTnspLwYpDpfdUoAY",
        lzEndpointIdOnCurrentChain: 30168
    }
};

const PATHWAY_CONFIG = (srcChain: string, destChain: string) => {
    if (!CHAIN_CONFIG[srcChain]) {
        throw new Error(`Chain config for ${srcChain} missing`);
    } else if (!CHAIN_CONFIG[destChain]) {
        throw new Error(`Chain config for ${destChain} missing`);
    }

    return {
        ...CHAIN_CONFIG[srcChain],
        lzEndpointIdOnRemoteChain: CHAIN_CONFIG[destChain].lzEndpointIdOnCurrentChain,
        oftContractAddressOnRemoteChain: CHAIN_CONFIG[srcChain].oftContractAddress,
    };
};

export default PATHWAY_CONFIG;
