var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x0FB725e4bbb87b5737C23d9903075e1835D3Bd1D", {from: accounts[0]});
      console.log(contractInstance);

    });

    $(document).on("click", "#flip_button", function() {

      var amount = $("#amount_input").val();
      if (amount < 0.1 || amount > 10) {
        alert('invalid amount submitted');
      } else {
        $("#amount_input").val(null);
        $.LoadingOverlay("show");

        var choice = $("input[name='flipping']:checked").val();
        var config = {value: web3.utils.toWei(amount, "ether")};

        contractInstance.methods.bet(choice).send(config)
        .once('transactionHash', function(hash){ })
        .once('receipt', function(receipt){ })
        .on('confirmation', function(confNumber, receipt){ })
        .on('error', function(error){})
        .then(function(receipt){
          $.LoadingOverlay("hide"); 
          var myevent = receipt.events.WinOrLose.raw.topics[1];
          var eventDecoded = web3.utils.hexToUtf8(myevent);
          if (eventDecoded == 'won') {
            alert('YOU HAVE WON!');
          } else {
            alert('SORRY, YOU LOST.');
          }

        });
      }
    });
});
