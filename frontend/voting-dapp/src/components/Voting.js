import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers"; // ✅ 直接导入 parseUnits
import VotingSystemABI from "../contracts/VotingSystemABI.json";
import config from "../config";

const Voting = ({ userAddress }) => {
    const [optionId, setOptionId] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const loadContract = async () => {
            if (!window.ethereum) return alert("请安装 MetaMask 以继续！");
            
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(config.VOTING_CONTRACT_ADDRESS, VotingSystemABI, signer);

            console.log("📌 合约加载成功:", contract);
        };

        loadContract();
    }, []);

    const vote = async () => {
        if (!userAddress) return alert("请先连接 MetaMask");
        if (!optionId || !amount) return alert("⚠️ 请输入有效的选项 ID 和投票数！");

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(config.VOTING_CONTRACT_ADDRESS, VotingSystemABI, signer);

            const tx = await contract.vote(optionId, parseUnits(amount, 18)); // ✅ 直接使用 parseUnits
            await tx.wait();
            alert("🎉 投票成功！");
            setOptionId("");
            setAmount("");
        } catch (error) {
            console.error("投票失败", error);
            alert("投票失败，请检查钱包是否有足够的余额或 Gas 费");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={optionId}
                onChange={(e) => setOptionId(e.target.value)}
                placeholder="请输入选项 ID"
            />
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入投票数 (代币数)"
            />
            <button onClick={vote}>🗳️ 提交投票</button>
        </div>
    );
};

export default Voting;