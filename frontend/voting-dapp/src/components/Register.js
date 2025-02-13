import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";

const votingContractAddress = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS_1;

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

                const alreadyRegistered = await contract.isRegistered(userAddress); 
                setIsRegistered(alreadyRegistered);
            } catch (error) {
                console.error("Failed to check registration status", error);
            }
        };
        checkRegistration();
    }, [userAddress]);

    // 处理注册
    const register = async () => {
        if (!window.ethereum) return alert("Please install MetaMask to continue！");
        if (!userAddress) return alert("Please connect to MetaMask first");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(votingContractAddress, VotingSystemABI, signer);

        try {
            const tx = await contract.register();
            await tx.wait();
            alert("Registration successful! 20 ERC-20 tokens have been claimed");
            setIsRegistered(true);
        } catch (error) {
            console.error("Registration failed", error);
            alert("⚠️ Registration failed. Please check if your wallet has enough gas fees");
        }
    };

    return (
        <div>
            {isRegistered ? (
                <p>You are already registered. No further action is needed！</p>
            ) : (
                <button onClick={register}>📝 Register and claim 20 tokens</button>
            )}
        </div>
    );
};

export default Register;