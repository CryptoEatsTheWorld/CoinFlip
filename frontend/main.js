var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x27401b6ecbDCFb06501BE1f08dbCca8036fAa2F2", {from: accounts[0]});
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
        .then(function(){
          var account = web3.eth.accounts[0];
          contractInstance.once('WinOrLose', {
              filter: {user: account},
              fromBlock: "latest"
          }, function(error, event){
              if (error) {console.log(error)}
              else {
                $.LoadingOverlay("hide");
                var eventDecoded = web3.utils.hexToUtf8(event.returnValues.flipResult);
                if (eventDecoded == 'won') {
                  alert('YOU HAVE WON!');
                } else {
                  alert('SORRY, YOU LOST.');
                }
              }
          });
        });
    };
});
});

//const eventJsonInterface = web3.utils._.find(contractInstance._jsonInterface, o => o.name === 'WinOrLose' && o.type === 'event',);
//const eventObj = web3.eth.abi.decodeLog(
//      eventJsonInterface.inputs,
//      logs.data,
//      logs.topics.slice(1));
//var response = eventObj.coinSide;
