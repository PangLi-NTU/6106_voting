import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Register from "./components/Register";
import Approve from "./components/Approve";
import Voting from "./components/Voting";
import Results from "./components/Results";

const App = () => {
    const [userAddress, setUserAddress] = useState("");

    return (
        <div>
            <h1>ERC-20 代币投票系统</h1>
            <ConnectWallet setUserAddress={setUserAddress} />
            {userAddress && (
                <>
                    <Register userAddress={userAddress} />
                    <Approve userAddress={userAddress} />
                    <Voting userAddress={userAddress} />
                    <Results />
                </>
            )}
        </div>
    );
};

export default App;
