const CHAIN_CONFIG: any = {
    ARBITRUM: {
        oftContractAddress: "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
        lzEndpointIdOnCurrentChain: 30110,
    },
    BASE: {
        tokenContractAddress: "0x102Cd3E9E14810cE6f0765227E971432BCE05d6C",
        oftContractAddress: "0xe974eC9A526ba233B8D1359bCAa83d4F9c702Cc7",
        lzEndpointIdOnCurrentChain: 30184,
    },
    BINANCE: {
        oftContractAddress: "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
        lzEndpointIdOnCurrentChain: 30102,
    },
    ETHEREUM: {
        oftContractAddress: "0x5e1f75388dc768f6129b9ee859bfb1361631a77e",
        lzEndpointIdOnCurrentChain: 30101,
    },
    SOLANA: {
        oftContractAddress: "G6qx5Anbzn8tuF1mazD6sYT3crwufhZak3HB1P1nWfhX",
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
