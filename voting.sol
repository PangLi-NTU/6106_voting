// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingOptionCreator {
    struct Option {
        string name;
        uint256 voteCount;
    }

    address public admin;
    mapping(uint256 => Option) public options;
    uint256 public optionsCount;

    event OptionAdded(uint256 optionId, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addOption(string memory name) public onlyAdmin {
        require(bytes(name).length > 0, "Option name cannot be empty");
        options[optionsCount] = Option(name, 0);
        emit OptionAdded(optionsCount, name);
        optionsCount++;
    }

    function getOption(uint256 optionId) public view returns (string memory name, uint256 voteCount) {
        require(optionId < optionsCount, "Invalid option ID");
        Option memory option = options[optionId];
        return (option.name, option.voteCount);
    }

    function getAllOptions() public view returns (Option[] memory) {
        Option[] memory allOptions = new Option[](optionsCount);
        for (uint256 i = 0; i < optionsCount; i++) {
            allOptions[i] = options[i];
        }
        return allOptions;
    }
}
