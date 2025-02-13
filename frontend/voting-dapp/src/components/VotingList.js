import React from "react";
import { Link } from "react-router-dom";
import "./VotingList.css"; // 记得加 CSS

const VotingList = ({ contracts, purposes }) => {
    return (
        <div className="voting-list-container">
            <h2>📜 Available Voting Topics</h2>
            <div className="voting-grid">
                {contracts.map((contract, index) => (
                    <div key={index} className="voting-card">
                        <h3>📦 {purposes[index]?.purpose || "Loading..."}</h3>
                        <Link to={`/vote/${index}`} className="vote-button">🗳️ Go to Vote</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VotingList;
