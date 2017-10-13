(function (module) {
    const clover = require("remote-pay-cloud");
    const inquirer = require('inquirer');
    const MenuLauncher = require("../support/MenuLauncher");

    var defaultConnectorListener = module.exports;

    defaultConnectorListener.create = function (cloverConnector) {
        return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, getListenerOverrides(cloverConnector));
    }

    var getListenerOverrides = function (cloverConnector) {
        return {
            cloverConnector: cloverConnector,

            onDeviceConnected: function () {
                console.log("    > Device Connected ...");
            },

            onDeviceReady: function (mechantInfo) {
                console.log("    > Device Ready");
            },

            onDeviceDisconnected: function (message) {
                console.log("    > Device Disconnected!");
            },

            onDeviceError: function (deviceEvent) {
                console.log(`deviceError: ${deviceEvent.message}`);
            },

            onDeviceActivityStart: function (deviceEvent) {
                if (deviceEvent && deviceEvent.message) {
                    console.log(`    >  ${deviceEvent.message}`);
                }
            },

            onPrintJobStatusResponse(response) {
                console.log(`    > Printer status: ${response.status}`);
                if (response.status == "ERROR" || response.status === "SUCCESS") {
                    MenuLauncher.launchMenu();
                }
            },

            onVerifySignatureRequest: function (request) {
                console.log("    > Verify Signature Request");
                console.log("      [Auto-Accepting Signature...]");
                if (this.cloverConnector !== null) {
                    this.cloverConnector.acceptSignature(request);
                }
            },

            onConfirmPaymentRequest: function (request) {
                const challenges = (request && request.challenges) ? request.challenges : [];
                let challengePrompts = [];
                let i = 0;
                challenges.forEach((challenge) => {
                    challengePrompts.push({
                        "type": "confirm",
                        "message": challenge.message,
                        "name": `challenge_${i}`,
                        "default": true,
                        "challenge": challenge
                    });
                    i++;
                });
                const handleChallenge = () => {
                    inquirer.prompt(challengePrompts).then((answers) => {
                        let unconfirmedChallenge = null;
                        for (var answerKey in answers) {
                            if (answers.hasOwnProperty(answerKey) && answers[answerKey] === false) {
                                challengePrompts.forEach((challengePrompt) => {
                                    if (challengePrompt.name === answerKey) {
                                        unconfirmedChallenge = challengePrompt.challenge;
                                    }
                                });
                            }
                        }
                        if (unconfirmedChallenge) {
                            this.cloverConnector.rejectPayment(request.payment, unconfirmedChallenge);
                        } else {
                            if (challengePrompts.length > 0) {
                                challengePrompts.splice(0, 1);
                                handleChallenge();
                            } else {
                                this.cloverConnector.acceptPayment(request.payment);
                            }
                        }
                    });
                };
                handleChallenge();
            }
        }
    }
})(module);

