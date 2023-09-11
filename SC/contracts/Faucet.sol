// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract faucet {
    address public owner;
    uint public amountAllowedPerDay = 1 ether;
    uint public amountAllowedPerWeek = 3 ether;
    uint public amountAllowedPerMonth = 10 ether;
    
    constructor() payable {
        owner = (msg.sender);
    }

    mapping(address => uint256) public lockTime;
    mapping(address => uint256) public amountFaucet;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can call this function.");
        _;
    }

    function setAmountallowedPerDay(uint newAmountAllowed) public onlyOwner {
        amountAllowedPerDay = newAmountAllowed;
    }

    function setAmountallowedPerWeek(uint newAmountAllowed) public onlyOwner {
        amountAllowedPerWeek = newAmountAllowed;
    }

    function setAmountallowedPerMonth(uint newAmountAllowed) public onlyOwner {
        amountAllowedPerMonth = newAmountAllowed;
    }

    function donate() public payable {
    }

    function requestTokensByDay(address payable requestor) public {
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait to faucet!");
        lockTime[requestor] = block.timestamp + 1 days;
        requestor.transfer(amountAllowedPerDay);
        amountFaucet[requestor] += 1 ether;
    }

    function requestTokenByWeek(address payable requestor) public {
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait to faucet!");
        lockTime[requestor] = block.timestamp + 7 days;
        requestor.transfer(amountAllowedPerWeek);
        amountFaucet[requestor] += 3 ether;
    }

    function requestTokenByMonth(address payable requestor) public { 
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait to faucet!");
        lockTime[requestor] = block.timestamp + 7 days;
        requestor.transfer(amountAllowedPerMonth);
        amountFaucet[requestor] += 10 ether;
    }
}