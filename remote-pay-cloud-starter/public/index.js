import * as clover from "remote-pay-cloud";

const cloudExample = () => {

    /**
     * Start Configuration - Please see the section below as it will need to be changed based on your configuration to properly run this application.
     *
     * In order to use this example application you must have installed either Cloud Pay Display or Secure Network Pay Display
     * on your device and you must have created a developer account and created a Clover Application.  Please see the
     * Clover Connector tutorial for more information - https://docs.clover.com/build/getting-started-with-cloverconnector/?sdk=browser.
     */

        // Set useCloudConfiguration to true to use Cloud Pay Display, or false to use Secure Network Pay Display.
        // If useCloudConfiguration is true you must properly set baseConfiguration and cloudConfiguration below.
        // If useCloudConfigruation is false you must set baseConfiguration and networkConfiguration below.
    const useCloudConfiguration = true;

    // Shared by both Network and Cloud configurations.
    // Enter your app's Remote Application Id below!
    // See: https://docs.clover.com/build/create-your-remote-app-id/ for more
    // information on how to obtain your remote application id.
    const baseConfiguration = {
        "applicationId": "yourRemoteApplicationId",
        "posName": "Cloud Starter POS",
        "serialNumber": "Register_1"
    };

    // If useCloudConfiguration is set to true, enter your cloud configuration here.
    const cloudConfiguration = {
        "accessToken": "53eb5a6c-3045-f4b4-fbe9-057756c37d1c",
        "cloverServer": "https://dev1.dev.clover.com/",
        "merchantId": "M6V3D9QH6VSRC",
        "deviceId": "0dee08ba621262cb4cefccfe7d8281e7",
        "friendlyId": "Cloud Example"
    };

    // If useCloudConfiguration is set to true, enter your endpoint here.  The endpoint can be found on the opening screen of Secure Network Pay Display on your device.
    const networkConfiguration = {
        "endpoint": "wss://yourdevicehostorip:yourdeviceport/remote_pay"
    };

    /**
     * End Configuration
     */

    return {

        /**
         * Establishes a connection to the Clover device based on the configuration provided.
         */
        connect: function () {
            clover.DebugConfig.loggingEnabled = true;
            let cloverDeviceConnectionConfiguration = null;
            baseConfiguration["webSocketFactoryFunction"] = clover.BrowserWebSocketImpl.createInstance;
            baseConfiguration["imageUtil"] = new clover.ImageUtil();
            if (useCloudConfiguration) {
                cloudConfiguration["httpSupport"] = new clover.HttpSupport(XMLHttpRequest);
                // Configuration Note: See: https://docs.clover.com/build/getting-started-with-clover-connector/?sdk=browser for more information
                // on how to obtain the required connection parameter values.
                cloverDeviceConnectionConfiguration = getDeviceConfigurationForCloud(Object.assign({}, baseConfiguration, cloudConfiguration));
            } else {
                networkConfiguration["authToken"] = getAuthToken();
                cloverDeviceConnectionConfiguration = getDeviceConfigurationForNetwork(Object.assign({}, baseConfiguration, networkConfiguration));
            }
            let builderConfiguration = {};
            builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
            let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);
            let cloverConnector = cloverConnectorFactory.createICloverConnector(cloverDeviceConnectionConfiguration);
            setCloverConnector(cloverConnector);
            cloverConnector.addCloverConnectorListener(buildCloverConnectionListener(cloverConnector));
            cloverConnector.initializeConnection();
        },

        /**
         * Sends a message to your Clover device.
         */
        showMessage: function () {
            getCloverConnector().showMessage("Welcome to Clover Connector!");
            // NOTE:  We are NOT returning the device to the default screen!  Because we are not,
            // the message will remain on the device until it is told to change it.
        },

        /**
         * Resets your Clover device (will cancel ongoing transactions and return to the welcome screen).
         */
        resetDevice: function () {
            getCloverConnector().resetDevice();
        },

        /**
         * Shows the Thank You screen
         */

        showThankYouScreen: function() {
            getCloverConnector().showThankYouScreen();
        },

        /**
         * Shows the Welcome screen
         */

        showWelcomeScreen: function() {
            getCloverConnector().showWelcomeScreen();
        },

        /**
         * Performs a manual refund on your clover device
         */
        performRefund: function() {
            const refundRequest = new clover.remotepay.ManualRefundRequest();

          //refundRequest.setFullRefund(true);
            refundRequest.setExternalId(clover.CloverID.getNewId());
            refundRequest.setAmount(10);
          //refundRequest.setAutoAcceptSignature(false);
            console.log({message: "Sending refund", request: refundRequest});

            let defaultCloverConnectorListener = buildCloverConnectionListener();

            getCloverConnector().addCloverConnectorListener(Object.assign({}, defaultCloverConnectorListener, {

              onManualRefundResponse: function (response) {
                  updateStatus("Refund complete.", response.result === "SUCCESS");
                  setTimeout(() => updateStatus("Please select an action to execute"), 5000);
                  console.log({message: "Refund response received", response: response});

                  /*if (!response.getRefunded()) {
                      console.log({error: "Response is not a refund!"}); // Might need a refund response?
                  }*/
                  },
            }));

            getCloverConnector().manualRefund(refundRequest);
        },

        /**
         * Performs a sale on your Clover device.
         */
        performSale: function () {
            const saleRequest = new clover.remotepay.SaleRequest();
            saleRequest.setExternalId(clover.CloverID.getNewId());
            saleRequest.setAmount(10);
            saleRequest.setAutoAcceptSignature(false);
            console.log({message: "Sending sale", request: saleRequest});

            let defaultCloverConnectorListener = buildCloverConnectionListener();
            // Add a Clover Listener to handle Sale responses.
            getCloverConnector().addCloverConnectorListener(Object.assign({}, defaultCloverConnectorListener, {

                onSaleResponse: function (response) {
                    updateStatus("Sale complete.", response.result === "SUCCESS");
                    setTimeout(() => updateStatus("Please select an action to execute"), 5000);
                    console.log({message: "Sale response received", response: response});
                    if (!response.getIsSale()) {
                        console.log({error: "Response is not a sale!"});
                    }
                },

                // See https://docs.clover.com/build/working-with-challenges/
                onConfirmPaymentRequest: function (request) {
                    console.log({message: "Automatically accepting payment", request: request});
                    updateStatus("Automatically accepting payment");
                    getCloverConnector().acceptPayment(request.getPayment());
                    // to reject a payment, pass the payment and the challenge that was the basis for the rejection
                    // getCloverConnector().rejectPayment(request.getPayment(), request.getChallenges()[REJECTED_CHALLENGE_INDEX]);
                },

                // See https://docs.clover.com/build/working-with-challenges/
                onVerifySignatureRequest: function (request) {
                    console.log({message: "Automatically accepting signature", request: request});
                    updateStatus("Automatically accepting signature");
                    getCloverConnector().acceptSignature(request);
                    // to reject a signature, pass the request to verify
                    // getCloverConnector().rejectSignature(request);
                }
            }));
            // Perform the sale.
            getCloverConnector().sale(saleRequest);
        },


        /**
         * Performs a sale and then a refund on your Clover device.
         */
         performSaleRefund: function () {
            const saleRequest = new clover.remotepay.SaleRequest();
            saleRequest.setExternalId(clover.CloverID.getNewId());
            saleRequest.setAmount(10);
            saleRequest.setAutoAcceptSignature(false);
            console.log({message: "Sending sale", request: saleRequest});

            let defaultCloverConnectorListener = buildCloverConnectionListener();
            // Add a Clover Listener to handle Sale responses.
            getCloverConnector().addCloverConnectorListener(Object.assign({}, defaultCloverConnectorListener, {

                onSaleResponse: function (response) {
                    updateStatus("Sale complete.", response.result === "SUCCESS");
                    setTimeout(() => updateStatus("Please select an action to execute"), 5000);
                    console.log({message: "Sale response received", response: response});
                    if (!response.getIsSale()) {
                        console.log({error: "Response is not a sale!"});
                    }

                    // Make sure we have a sale and everything is good.
                    if (true) {
                        const refundRequest = new clover.remotepay.RefundPaymentRequest();

                        //refundRequest.setFullRefund(true);
                        refundRequest.setFullRefund(true);
                        refundRequest.setPaymentId(response.payment.id);
                        refundRequest.setOrderId(response.payment.order.id);
                        console.log({message: "Sending refund", request: refundRequest});

                        getCloverConnector().refundPayment(refundRequest);
                    }

                },

                // See https://docs.clover.com/build/working-with-challenges/
                onConfirmPaymentRequest: function (request) {
                    console.log({message: "Automatically accepting payment", request: request});
                    updateStatus("Automatically accepting payment");
                    getCloverConnector().acceptPayment(request.getPayment());
                    // to reject a payment, pass the payment and the challenge that was the basis for the rejection
                    // getCloverConnector().rejectPayment(request.getPayment(), request.getChallenges()[REJECTED_CHALLENGE_INDEX]);
                },

                onRefundPaymentResponse: function (response) {
                    updateStatus("Refund complete.", response.result === "SUCCESS");
                    setTimeout(() => updateStatus("Please select an action to execute"), 5000);
                    console.log({message: "Refund response received", response: response});

                    /*if (!response.getRefunded()) {
                        console.log({error: "Response is not a refund!"}); // Might need a refund response?
                    }*/
                },

                // See https://docs.clover.com/build/working-with-challenges/
                onVerifySignatureRequest: function (request) {
                    console.log({message: "Automatically accepting signature", request: request});
                    updateStatus("Automatically accepting signature");
                    getCloverConnector().acceptSignature(request);
                    // to reject a signature, pass the request to verify
                    // getCloverConnector().rejectSignature(request);
                }
            }));
            // Perform the sale.
            getCloverConnector().sale(saleRequest);
        },

        /**
         * It is important to properly dispose of your Clover Connector, this function is called in window.onbeforeunload in index.html.
         */
        cleanup: function () {
            getCloverConnector().dispose();
            toggleActions(false);
            updateStatus("Not connected to your Clover device.  Please refresh the page to re-connect and perform an action.");
        }

    };

    /**
     * Build and return the connection configuration object for cloud.
     *
     * @param connectionConfiguration
     * @returns {WebSocketCloudCloverDeviceConfiguration}
     */
    function getDeviceConfigurationForCloud(connectionConfiguration) {
        return new clover.WebSocketCloudCloverDeviceConfiguration(
            connectionConfiguration.applicationId,
            connectionConfiguration.webSocketFactoryFunction,
            connectionConfiguration.imageUtil,
            connectionConfiguration.cloverServer,
            connectionConfiguration.accessToken,
            connectionConfiguration.httpSupport,
            connectionConfiguration.merchantId,
            connectionConfiguration.deviceId,
            connectionConfiguration.friendlyId,
            connectionConfiguration.forceReconnect);
    }

    /**
     * Build and return the connection configuration object for network.
     *
     * @param connectionConfiguration
     * @returns {WebSocketPairedCloverDeviceConfiguration}
     */
    function getDeviceConfigurationForNetwork(connectionConfiguration) {
        let deviceConfiguration = new clover.WebSocketPairedCloverDeviceConfiguration(
            connectionConfiguration.endpoint,
            connectionConfiguration.applicationId,
            connectionConfiguration.posName,
            connectionConfiguration.serialNumber,
            connectionConfiguration.authToken,
            connectionConfiguration.webSocketFactoryFunction,
            connectionConfiguration.imageUtil);

        // Append the pairing code handlers to the device configuration.
        deviceConfiguration = Object.assign(deviceConfiguration, {
            onPairingCode: function (pairingCode) {
                let pairingCodeMessage = `Please enter pairing code ${pairingCode} on the device`;
                updateStatus(pairingCodeMessage);
                console.log(`    >  ${pairingCodeMessage}`);
            },
            onPairingSuccess: function (authToken) {
                console.log(`    > Got Pairing Auth Token: ${authToken}`);
                setAuthToken(authToken);
            }
        });
        return deviceConfiguration;
    }

    /**
     * Custom implementation of ICloverConnector listener, handles onDeviceReady and other events.
     *
     * @returns {{} & any & {onDeviceReady: onDeviceReady, onDeviceError: onDeviceError, onDeviceDisconnected: onDeviceDisconnected}}
     */
    function buildCloverConnectionListener() {
        return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, {

            onDeviceReady: function (merchantInfo) {
                updateStatus("Your Clover device is ready to process requests.", true);
                console.log({message: "Device Ready to process requests!", merchantInfo: merchantInfo});
                toggleActions(true);
            },

            onDeviceError: function (cloverDeviceErrorEvent) {
                updateStatus(`An error has occurred and we could not connect to your Clover Device. ${cloverDeviceErrorEvent.message}`, false);
                toggleActions(false);
            },

            onDeviceDisconnected: function (e) {
                updateStatus("The connection to your Clover Device has been dropped.", false);
                console.log({message: "Disconnected"});
                toggleActions(false);
            }

        });
    }

    function toggleActions(show) {
        let actionsEle = document.getElementById("actions");
        if (show) {
            actionsEle.style.display = "block";
        } else {
            actionsEle.style.display = "none";
        }
    }

    function updateStatus(message, success) {
        const statusEle = document.getElementById("status");
        statusEle.innerHTML = message;
        if (success === false) {
            statusEle.className = "alert alert-danger";
        } else if (success) {
            statusEle.className = "alert alert-success";
        } else {
            statusEle.className = "alert alert-warning";
        }
    }

    function setCloverConnector(cloverConnector) {
        this.cloverConnector = cloverConnector;
    }

    function getCloverConnector() {
        return this.cloverConnector;
    }

    function setAuthToken(authToken) {
        this.authToken = authToken;
    }

    function getAuthToken() {
        return this.authToken;
    }

};

export {cloudExample}
