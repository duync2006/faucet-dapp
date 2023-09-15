// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract faucet {
    address payable public owner;
    uint public amountAllowedPerDay = 1 ether;
    uint public amountAllowedPerWeek = 3 ether;
    uint public amountAllowedPerMonth = 10 ether;
    
    mapping(address => bool) isAdmin;
    constructor() payable {
        owner = payable(msg.sender);
        isAdmin[owner] = true;
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
        require(amountFaucet[requestor] < 10 ether, "This account had run out of faucet token amount");
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait next day to faucet!");
        lockTime[requestor] = block.timestamp + 1 days;
        amountFaucet[requestor] += 1 ether;
        requestor.transfer(amountAllowedPerDay);
    }

    function requestTokenByWeek(address payable requestor) public {
        require(amountFaucet[requestor] < 10 ether, "This account had run out of faucet token amount");
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait next week to faucet!");
        lockTime[requestor] = block.timestamp + 7 days;
        amountFaucet[requestor] += 3 ether;
        requestor.transfer(amountAllowedPerWeek);
    }

    function requestTokenByMonth(address payable requestor) public { 
        require(amountFaucet[requestor] < 10 ether, "This account had run out of faucet token amount");
        require(lockTime[requestor] < block.timestamp, "Your lock time has expired, please wait to faucet!");
        lockTime[requestor] = block.timestamp + 7 days;
        amountFaucet[requestor] += 10 ether;
        requestor.transfer(amountAllowedPerMonth);
    }

    function grantOwner(address payable newOwner) public onlyOwner {
        owner = newOwner;
    }

    function grantAdmin(address payable newAdmin) public onlyOwner {
        isAdmin[newAdmin] = true;
    }

    modifier onlyAdmin () {
        require(isAdmin[msg.sender] == true, 'Only admin can do this function');
        _;
    }
    function withdrawal() public onlyAdmin {
        owner.transfer(address(this).balance);
    }
    // withdraw function (all token) ==> from address in contructor, grant => function 
    // moi tai khoan chi dc faucet toi da 10 token
    // handle error --> FE 
}