var readCardExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const clover = require("remote-pay-cloud");

    return {
        create: function (cloverConnector, connectionListener) {
            var onReadCardDataResponse = function(response) {
                if(response.success) {
                    const cardData = response.getCardData();
                    console.log("#");
                    console.log("# Read Card Data was successful");
                    console.log("#");
                    console.log("# Cardholder Name: " + cardData.cardholderName);
                    console.log("# First Name:      " + cardData.firstName);
                    console.log("# Last Name:       " + cardData.lastName);
                    console.log("# First 6:         " + cardData.first6);
                    console.log("# Last 4:          " + cardData.last4);
                    console.log("# Expiration:      " + cardData.exp);
                    console.log("# Encrypted?       " + cardData.encrypted);
                    console.log("# Track 1:         " + cardData.track1);
                    console.log("# Track 2:         " + cardData.track2);
                    console.log("# Track 3:         " + cardData.track3);
                    console.log("#");
                } else {
                    console.log("!");
                    console.log("! Read Card Data Failed!");
                    console.log("!");
                }
                MenuLauncher.launchMenu();
            };

            return {
                run: function () {
                    connectionListener.onReadCardDataResponse = onReadCardDataResponse;
                    const cardDataRequest = new clover.remotepay.ReadCardDataRequest((clover.CardEntryMethods.DEFAULT));
                    cloverConnector.readCardData(cardDataRequest);
                }
            }
        }
    }
})(module);

module.exports = readCardExecutor;