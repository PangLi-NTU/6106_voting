import React, { useState } from "react";
import { ethers } from "ethers";
import ERC20ABI from "../contracts/ERC20ABI.json";
import { REACT_APP_TOKEN_CONTRACT, REACT_APP_VOTING_CONTRACT } from "../config";

const Approve = ({ userAddress }) => {
    const [amount, setAmount] = useState("20");

    const approve = async () => {
        if (!userAddress) return alert("请先连接 MetaMask");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(REACT_APP_TOKEN_CONTRACT, ERC20ABI, signer);

        try {
            const tx = await tokenContract.approve(REACT_APP_VOTING_CONTRACT, ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert(`成功批准 ${amount} 代币用于投票`);
        } catch (error) {
            console.error("批准失败", error);
        }
    };

    return (
        <div>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={approve}>批准投票</button>
        </div>
    );
};

export default Approve;