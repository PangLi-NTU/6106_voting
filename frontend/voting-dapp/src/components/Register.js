import React from "react";
import { ethers } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";
import { REACT_APP_VOTING_CONTRACT } from "../config";

const Register = ({ userAddress }) => {
    const register = async () => {
        if (!userAddress) return alert("请先连接 MetaMask");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(REACT_APP_VOTING_CONTRACT, VotingSystemABI, signer);

        try {
            const tx = await contract.register();
            await tx.wait();
            alert("注册成功！已领取 20 ERC-20 代币");
        } catch (error) {
            console.error("注册失败", error);
        }
    };

    return (
        <div>
            <button onClick={register}>注册并领取 20 代币</button>
        </div>
    );
};

export default Register;