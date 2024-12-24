import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

const ACCOUNTS = process.env.SENDER_ACCOUNT_PRIV_KEY
    ? [`${process.env.SENDER_ACCOUNT_PRIV_KEY}`]
    : [];

const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const BASE_RPC_URL = process.env.BASE_RPC_URL;
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL;
const BSC_MAINNET_RPC_URL = process.env.BSC_MAINNET_RPC_URL;

module.exports = {
    defaultNetwork: "hardhat",
    gasReporter: {
        enabled: false,
    },
    networks: {
        //hardhat: { chainId: 31337 },
        localhost: {
            chainId: 31337,
            url: "http://127.0.0.1:8545",
            accounts: ACCOUNTS,
        },
        polygon: {
            chainId: 137,
            url: "https://polygon-mainnet.public.blastapi.io", // "https://polygon-pokt.nodies.app",
            accounts: ACCOUNTS,
        },
        ethereum: {
            chainId: 1,
            url: ETHEREUM_RPC_URL,
            accounts: ACCOUNTS,
        },
        base: {
            chainId: 8453,
            url: BASE_RPC_URL,
            accounts: ACCOUNTS,
        },
        avalanche: {
            chainId: 43114,
            url: "https://avalanche.drpc.org",
            accounts: ACCOUNTS,
        },
        arbitrum: {
            chainId: 42161,
            url: ARBITRUM_RPC_URL,
            accounts: ACCOUNTS,
        },
        binance: {
            chainId: 56,
            url: BSC_MAINNET_RPC_URL,
            accounts: ACCOUNTS,
        }
    },
    etherscan: {
        customChains: [
            {
                network: "bnbMainnet",
                chainId: 56,
                urls: {
                    apiURL: "https://api.bscscan.com/api",
                    browserURL: "https://bscscan.com",
                },
            },
            {
                network: "polygon",
                chainId: 137,
                urls: {
                    apiURL: "https://api.polygonscan.com/api",
                    browserURL: "https://polygonscan.com",
                },
            },
            {
                network: "ethereum",
                chainId: 1,
                urls: {
                    apiURL: "https://api.etherscan.io/api",
                    browserURL: "https://etherscan.io",
                },
            },
            {
                network: "fantom",
                chainId: 250,
                urls: {
                    apiURL: "https://api.ftmscan.com/api",
                    browserURL: "https://ftmscan.com",
                },
            },
            {
                network: "optimism",
                chainId: 10,
                urls: {
                    apiURL: "https://api-optimistic.etherscan.io/api",
                    browserURL: "https://optimistic.etherscan.io/",
                },
            },
            {
                network: "base",
                chainId: 8453,
                urls: {
                    apiURL: "https://api.basescan.org/api",
                    browserURL: "https://basescan.org",
                },
            },
            {
                network: "avalanche",
                chainId: 43114,
                urls: {
                    apiURL: "https://api.avascan.info/v2/network/mainnet/evm/43114/etherscan",
                    browserURL: "https://avascan.info",
                },
            },
            {
                network: "arbitrum",
                chainId: 42161,
                urls: {
                    apiURL: "https://api.arbiscan.io/api",
                    browserURL: "https://arbiscan.io",
                },
            },
        ],
    },
    sourcify: {
        enabled: false,
    },
    solidity: {
        version: "0.8.22",
        settings: {
            evmVersion: "paris",
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    paths: {
        sources: "./src",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
};