var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x27401b6ecbDCFb06501BE1f08dbCca8036fAa2F2", {from: accounts[0]});
      console.log(contractInstance);

    });

    $(document).on("click", "#flip_button", function() {

      var amount = $("#amount_input").val();
      var config = {value: web3.utils.toWei(amount, "ether")};

      contractInstance.methods.addBalance().send(config)
        .once('transactionHash', function(hash){ })
        .once('receipt', function(receipt){ })
        .on('confirmation', function(confNumber, receipt){ })
        .on('error', function(error){});

    });
});
