# CoinFlip

This is a project I created as the final practical assignemnt for the SOlidity Programming 201 Course offerred at Ivan on Tech Academy.

It is basically a simple dapp for betting some Eth and picks heads or tails and then clicking the button to "flip the coin".

The first phase of the project used only pseudo-randomness to determine the outcome. In that phase everything was copleted in one transaction, so I was able to pull the event from the trans receipt.

But in this final version, I use the ProvableAPI contract to get a real rando number from an oracle, and then get the event from the event log.

test
