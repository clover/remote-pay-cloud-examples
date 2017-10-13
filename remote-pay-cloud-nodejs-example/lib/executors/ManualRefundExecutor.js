var manualRefundExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const Prompts = require("../support/Prompts");
    const inquirer = require('inquirer');
    const clover = require("remote-pay-cloud");

    return {
        create: function (cloverConnector, connectionListener) {

            var onManualRefundResponse = function (response) {
                const taxAmount = response.getCredit().getTaxAmount() || 0;
                if (response.success) {
                    console.log("#");
                    console.log("# Manual Refund successful.");
                    console.log("#");
                    console.log(`# Refund Amount:       ${response.getCredit().getAmount()}`);
                    console.log(`# Refund Tax Amount:   ${taxAmount}`);
                    console.log("#");
                } else {
                    console.log("!");
                    console.log("! Manual Refund failed!");
                    console.log("!");
                }
                MenuLauncher.launchMenu();
            };

            return {
                run: function () {
                    connectionListener.onManualRefundResponse = onManualRefundResponse;
                    inquirer.prompt(Prompts.amount).then((answers) => {
                        const refundRequest = new clover.remotepay.ManualRefundRequest();
                        refundRequest.setExternalId(clover.CloverID.getNewId());
                        refundRequest.setAmount(answers.amount);
                        cloverConnector.manualRefund(refundRequest);
                    });
                }
            }
        }
    }
})(module);

module.exports = manualRefundExecutor;