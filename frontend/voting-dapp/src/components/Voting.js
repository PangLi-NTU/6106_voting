import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Voting = ({ contract, userAddress, tokenAddress }) => {
    const [options, setOptions] = useState([]);
    const [purpose, setPurpose] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (!contract) return;

        const fetchPurposeAndOptions = async () => {
            try {
                const purposeText = await contract.getPurpose();
                setPurpose(purposeText);
                const count = await contract.optionsCount();
                let optionsArray = [];
                for (let i = 0; i < count; i++) {
                    const option = await contract.options(i);
                    optionsArray.push({ name: option.name, voteCount: (await contract.getOption(i)).voteCount.toString(), id: i });
                }
                setOptions(optionsArray);
            } catch (error) {
                console.error("❌ 加载投票信息失败:", error);
            }
        };

        fetchPurposeAndOptions();
    }, [contract]);

    // **🔥 解决问题: 发送交易需要 Signer**
    const getSigner = async () => {
        if (!window.ethereum) {
            console.error("❌ MetaMask 未安装");
            return null;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.getSigner();
    };

    // **🔥 1️⃣ 先批准 MTK 代币**
    const approveToken = async () => {
        try {
            const signer = await getSigner();
            if (!signer) return;

            const tokenContract = new ethers.Contract(tokenAddress, [
                "function approve(address spender, uint256 amount) external returns (bool)"
            ], signer);

            const tx = await tokenContract.approve(contract.target, ethers.parseUnits(amount.toString(), 18));
            await tx.wait();
            alert("✅ 授权成功！");
        } catch (error) {
            console.error("❌ 授权失败:", error);
        }
    };

    // **🔥 2️⃣ 进行投票**
    const vote = async (optionId) => {
        try {
            const signer = await getSigner();
            if (!signer) return;

            const contractWithSigner = contract.connect(signer);

            const tx = await contractWithSigner.vote(optionId, ethers.parseUnits(amount.toString(), 18));
            await tx.wait();
            alert("✅ 投票成功！");
        } catch (error) {
            console.error("❌ 投票失败:", error);
        }
    };

    return (
        <div>
            <h2>📜 <b>{purpose}</b></h2>
            <input
                type="number"
                placeholder="输入投票代币数量"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={approveToken}>🔓 授权代币</button>
            <ul>
                {options.map((option, index) => (
                    <li key={index}>
                        {option.name} - 票数: {ethers.formatUnits(option.voteCount, 18)}
                        <button onClick={() => vote(option.id)}>🗳️ 投票</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Voting;