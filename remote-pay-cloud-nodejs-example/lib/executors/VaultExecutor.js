var vaultExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const clover = require("remote-pay-cloud");

    return {
        create: function(cloverConnector, connectionListener) {
            var onVaultCardResponse = function(response) {
                if(response.success) {
                    const vaultedCard = response.getCard();
                    console.log("#");
                    console.log("# Vault Card Successful.");
                    console.log("#");
                    console.log("# Token:           " + vaultedCard.getToken());
                    console.log("# Cardholder Name: " + vaultedCard.getCardholderName());
                    console.log("# Card First 6:    " + vaultedCard.getFirst6());
                    console.log("# Card Last 4:     " + vaultedCard.getLast4());
                    console.log("# Card Expiration: " + vaultedCard.getExpirationDate());
                    console.log("#");
                } else {
                    console.log("!");
                    console.log("! Vault Card Failed");
                    console.log("!");
                }
                MenuLauncher.launchMenu();
            };

            return {
                run: function () {
                    connectionListener.onVaultCardResponse = onVaultCardResponse;
                    cloverConnector.vaultCard(clover.CardEntryMethods.DEFAULT);
                }
            };
        }
    }

})(module);

module.exports = vaultExecutor;