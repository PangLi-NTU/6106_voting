import { useState, useEffect } from "react";
import { ethers } from "ethers";

const Voting = ({ contract, userAddress, tokenAddress }) => {
    const [options, setOptions] = useState([]);
    const [purpose, setPurpose] = useState("");
    const [amount, setAmount] = useState(0);
    const [isApproved, setIsApproved] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newOption, setNewOption] = useState("");

    useEffect(() => {
        if (!contract || !userAddress) return;

        const checkAdmin = async () => {
            try {
                const adminAddress = await contract.admin();
                console.log("🔹 Contract Admin:", adminAddress);

                setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());
            } catch (error) {
                console.error("❌ Failed to obtain administrator:", error);
            }
        };

        checkAdmin();

        const fetchPurposeAndOptions = async () => {
            try {
                const purposeText = await contract.getPurpose();
                setPurpose(purposeText);

                const count = await contract.optionsCount();
                let optionsArray = [];
                for (let i = 0; i < count; i++) {
                    const option = await contract.getOption(i);
                    optionsArray.push({
                        name: option.name,
                        voteCount: ethers.formatUnits(option.voteCount, 18),
                        id: i
                    });
                }
                setOptions(optionsArray);
            } catch (error) {
                console.error("❌ Failed to load voting information:", error);
            }
        };

        fetchPurposeAndOptions();
    }, [contract, userAddress]);

    // Only admin can add options
    const addNewOption = async () => {
        if (!isAdmin || !newOption) return;
    
        try {
            const signer = await getSigner(); // Get MetaMask signer
            if (!signer) {
                console.error("❌ Failed to obtain signer");
                return;
            }
    
            const contractWithSigner = contract.connect(signer); // Connect contract instance to signer
            const tx = await contractWithSigner.addOption(newOption);
            console.log("✅ Transaction sent:", tx);
    
            await tx.wait();
            alert("✅ Option added successfully!");
            setNewOption("");  // Clear input field
        } catch (error) {
            console.error("❌ Failed to add option:", error);
        }
    };

    // Get Signer
    const getSigner = async () => {
        if (!window.ethereum) {
            console.error("❌ MetaMask not installed");
            alert("⚠️ Please install the MetaMask extension!");
            return null;
        }
    
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            return await provider.getSigner();
        } catch (error) {
            console.error("❌ Failed to get Signer:", error);
            alert("⚠️ Failed to get Signer, please check if MetaMask is properly connected!");
            return null;
        }
    };

    // Approve MTK tokens
    const approveToken = async () => {
        try {
            const signer = await getSigner();
            if (!signer) return;
    
            const tokenContract = new ethers.Contract(tokenAddress, [
                "function approve(address spender, uint256 amount) external returns (bool)"
            ], signer);
    
            const formattedAmount = ethers.parseUnits(amount.toString(), 18);
    
            // Get contract address
            const contractAddress = contract.target || contract.address;
    
            if (!contractAddress) {
                console.error("❌ Contract address is empty, unable to execute approval!");
                alert("❌ Contract address is empty, please check the contract instance!");
                return;
            }
    
            console.log(`🟢 Attempting to approve ${amount} MTK (actual value: ${formattedAmount}) to ${contractAddress}`);
    
            const tx = await tokenContract.approve(contractAddress, formattedAmount);
            console.log("✅ Approval transaction sent:", tx);
    
            await tx.wait();
            console.log("✅ Approval successful, transaction confirmed!");
            alert("✅ Approval successful!");
    
            setIsApproved(true);
        } catch (error) {
            console.error("❌ Approval failed:", error);
            alert(`❌ Approval failed: ${error.message}`);
        }
    };

    // Voting function
    const vote = async (optionId) => {
        try {
            const signer = await getSigner();
            if (!signer) return;

            const contractWithSigner = contract.connect(signer);
            const formattedAmount = ethers.parseUnits(amount.toString(), 18);
            console.log(`🔹 Sending vote: Option ${optionId}, Votes ${formattedAmount}`);

            const tx = await contractWithSigner.vote(optionId, formattedAmount);
            console.log("✅ Vote transaction sent: ", tx);
            await tx.wait();
            alert("✅ Vote successful!");
        } catch (error) {
            console.error("❌ Vote failed:", error);
            alert(`❌ Vote failed: ${error.message}`);
        }
    };

    return (
        <div className="voting-container">
            <h2>📜 <b>{purpose}</b></h2>
            
            {/* Only Admin can access */}
            {isAdmin && (
                <div className="admin-panel">
                    <h3>🔧 Admin Panel</h3>
                    <input
                        type="text"
                        placeholder="Enter new option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                    />
                    <button onClick={addNewOption}>➕ Add Option</button>
                </div>
            )}
            
            <input
                type="number"
                placeholder="Enter voting token amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={approveToken}>🔓 Approve Tokens</button>
            {isApproved && <p>✅ Approval successful, you can now vote!</p>}

            <ul>
                {options.map((option, index) => (
                    <li key={index}>
                        {option.name} - Votes: {option.voteCount}
                        <button onClick={() => vote(option.id)}>🗳️ Vote</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Voting;