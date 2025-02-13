import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers"; // 适配 ethers v6
import ERC20ABI from "../contracts/ERC20ABI.json";
import config from "../config"; // 从 config.js 读取环境变量

const Approve = ({ userAddress }) => {
    const [amount, setAmount] = useState("20");

    const tokenAddress = config.TOKEN_CONTRACT_ADDRESS;
    const votingAddress = config.VOTING_CONTRACT_ADDRESS;

    const approve = async () => {
        if (!window.ethereum) {
            return alert("❌ Please install MetaMask to continue！");
        }
        if (!userAddress) {
            return alert("⚠️ Please connect to MetaMask first");
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const tokenContract = new Contract(tokenAddress, ERC20ABI, signer);

            // 解析输入金额
            const parsedAmount = parseUnits(amount, 18);
            if (parsedAmount.lte(0)) return alert("❌ Please enter a valid approval amount！");

            // 执行 approve 交易
            const tx = await tokenContract.approve(votingAddress, parsedAmount);
            await tx.wait();

            alert(`🎉 Successfully approved ${amount} tokens for voting`);
            setAmount(""); // 清空输入框
        } catch (error) {
            console.error("❌ Approval failed", error);
            if (error.code === "ACTION_REJECTED") {
                alert("⚠️ Transaction rejected by the user");
            } else {
                alert("❌ Transaction failed. Please check your wallet balance or gas fees");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter approval amount"
            />
            <button onClick={approve}>✅ Approve voting</button>
        </div>
    );
};

export default Approve;