var saleExecutor = (function (module) {
    const MenuLauncher = require("../support/MenuLauncher");
    const Prompts = require("../support/Prompts");
    const clover = require("remote-pay-cloud");
    const inquirer = require('inquirer');

    return {
        create: function(cloverConnector, connectionListener) {

            var cloverConnector = cloverConnector;

            var onSaleResponse = function (response) {
                if (response.success) {
                    console.log("#");
                    console.log("# Sale successful");
                    console.log("#");
                    printTransactionInfo(response.payment);
                    handleRefundOrVoid(response.payment);
                } else {
                    console.log("!");
                    console.log(`! Sale failed. Details: ${response.message}`);
                    console.log("!");
                    MenuLauncher.launchMenu();
                }
            };

            var printTransactionInfo = function (payment) {
                const tipAmount = payment.tipAmount || 0;
                if (payment) {
                    const subTotal = payment.amount - payment.taxAmount;
                    const totalPlusTip = payment.amount + tipAmount;
                    console.log(`# Subtotal:    ${subTotal}`);
                    console.log(`# Tax:         ${payment.taxAmount}`);
                    console.log(`# Total:       ${payment.amount}`);
                    console.log(`# Tip:         ${tipAmount}`);
                    console.log(`# Total + Tip: ${totalPlusTip}`);
                    console.log("#");
                    if (payment.cardTransaction) {
                        console.log(`# Card:       ${payment.cardTransaction.cardType} xxxxxxxxxxxx ${payment.cardTransaction.last4}`);
                    }
                    console.log("#");
                } else {
                    console.log(`No payment information on response: ${JSON.stringify(response)}.`);
                }
            };

            var handleRefundOrVoid = function(payment) {
                const refundPrompt = {
                    "type": "confirm",
                    "message": "Would you like to refund the payment?",
                    "name": "refund",
                    "default": false
                };
                inquirer.prompt(refundPrompt).then((answers) => {
                    if (answers.refund) {
                        const refundTypePrompt = {
                            "type": "confirm",
                            "message": "Would you like a full refund?",
                            "name": "fullRefund"
                        };
                        inquirer.prompt(refundTypePrompt).then((answers) => {
                            if (answers.fullRefund) {
                                doFullRefund(payment);
                            } else {
                                doPartialRefund(payment);
                            }
                        });
                    } else {
                        const voidPrompt = {
                            "type": "confirm",
                            "message": "Would you like to void the payment?",
                            "name": "void",
                            "default": false
                        };
                        inquirer.prompt(voidPrompt).then((answers) => {
                            if (answers.void) {
                                doVoidPayment(payment);
                            } else {
                                MenuLauncher.launchMenu();
                            }
                        });
                    }
                });
            };

            /**
             * create the appropriate request to do a full refund
             */
            var doFullRefund = function(payment) {
                const rpr = new clover.remotepay.RefundPaymentRequest();
                rpr.setPaymentId(payment.getId());
                rpr.setOrderId(payment.getOrder().getId());
                rpr.setFullRefund(true);
                cloverConnector.refundPayment(rpr);
            };

            /**
             * create the appropriate request to do a partial refund
             */
            var doPartialRefund = function(payment) {
                const rpr = new clover.remotepay.RefundPaymentRequest();
                rpr.setPaymentId(payment.getId());
                rpr.setOrderId(payment.getOrder().getId());
                rpr.setFullRefund(false);
                const refundAmount = payment.getAmount() / 2; // refund half by default
                rpr.setAmount(refundAmount);
                console.log(`# Refund Request - amount: ${refundAmount}`);
                cloverConnector.refundPayment(rpr);
            };

            /**
             * handles the callback from the device after a RefundPaymentRequest is
             * sent to the Mini
             * @param response
             */
            var onRefundPaymentResponse = function(response) {
                if (response.success) {
                    console.log("#");
                    console.log("# Refund Succeeded!");
                    console.log("#");
                } else {
                    console.log("!");
                    console.log("! Refund failed.");
                    console.log("!");
                }
                MenuLauncher.launchMenu();
            };

            /**
             * Creates a VoidPaymentRequest based on the payment
             * that was retrieved in the onSaleResponse callback.
             */
            var doVoidPayment = function(payment) {
                const vpr = new clover.remotepay.VoidPaymentRequest();
                vpr.setPaymentId(payment.getId());
                vpr.setOrderId(payment.getOrder().getId());
                vpr.setVoidReason("USER_CANCEL");
                cloverConnector.voidPayment(vpr);
            };

            /**
             * handles the callback from the device after a VoidPaymentRequest is
             * sent to the Mini
             * @param response
             */
            var onVoidPaymentResponse = function(response) {
                if(response.success) {
                    console.log("#");
                    console.log("# Payment was voided!");
                    console.log("#");
                } else {
                    console.log("!");
                    console.log("! Payment NOT voided.");
                    console.log("!");
                }
                MenuLauncher.launchMenu();
            };

            // Initialize the listeners for this executor.
            connectionListener.onSaleResponse = onSaleResponse;
            connectionListener.onRefundPaymentResponse = onRefundPaymentResponse;
            connectionListener.onVoidPaymentResponse = onVoidPaymentResponse;

            return {
                run: function () {
                    inquirer.prompt(Prompts.amount).then((answers) => {
                        const saleRequest = new clover.remotepay.SaleRequest();
                        saleRequest.setExternalId(clover.CloverID.getNewId());
                        saleRequest.setAmount(answers.amount);
                        cloverConnector.sale(saleRequest);
                    });
                },

                handleRefundOrVoid: function(payment) {
                    handleRefundOrVoid(payment);
                },

                printTransactionInfo: function (payment) {
                   printTransactionInfo(payment);
                }
            }
        }
    }
})(module);

module.exports = saleExecutor;
