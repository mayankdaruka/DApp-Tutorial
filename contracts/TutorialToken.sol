// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TutorialToken is ERC20 {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    address private _owner;

    uint256 private _totalSupply;

    constructor(string memory name_, string memory symbol_, uint256 initialSupply) ERC20(name_, symbol_) {
        // totalSupply = initialSupply;
        _owner = msg.sender;
        _totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
        _mint(msg.sender, initialSupply);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    function transfer(address receiver, uint numTokens) public override returns (bool) {
        require(numTokens <= _balances[msg.sender]);
        _balances[msg.sender] = _balances[msg.sender] - numTokens;
        _balances[receiver] = _balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view override returns (uint) {
        return _balances[tokenOwner];
    }
}