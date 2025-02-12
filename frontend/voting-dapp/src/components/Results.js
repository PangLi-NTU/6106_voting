import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";
import config from "../config"; // 读取合约地址

const Results = () => {
    const [votingPurpose, setVotingPurpose] = useState("");

    useEffect(() => {
        const fetchVotingPurpose = async () => {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(config.VOTING_CONTRACT_ADDRESS, VotingSystemABI, signer);

                const purpose = await contract.getPurpose();
                setVotingPurpose(purpose);
            } catch (error) {
                console.error("获取投票目的失败", error);
            }
        };
        fetchVotingPurpose();
    }, []);

    return (
        <div>
            <h2>🗳️ 投票主题: {votingPurpose || "Who is the cutest ? "}</h2>
        </div>
    );
};

export default Results;