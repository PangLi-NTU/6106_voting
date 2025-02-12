import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";

const votingContractAddress = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS;

const Register = ({ userAddress }) => {
    const [isRegistered, setIsRegistered] = useState(false);

    // 页面加载时自动检查是否已注册
    useEffect(() => {
        const checkRegistration = async () => {
            if (!window.ethereum || !userAddress) return;
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(votingContractAddress, VotingSystemABI, signer);

                const alreadyRegistered = await contract.isRegistered(userAddress); // 假设合约有 `isRegistered` 方法
                setIsRegistered(alreadyRegistered);
            } catch (error) {
                console.error("检查注册状态失败", error);
            }
        };
        checkRegistration();
    }, [userAddress]);

    // 处理注册
    const register = async () => {
        if (!window.ethereum) return alert("请安装 MetaMask 以继续！");
        if (!userAddress) return alert("请先连接 MetaMask");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(votingContractAddress, VotingSystemABI, signer);

        try {
            const tx = await contract.register();
            await tx.wait();
            alert("注册成功！已领取 20 ERC-20 代币");
            setIsRegistered(true);
        } catch (error) {
            console.error("注册失败", error);
            alert("⚠️ 注册失败，请检查钱包是否有足够的 Gas 费");
        }
    };

    return (
        <div>
            {isRegistered ? (
                <p>你已注册，无需重复操作！</p>
            ) : (
                <button onClick={register}>📝 注册并领取 20 代币</button>
            )}
        </div>
    );
};

export default Register;