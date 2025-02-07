import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setUserAddress }) => {
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                setUserAddress(accounts[0]);
            } catch (error) {
                console.error("连接 MetaMask 失败", error);
            }
        } else {
            alert("请安装 MetaMask");
        }
    };

    return (
        <div>
            <button onClick={connectWallet}>
                {account ? `已连接: ${account.substring(0, 6)}...` : "连接 MetaMask"}
            </button>
        </div>
    );
};

export default ConnectWallet;