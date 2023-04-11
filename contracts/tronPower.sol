// SPDX-License-Identifier: MIT

// This is a contract that allows users to buy electricity and sell electricity our main focus is prosumers
// This contract is still being worked on so trend with care thank you
pragma solidity ^0.8.0;
contract TronPower {
    address public owner;
    struct Prosumer{
        address owner;
        string title;
        string imgUrl;
        uint priceKwh;
        uint tokenPrice;
        uint rate;
        uint lastUpdate;
    }
    
    event BoughtElectricity(uint amount, uint kwhSold, string message, address ownerAddress);
    
    mapping(uint256 => Prosumer) public prosumers;
    uint256 public numberOfProsumer = 0;
    mapping(address => uint) public balances; // user balances in tokens
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function createProsumer(address _owner, string memory _title, uint _priceKwh, uint _tokenPrice, uint _rate, string memory _imgUrl) public returns (uint256){
        Prosumer storage prosumer = prosumers[numberOfProsumer];
        
        prosumer.owner = _owner;
        prosumer.title = _title;
        prosumer.imgUrl = _imgUrl;
        prosumer.priceKwh = _priceKwh;
        prosumer.tokenPrice = _tokenPrice;
        prosumer.rate = _rate;
        prosumer.lastUpdate = block.timestamp;
        
        numberOfProsumer++;
        
        return numberOfProsumer - 1;
    }
    
    function buyElectricity(uint256 _id) public payable{
        Prosumer storage prosumer = prosumers[_id];
        uint256 amount = msg.value;
        uint256 tokens = msg.value/prosumer.tokenPrice;
         (bool sent,) = payable(prosumer.owner).call{value:amount}("");
         
        if(sent){
             balances[msg.sender] += tokens;
             emit BoughtElectricity(amount, tokens, "Sold Electricity", prosumer.owner);
        }
    }
    
    function updateRate(uint _rate, uint256 _id) external onlyOwner {
        Prosumer storage prosumer = prosumers[_id];
        require(msg.sender == prosumer.owner, "Not the prosumer");
        require(balances[prosumer.owner] <0, "Not enough coins");
        uint currentTime = block.timestamp;
        uint timeElapsed = currentTime - prosumer.lastUpdate;
        uint tokensToDeduct = timeElapsed * prosumer.rate * prosumer.priceKwh;
        require(balances[prosumer.owner] > tokensToDeduct, "Insufficient balance from prosumer");
        balances[prosumer.owner] -= tokensToDeduct;
        prosumer.rate = _rate;
        prosumer.lastUpdate = currentTime;
    }
    
    function consumeElectricity(uint KWH, uint256 _id) external {
        Prosumer storage prosumer = prosumers[_id];
        uint tokensToDeduct = KWH * prosumer.priceKwh;
        require(balances[msg.sender] >= tokensToDeduct, "Insufficient balance");
        balances[msg.sender] -= tokensToDeduct;
    }
    
    function updateTokensPerKWH(uint256 newTokensPerKWH, uint256 _id) public {
        require(newTokensPerKWH > 0, "Invalid tokens per KWH value");
        Prosumer storage prosumer = prosumers[_id];
        require(msg.sender == prosumer.owner, "Not the prosumer");
        prosumer.priceKwh = newTokensPerKWH;
    }
    
    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(owner).transfer(balance);
    }
    
    function getElectricityBalance() public view returns(uint){
        return balances[msg.sender];
    }
}