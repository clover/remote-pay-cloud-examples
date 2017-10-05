var preAuthExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const AuthExecutor = require("./AuthExecutor");
    const Prompts = require("../support/Prompts");
    const inquirer = require('inquirer');
    const clover = require("remote-pay-cloud");

    return {
        create: function (cloverConnector, connectionListener) {

            var authExecutor = AuthExecutor.create(cloverConnector, connectionListener);

            var onPreAuthResponse = function(response) {
                if(response.success) {
                    authExecutor.setPayment(response.payment);
                    console.log("#");
                    console.log("# PreAuth successful: " + response.getPayment().getAmount());
                    console.log("#");
                    inquirer.prompt(Prompts.preAuth).then((answers) => {
                        if (answers.preAuth) {
                            doCapturePreAuth(2000);
                        } else {
                            console.log("N");
                            MenuLauncher.launchMenu();
                        }
                    });
                } else {
                    console.log("!");
                    console.log("! PreAuth failed.");
                    console.log("!");
                }
            };

            var doCapturePreAuth = function(amt) {
                const cpar = new clover.remotepay.CapturePreAuthRequest();
                cpar.setAmount(amt);
                cpar.setTipAmount(0);
                cpar.setPaymentId(authExecutor.getPayment().getId());
                cloverConnector.capturePreAuth(cpar);
            };

            var onCapturePreAuthResponse = function(response) {
                if (response.success) {
                    console.log("#");
                    console.log("# Capture PreAuth successful!");
                    console.log("#");

                    inquirer.prompt(Prompts.tip).then((answers) => {
                        if (answers.tip) {
                            authExecutor.doTip(200);
                        } else {
                            console.log("N");
                            authExecutor.handleRefundOrVoid(authExecutor.getPayment());
                        }
                    });
                } else {
                    console.log("#");
                    console.log("# Capture PreAuth failed!");
                    console.log("#");
                }
            };

            // Initialize the listeners for this executor.
            connectionListener.onPreAuthResponse = onPreAuthResponse;
            connectionListener.onCapturePreAuthResponse = onCapturePreAuthResponse;

            return {
                run: function () {
                    inquirer.prompt(Prompts.amount).then((answers) => {
                        const preAuthRequest = new clover.remotepay.PreAuthRequest();
                        preAuthRequest.setExternalId(clover.CloverID.getNewId());
                        preAuthRequest.setAmount(answers.amount);
                        cloverConnector.preAuth(preAuthRequest);
                    });
                }
            };
        }
    }

})(module);

module.exports = preAuthExecutor;