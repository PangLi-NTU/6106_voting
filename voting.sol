// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function mint(address to, uint256 amount) external;
}

contract VotingSystem {
    struct Option {
        string name;
        uint256 voteCount;
    }

    address public admin;
    IERC20 public votingToken; // ERC-20 代币地址
    mapping(uint256 => Option) public options;
    mapping(address => bool) public hasVoted; // 记录是否投过票
    mapping(address => uint256) public votes; // 记录谁投给了谁
    uint256 public optionsCount;
    uint256 public votingDeadline; // 投票截止时间
    mapping(address => bool) public registeredUsers; // 记录已注册用户

    event OptionAdded(uint256 optionId, string name);
    // event Voted(uint256 optionId, address voter);
    event Voted(uint256 optionId, address voter, uint256 voteWeight);
    event UserRegistered(address user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingActive() {
        require(block.timestamp < votingDeadline, "Voting period has ended");
        _;
    }

    constructor(address _tokenAddress, uint256 durationInMinutes) {
        admin = msg.sender;
        votingToken = IERC20(_tokenAddress);
        votingDeadline = block.timestamp + (durationInMinutes * 1 minutes);
    }

    // 用户注册后，自动获得 20 ERC-20 代币
    function register() public {
        require(!registeredUsers[msg.sender], "Already registered");

        registeredUsers[msg.sender] = true;
        votingToken.mint(msg.sender, 20 * 10**18);

        emit UserRegistered(msg.sender, 20 * 10**18);
    }

    function addOption(string memory name) public onlyAdmin {
        require(bytes(name).length > 0, "Option name cannot be empty");
        options[optionsCount] = Option(name, 0);
        emit OptionAdded(optionsCount, name);
        optionsCount++;
    }

    function vote(uint256 optionId, uint256 amount) public votingActive {
        require(optionId < optionsCount, "Invalid option ID");
        require(!hasVoted[msg.sender], "You have already voted");
        require(votingToken.balanceOf(msg.sender) >= amount, "Insufficient tokens");

        // 用户必须先 `approve()` 让投票合约使用他们的代币
        votingToken.transferFrom(msg.sender, address(this), amount);

        options[optionId].voteCount += amount;
        hasVoted[msg.sender] = true;

        emit Voted(optionId, msg.sender, amount);
    }

    function getOption(uint256 optionId) public view returns (string memory name, uint256 voteCount) {
        require(optionId < optionsCount, "Invalid option ID");
        return (options[optionId].name, options[optionId].voteCount);
    }

    function getAllOptions() public view returns (Option[] memory) {
        Option[] memory allOptions = new Option[](optionsCount);
        for (uint256 i = 0; i < optionsCount; i++) {
            allOptions[i] = options[i];
        }
        return allOptions;
    }

    function getVoterChoice(address voter) public view returns (uint256) {
        require(hasVoted[voter], "This voter has not voted yet");
        return votes[voter];
    }

    function getWinner() public view returns (string memory winnerName, uint256 highestVotes) {
        require(block.timestamp >= votingDeadline, "Voting is still ongoing");

        uint256 winningVoteCount = 0;
        uint256 winningOptionId = 0;

        for (uint256 i = 0; i < optionsCount; i++) {
            if (options[i].voteCount > winningVoteCount) {
                winningVoteCount = options[i].voteCount;
                winningOptionId = i;
            }
        }

        return (options[winningOptionId].name, winningVoteCount);
    }
}
