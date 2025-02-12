import './App.css';
import React, { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Voting from "./components/Voting";
import { ethers } from "ethers";
import config from "./config";
import VotingSystemABI from "./contracts/VotingSystemABI.json";

const App = () => {
    const [userAddress, setUserAddress] = useState("");
    const [votingContracts, setVotingContracts] = useState([]);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(newProvider);
        }
    }, []);

    useEffect(() => {
        const contractAddresses = [config.VOTING_CONTRACT_ADDRESS_1, config.VOTING_CONTRACT_ADDRESS_2, config.VOTING_CONTRACT_ADDRESS_3];
        const loadContracts = async () => {
            if (provider) {
                const contracts = contractAddresses.map(address => new ethers.Contract(address, VotingSystemABI, provider));
                setVotingContracts(contracts);
            }
        };
        loadContracts();
    }, [provider]);

    return (
        <div className="App">
            <h1>🗳️ 基于 ERC20 代币的投票系统</h1>
            <ConnectWallet setUserAddress={setUserAddress} />
            {userAddress && votingContracts.length > 0 ? (
                votingContracts.map((contract, index) => (
                    <Voting key={index} contract={contract} userAddress={userAddress} tokenAddress={config.TOKEN_CONTRACT_ADDRESS} />
                ))
            ) : (
                <p>⏳ 正在加载投票数据...</p>
            )}
        </div>
    );
};

export default App;