import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import config from "../config"; // 从 config.js 读取投票合约地址
import VotingSystemABI from "../contracts/VotingSystemABI.json";

const Voting = ({ userAddress }) => {
    const [optionId, setOptionId] = useState("");
    const [amount, setAmount] = useState("");

    // 处理投票逻辑
    const vote = async () => {
        if (!window.ethereum) {
            return alert("请安装 MetaMask 以继续！");
        }
        if (!userAddress) {
            return alert("请先连接 MetaMask");
        }
        if (!optionId || !amount) {
            return alert("⚠️ 请输入有效的选项 ID 和投票数！");
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(config.VOTING_CONTRACT_ADDRESS, VotingSystemABI, signer);

            // 解析代币数量，防止 BigInt 兼容性问题
            const tx = await contract.vote(optionId, parseUnits(amount, 18).toString());
            await tx.wait();
            alert("🎉 投票成功！");

            // 清空输入框
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