import React from "react";
import { useParams } from "react-router-dom";
import Voting from "./Voting";

const VotingDetail = ({ contracts, userAddress, tokenAddress }) => {
    let { id } = useParams(); // 获取 URL 中的投票 ID
    const contract = contracts[id];

    if (!contract) {
        return <p>⚠️ Invalid voting session. Please return to the home page.</p>;
    }

    return (
        <div>
            <h2>🗳️ Voting Session {id}</h2>
            <Voting contract={contract} userAddress={userAddress} tokenAddress={tokenAddress} />
        </div>
    );
};

export default VotingDetail;
