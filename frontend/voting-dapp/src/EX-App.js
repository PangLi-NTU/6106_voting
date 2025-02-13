import './App.css';
import React, { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Voting from "./components/Voting";
import { ethers } from "ethers";
import VotingSystemABI from "./contracts/VotingSystemABI.json";

// 读取 .env 配置
const VOTING_CONTRACTS = [
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_1,
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_2,
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_3
];

const TOKEN_CONTRACT_ADDRESS = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS;

const App = () => {
    const [userAddress, setUserAddress] = useState("");
    const [votingContracts, setVotingContracts] = useState([]);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [registered, setRegistered] = useState(false); // 用户是否已注册
    const [loading, setLoading] = useState(true); // 处理加载状态
    const [admin, setAdmin] = useState(null);

    // 初始化 Provider
    useEffect(() => {
        const initProvider = async () => {
            if (window.ethereum) {
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(newProvider);
            }
        };
        initProvider();
    }, []);

    // 加载 Voting 合约
    useEffect(() => {
        const loadContracts = async () => {
            if (provider) {
                try {
                    const signer = await provider.getSigner();
                    setSigner(signer);

                    const contracts = VOTING_CONTRACTS.map(address => {
                        return new ethers.Contract(address, VotingSystemABI, signer);
                    });
                    setVotingContracts(contracts);
                    setLoading(false); // 数据加载完成
                } catch (error) {
                    console.error("❌ Failed to load contract:", error);
                    setLoading(false);
                }
            }
        };
        loadContracts();
    }, [provider]);

    useEffect(() => {
        const fetchAdmin = async () => {
            if (votingContracts.length > 0) {
                try {
                    const adminAddress = await votingContracts[0].admin(); // 获取管理员地址
                    setAdmin(adminAddress);
                    console.log("🔹 Contract administrator:", adminAddress);
                } catch (error) {
                    console.error("❌ Failed to obtain administrator:", error);
                }
            }
        };

        fetchAdmin();
    }, [votingContracts]); 

    // 检查用户是否已注册
    useEffect(() => {
        const checkRegistration = async () => {
            if (votingContracts.length > 0 && userAddress) {
                try {
                    const registeredStatus = await votingContracts[0].registeredUsers(userAddress);
                    setRegistered(registeredStatus);
                } catch (error) {
                    console.error("❌ Failed to check registration status:", error);
                }
            }
        };
        checkRegistration();
    }, [votingContracts, userAddress]);

    // 用户注册
    const registerUser = async () => {
        if (!signer || votingContracts.length === 0) return;
        try {
            console.log("📜 正在注册...");
            const tx = await votingContracts[0].register();
            console.log("✅ 注册交易已发起: ", tx);
            await tx.wait();
            console.log("✅ 注册成功！");
            setRegistered(true);
            alert("✅ Registration successful! 20 tokens have been received！");
        } catch (error) {
            console.error("❌ Registration failed:", error);
            alert("❌ Registration failed. Please check if the MetaMask transaction is confirmed！");
        }
    };

    return (
        <div className="App">
            <h1>🗳️ Voting system based on ERC-20 tokens</h1>
            {/* 显示管理员地址 */}
            {admin && <p>🔑 Contract administrator: {admin}</p>}

            {/* 连接钱包 */}
            <ConnectWallet setUserAddress={setUserAddress} />

            {/* 显示注册按钮（如果未注册） */}
            {!registered && userAddress && (
                <button onClick={registerUser} className="register-btn">📜 Register and claim 20 tokens</button>
            )}

            {/* 显示投票合约 */}
            {loading ? (
                <p>⏳ Loading voting data...</p>
            ) : userAddress && votingContracts.length > 0 ? (
                votingContracts.map((contract, index) => (
                    <Voting
                        key={index}
                        contract={contract}
                        userAddress={userAddress}
                        tokenAddress={TOKEN_CONTRACT_ADDRESS}
                    />
                ))
            ) : (
                <p>⚠️ Failed to load the voting contract. Please check the network and contract address</p>
            )}
        </div>
    );
};

export default App;