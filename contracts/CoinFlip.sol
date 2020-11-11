// SPDX-License-Identifier: GPL-2.0-or-later
import "./provableAPI_0.6.sol";

pragma solidity 0.6.12;

contract CoinFlip is usingProvable{
  uint public contractBalance;
  address owner;
  uint256 constant NUM_BYTES = 1;

  struct Gambler {
    uint chosenSide;
    uint betAmount;
    address returnAddress;
  }

  mapping(bytes32 => Gambler) gamblers;

  event WinOrLose(bytes4 flipResult, address user);
  event LogNewProvableQuery(string description);

  constructor() public {
    owner = msg.sender;
    contractBalance = 0;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  // 0 is HEADS and 1 is TAILS
  function bet(uint chosen) public payable {
    // Must be no less than 0.01 ETH and no more than 10 ETH in value
    require(msg.value >= 10000000000000000 && msg.value <= 10000000000000000000, "Improper amount entered.");
    // Contract must have enough funds to cover paying the bet, if won - plus some extra for gas
    contractBalance += msg.value;
    require(contractBalance >= msg.value * 2 + 100000000000000000, "Sorry, the contract cannot cover this bet.");

    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 GAS_FOR_CALLBACK = 200000;
    bytes32 queryId = provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_BYTES, GAS_FOR_CALLBACK);

    gamblers[queryId].chosenSide = chosen;
    gamblers[queryId].betAmount = msg.value;
    gamblers[queryId].returnAddress = msg.sender;

    emit LogNewProvableQuery("Provable query was sent, standing by for an answer...");
  }

  function betResult(uint landedSide, bytes32 gamblerId) internal {
    bytes4 result;
    if (gamblers[gamblerId].chosenSide == landedSide) {
      result = "won";
      uint winnings = gamblers[gamblerId].betAmount * 2;
      contractBalance -= winnings;
      (bool success, ) = gamblers[gamblerId].returnAddress.call{value: winnings}("");
      require(success, "Ether send failed");
    } else {
      result = "lost";
    }
    emit WinOrLose(result, gamblers[gamblerId].returnAddress);
    delete gamblers[gamblerId];
  }

  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public override {
    require(msg.sender == provable_cbAddress());
    uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
    betResult(randomNumber, _queryId);
  }

  fallback() external payable {}
  receive() external payable { contractBalance += msg.value; }

  function addBalance() public payable {
      contractBalance += msg.value;
  }

  function withdrawAll() public onlyOwner returns(uint) {
      uint toSend = address(this).balance;
      contractBalance = 0;
      (bool success, ) = msg.sender.call{value: toSend}("");
      require(success, "Ether send failed");
      return toSend;
  }

}
