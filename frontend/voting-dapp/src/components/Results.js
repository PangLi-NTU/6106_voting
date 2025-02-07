import React, { useState } from "react";
import { ethers } from "ethers";
import VotingSystemABI from "../contracts/VotingSystemABI.json";
import { REACT_APP_VOTING_CONTRACT } from "../config";

const Results = () => {
    const [winner, setWinner] = useState("");

    const getWinner = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(REACT_APP_VOTING_CONTRACT, VotingSystemABI, provider);

        const [winningOption, votes] = await contract.getWinner();
        setWinner(`当前领先者: ${winningOption}（${votes} 票）`);
    };

    return (
        <div>
            <button onClick={getWinner}>获取投票结果</button>
            <p>{winner}</p>
        </div>
    );
};

export default Results;