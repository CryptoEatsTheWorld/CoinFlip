const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require('truffle-assertions');

contract("CoinFlip", async function(accounts) {

  it("should make sure the bet is not less than 0.1 ether", async function(){
    let instance = await CoinFlip.deployed();
    console.log(instance.address);
    await truffleAssert.fails(instance.bet(0, {from: accounts[1], value: web3.utils.toWei("1000000000000000", "wei")}),
    truffleAssert.ErrorType.REVERT);
  });

  it("should make sure the bet is not more than 10 ether", async function(){
    let instance = await CoinFlip.deployed();
    console.log(instance.address);
    await truffleAssert.fails(instance.bet(0, {from: accounts[1], value: web3.utils.toWei("9", "ether")}),
    truffleAssert.ErrorType.REVERT);
  });

  it("should reject a bet if not enough in contract to cover it", async function(){
    let instance = await CoinFlip.deployed();
    console.log(instance.address);
    await truffleAssert.fails(instance.bet(0, {from: accounts[2], value: web3.utils.toWei("2", "ether")}),
    truffleAssert.ErrorType.REVERT);
  });
  it("should emit event", async function(){
    let instance = await CoinFlip.deployed();
    console.log(instance.address);
    await instance.bet(0, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
    truffleAssert.eventEmitted(result, 'WinOrLose', (ev) => {
    return ev.param1 === 'won' || ev.param1 === 'lost'; });
    //await instance.WinOrLose() function(event){console.log("This is the result\n\n" + event)});
  });

// it("should accept a bet if there is enough in contract to cover it", async function(){
//    let instance = await CoinFlip.deployed();
//    console.log(instance.address);
//    console.log(CoinFlip.address);
//    await web3.eth.sendTransaction({from: accounts[0], to: instance.address, value: web3.utils.toWei("15", "ether")});
//    await truffleAssert.passes(instance.bet(0, {from: accounts[1], value: web3.utils.toWei("2", "ether")}),
//    truffleAssert.ErrorType.REVERT);
//  });


});
