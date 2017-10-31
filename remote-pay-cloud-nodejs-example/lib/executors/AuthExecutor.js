var authExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const SaleExecutor = require("./SaleExecutor");
    const Prompts = require("../support/Prompts");
    const inquirer = require('inquirer');
    const clover = require("remote-pay-cloud");

    return {
        create: function (cloverConnector, connectionListener) {

            var saleExecutor = SaleExecutor.create(cloverConnector, connectionListener);

            var payment = null;

            var onAuthResponse = function (response) {
                if (response.success) {
                    payment = response.getPayment();
                    saleExecutor.printTransactionInfo(payment);
                    const tipAmount = Math.round(payment.getAmount() * .15);
                    let tipPrompt = [{
                        type: "confirm",
                        name: "tip",
                        message: `Do you want to add a tip of ${tipAmount}?`,
                    }];
                    inquirer.prompt(tipPrompt).then((answers) => {
                        if (answers.tip) {
                            doTip(tipAmount);
                        } else {
                            console.log("N");
                            saleExecutor.handleRefundOrVoid(payment);
                        }
                    });
                } else {
                    console.log("!");
                    console.log("! Auth failed.");
                    console.log("!");
                    MenuLauncher.launchMenu();
                }
            };

            var doTip = function (tipAmount) {
                const taar = new clover.remotepay.TipAdjustAuthRequest();
                taar.setPaymentId(payment.getId());
                taar.setOrderId(payment.getOrder().getId());
                taar.setTipAmount(tipAmount);
                cloverConnector.tipAdjustAuth(taar);
            };

            var onTipAdjustAuthResponse = function (response) {
                if (response.success) {
                    saleExecutor.printTransactionInfo(Object.assign({}, payment, response));
                    saleExecutor.handleRefundOrVoid(payment);
                } else {
                    console.log("!");
                    console.log(`! Tip failed! Message: ${response.message}`);
                    console.log("!");
                    MenuLauncher.launchMenu();
                }
            };

            var onTipAdded = function (response) {
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                console.log("On tip added: " + JSON.stringify(response));
            };

            // Initialize the listeners for this executor.
            connectionListener.onAuthResponse = onAuthResponse;
            connectionListener.onTipAdjustAuthResponse = onTipAdjustAuthResponse;
            connectionListener.onTipAdded = onTipAdded;

            var overrides = {
                run: function () {
                    inquirer.prompt(Prompts.amount).then((answers) => {
                        const authRequest = new clover.remotepay.AuthRequest();
                        authRequest.setExternalId(clover.CloverID.getNewId());
                        authRequest.setAmount(answers.amount);
                        authRequest.setTaxAmount(answers.amount - Math.round(answers.amount / 1.07));
                        cloverConnector.auth(authRequest);
                    });
                },

                doTip: function (tipAmount) {
                    doTip(tipAmount);
                },

                setPayment: function (paymentIn) {
                    payment = paymentIn;
                },

                getPayment: function () {
                    return payment;
                }
            }

            return Object.assign({}, saleExecutor, overrides);
        }
    }
})(module);

module.exports = authExecutor;