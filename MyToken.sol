// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyToken is ERC20, Ownable {
    address public Owner;
    address public tokenAddr;
    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        Owner = msg.sender;
        _mint(msg.sender, 1000000 * 10**18); // 初始供应量 100 万
        tokenAddr = address(this);
    }
    // 新增公开的 mint 方法，只有合约所有者可以调用
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function getAddr() external view returns (address) {
        return tokenAddr;
    }
    
}

