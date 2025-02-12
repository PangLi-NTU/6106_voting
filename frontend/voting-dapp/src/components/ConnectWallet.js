import React, { useState, useEffect } from "react";
import config from "../config"; // 统一从 config.js 读取合约地址

const ConnectWallet = ({ setUserAddress }) => {
    const [account, setAccount] = useState("");

    console.log("CW:Voting Contract Address:", config.VOTING_CONTRACT_ADDRESS);
    console.log("CW:Token Contract Address:", config.TOKEN_CONTRACT_ADDRESS);
    console.log("CW:Voting Contract Address:", process.env.REACT_APP_VOTING_CONTRACT_ADDRESS);
    console.log("CW:Token Contract Address:", process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS);


    // 自动检查钱包连接状态 & 监听账户变化
    useEffect(() => {
        const checkWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_accounts" });
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                        setUserAddress(accounts[0]);
                    }
                } catch (error) {
                    console.error("检查钱包失败", error);
                }
            }
        };

        checkWallet();

        // 监听 MetaMask 账户切换
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setUserAddress(accounts[0]);
                } else {
                    setAccount(""); // 用户断开连接
                    setUserAddress("");
                }
            });
        }
    }, [setUserAddress]);

    useEffect(() => {
        console.log("当前 userAddress:", account);
    }, [account]);

    // 连接钱包
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("❌ 请安装 MetaMask 以继续！");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            setUserAddress(accounts[0]);
        } catch (error) {
            if (error.code === 4001) {
                alert("⚠️ 用户拒绝连接 MetaMask");
            } else {
                console.error("连接 MetaMask 失败:", error);
                alert("❌ 连接钱包失败，请检查 MetaMask 或刷新页面重试！");
            }
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>
                {account ? `✅ 已连接: ${account.substring(0, 6)}...${account.slice(-4)}` : "🔗 连接 MetaMask"}
            </button>
        </div>
    );
};

export default ConnectWallet;