import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Register from "./components/Register";
import Approve from "./components/Approve";
import Voting from "./components/Voting";
import Results from "./components/Results";
import config from "./config";  // ✅ 统一管理合约地址
import "./App.css";

const App = () => {
  const [userAddress, setUserAddress] = useState("");

  console.log("Voting Contract Address:", config.VOTING_CONTRACT_ADDRESS);
  console.log("Token Contract Address:", config.TOKEN_CONTRACT_ADDRESS);
  console.log("Infura API:", config.INFURA_API);

  return (
    <div className="App">
      <h1>基于 ERC20 代币的投票系统</h1>
      
      {/* 连接钱包 */}
      <ConnectWallet setUserAddress={setUserAddress} />

      {/* 注册并领取代币 */}
      {userAddress && <Register contractAddress={config.VOTING_CONTRACT_ADDRESS} userAddress={userAddress} />}

      {/* 代币授权 */}
      {userAddress && <Approve tokenAddress={config.TOKEN_CONTRACT_ADDRESS} votingContractAddress={config.VOTING_CONTRACT_ADDRESS} />}

      {/* 投票 */}
      {userAddress && <Voting contractAddress={config.VOTING_CONTRACT_ADDRESS} userAddress={userAddress} />}

      {/* 显示投票结果 */}
      {userAddress && <Results contractAddress={config.VOTING_CONTRACT_ADDRESS} />}
    </div>
  );
};

export default App;