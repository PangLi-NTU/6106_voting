import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import VotingList from "./components/VotingList";
import VotingDetail from "./components/VotingDetail";
import { ethers } from "ethers";
import VotingSystemABI from "./contracts/VotingSystemABI.json";

const VOTING_CONTRACTS = [
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_1,
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_2,
    process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_3
];

const TOKEN_CONTRACT_ADDRESS = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS;

const App = () => {
    const [userAddress, setUserAddress] = useState("");
    const [votingContracts, setVotingContracts] = useState([]);
    const [registered, setRegistered] = useState(false); // 用户是否已注册
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [votingPurposes, setVotingPurposes] = useState([]); // 存储投票目的
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
                    setLoading(false);
                } catch (error) {
                    console.error("❌ Failed to load contract:", error);
                    setLoading(false);
                }
            }
        };
        loadContracts();
    }, [provider]);

    // ✅ 加载投票目的（Voting Purpose）
    useEffect(() => {
        const loadVotingPurposes = async () => {
            if (!provider) return; // 确保 provider 存在
            const signer = await provider.getSigner();

            let purposes = [];
            for (const address of VOTING_CONTRACTS) {
                const contract = new ethers.Contract(address, VotingSystemABI, signer);
                try {
                    const purpose = await contract.getPurpose(); // 获取投票目的
                    purposes.push({ address, purpose });
                } catch (error) {
                    console.error(`❌ Failed to load voting purpose from ${address}:`, error);
                    purposes.push({ address, purpose: "Unknown" });
                }
            }
            setVotingPurposes(purposes);
        };

        if (votingContracts.length > 0) {
            loadVotingPurposes();
        }
    }, [votingContracts]); // 依赖 `votingContracts`，等它加载完成

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
        <Router>
            <div className="App">
                <h1>🗳️ Voting system based on ERC-20 tokens</h1>
                <ConnectWallet setUserAddress={setUserAddress} />

                {/* 显示注册按钮（如果未注册） */}
                {!registered && userAddress && (
                    <button onClick={registerUser} className="register-btn">📜 Register and claim 20 tokens</button>
                )}

                <Routes>
                    {/* ✅ 主页传递 votingPurposes */}
                    <Route path="/" element={<VotingList contracts={votingContracts} purposes={votingPurposes} />} />

                    {/* 投票详情页 */}
                    <Route path="/vote/:id" element={
                        <VotingDetail contracts={votingContracts} userAddress={userAddress} tokenAddress={TOKEN_CONTRACT_ADDRESS} />
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
