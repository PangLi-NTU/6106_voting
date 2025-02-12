import React, { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers"; // ✅ 适配 ethers v6
import ERC20ABI from "../contracts/ERC20ABI.json";
import config from "../config"; // ✅ 从 config.js 读取环境变量

const Approve = ({ userAddress }) => {
    const [amount, setAmount] = useState("20");

    const tokenAddress = config.TOKEN_CONTRACT_ADDRESS;
    const votingAddress = config.VOTING_CONTRACT_ADDRESS;

    const approve = async () => {
        if (!window.ethereum) {
            return alert("❌ 请安装 MetaMask 以继续！");
        }
        if (!userAddress) {
            return alert("⚠️ 请先连接 MetaMask");
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const tokenContract = new Contract(tokenAddress, ERC20ABI, signer);

            // 解析输入金额
            const parsedAmount = parseUnits(amount, 18);
            if (parsedAmount.lte(0)) return alert("❌ 请输入有效的批准金额！");

            // 执行 approve 交易
            const tx = await tokenContract.approve(votingAddress, parsedAmount);
            await tx.wait();

            alert(`🎉 成功批准 ${amount} 代币用于投票`);
            setAmount(""); // 清空输入框
        } catch (error) {
            console.error("❌ 批准失败", error);
            if (error.code === "ACTION_REJECTED") {
                alert("⚠️ 交易被用户拒绝");
            } else {
                alert("❌ 交易失败，请检查钱包余额或 Gas 费用");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="输入批准金额"
            />
            <button onClick={approve}>✅ 批准投票</button>
        </div>
    );
};

export default Approve;