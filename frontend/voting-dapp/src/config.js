const config = {
    VOTING_CONTRACT_ADDRESS: process.env.REACT_APP_VOTING_CONTRACT_ADDRESS || "0x253a5975f237f5ca0653d252e2c3f755245f3c79",
    TOKEN_CONTRACT_ADDRESS: process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS || "0x026f26c8df4eee0f14c7505ed5f95d9f8ab584d9",
    INFURA_API: process.env.REACT_APP_INFURA_API || "https://sepolia.infura.io/v3/6a1fe97942ec4a0b9dafdf907ad0f370"
};

export default config;