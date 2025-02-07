// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Option {
        string name;
        uint256 voteCount;
    }

    address public admin;
    mapping(uint256 => Option) public options;
    mapping(address => bool) public hasVoted; // 记录是否投过票
    mapping(address => uint256) public votes; // 记录谁投给了谁
    uint256 public optionsCount;
    uint256 public votingDeadline; // 投票截止时间

    event OptionAdded(uint256 optionId, string name);
    event Voted(uint256 optionId, address voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingActive() {
        require(block.timestamp < votingDeadline, "Voting period has ended");
        _;
    }

    constructor(uint256 durationInMinutes) {
        admin = msg.sender;
        votingDeadline = block.timestamp + (durationInMinutes * 1 minutes);
    }

    function addOption(string memory name) public onlyAdmin {
        require(bytes(name).length > 0, "Option name cannot be empty");
        options[optionsCount] = Option(name, 0);
        emit OptionAdded(optionsCount, name);
        optionsCount++;
    }

    function vote(uint256 optionId) public votingActive {
        require(optionId < optionsCount, "Invalid option ID");
        require(!hasVoted[msg.sender], "You have already voted");

        options[optionId].voteCount++;
        hasVoted[msg.sender] = true;
        votes[msg.sender] = optionId;

        emit Voted(optionId, msg.sender);
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
