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
    const [signer, setSigner] = useState(null);
    const [registered, setRegistered] = useState(false); // 记录用户是否已注册

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
                const signer = await provider.getSigner();
                setSigner(signer);

                // const contracts = contractAddresses.map(address => new ethers.Contract(address, VotingSystemABI, provider));
                const contracts = contractAddresses.map(address => {
                    return new ethers.Contract(address, VotingSystemABI, signer);
                });
                setVotingContracts(contracts);
            }
        };
        loadContracts();
    }, [provider]);

    // 检查用户是否已经注册
    useEffect(() => {
        const checkRegistration = async () => {
            if (votingContracts.length > 0 && userAddress) {
                try {
                    const registeredStatus = await votingContracts[0].registeredUsers(userAddress);
                    setRegistered(registeredStatus);
                } catch (error) {
                    console.error("检查注册状态失败:", error);
                }
            }
        };
        checkRegistration();
    }, [votingContracts, userAddress]);
    
    // 注册函数
    const registerUser = async () => {
        if (!signer || votingContracts.length === 0) return;
        try {
            const tx = await votingContracts[0].register(); // 假设所有合约都共享同一个注册逻辑
            await tx.wait();
            setRegistered(true);
        } catch (error) {
            console.error("注册失败:", error);
        }
    };

    return (
        <div className="App">
            <h1>🗳️ 基于 ERC20 代币的投票系统</h1>

            {/* 连接钱包 */}
            <ConnectWallet setUserAddress={setUserAddress} />

            {/* 🔹 如果用户未注册，显示注册按钮 */}
            {!registered && userAddress && (
                <button onClick={registerUser} className="register-btn">📜 注册并领取 20 代币</button>
            )}

            {/* 显示投票合约 */}
            {userAddress && votingContracts.length > 0 ? (
                votingContracts.map((contract, index) => (
                    <Voting key={index} contract={contract} userAddress={userAddress} />
                ))
            ) : (
                <p>⏳ 正在加载投票数据...</p>
            )}
        </div>
    );
};

export default App;