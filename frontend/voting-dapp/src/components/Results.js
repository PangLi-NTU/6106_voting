import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";
import config from "../config";

const Results = ({ userAddress }) => {
    const [optionId, setOptionId] = useState("");
    const [amount, setAmount] = useState("");

    const vote = async () => {
        if (!userAddress) return alert("请先连接 MetaMask");

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(config.VOTING_CONTRACT_ADDRESS, VotingSystemABI, signer);

        try {
            const tx = await contract.vote(optionId, parseUnits(amount, 18));
            await tx.wait();
            alert("投票成功！");
        } catch (error) {
            console.error("投票失败", error);
        }
    };

    return (
        <div>
            <input type="text" value={optionId} onChange={(e) => setOptionId(e.target.value)} placeholder="选项 ID" />
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="投票数 (代币数)" />
            <button onClick={vote}>提交投票</button>
        </div>
    );
};

export default Results;