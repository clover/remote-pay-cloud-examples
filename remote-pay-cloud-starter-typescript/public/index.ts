import * as clover from "remote-pay-cloud";

const cloudExample = () => {

    let cloverConnector: clover.remotepay.ICloverConnector = null;
    let authToken: string = null;
    // Stores active/open SaleRequests, we should NOT allow our POS to perform a new SaleRequest until we have received
    // a SaleResponse for any open requests.  For a production POS system this should be persisted so that it can survive
    // across page refreshes, etc.
    let pendingSaleRequest = null;

    return {

        /**
         * Establishes a connection to the Clover device based on the configuration provided.
         */
        connect: function (connectionConfiguration: any = null): void {
            this.cleanup(); // any existing connections.
            if (!connectionConfiguration) {
                connectionConfiguration = buildConnectionConfigFromWebForm();
            }
            clover.DebugConfig.loggingEnabled = true;
            let cloverDeviceConnectionConfiguration: clover.CloverDeviceConfiguration = null;
            if (isCloudConfig()) {
                const cloudFormValid: boolean = (document.getElementById("cloudForm") as HTMLInputElement).checkValidity();
                if (!cloudFormValid) {
                    updateStatus("The connection configuration is not valid.  Please update the form below and try again.", false);
                    return;
                }
                updateStatus("Attempting to connect to your Clover device, please wait  ....");
                // Configuration Note: See: https://docs.clover.com/build/getting-started-with-clover-connector/?sdk=browser for more information
                // on how to obtain the required connection parameter values.
                cloverDeviceConnectionConfiguration = getDeviceConfigurationForCloud(connectionConfiguration);
            } else {
                const networkFormValid: boolean = (document.getElementById("networkForm") as HTMLInputElement).checkValidity();
                if (!networkFormValid) {
                    updateStatus("The connection configuration is not valid.  Please update the form below and try again.", false);
                    return;
                }
                updateStatus("Attempting to connect to your Clover device, you may need to enter the manager PIN, please wait  ....");
                cloverDeviceConnectionConfiguration = getDeviceConfigurationForNetwork(connectionConfiguration);
            }
            toggleElement("connectionForm", false);
            let builderConfiguration: any = {};
            builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
            let cloverConnectorFactory: clover.CloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);
            cloverConnector = cloverConnectorFactory.createICloverConnector(cloverDeviceConnectionConfiguration);
            cloverConnector.addCloverConnectorListener(buildCloverConnectionListener());
            cloverConnector.initializeConnection();
        },

        /**
         * Sends a message to your Clover device.
         */
        showMessage: function (): void {
            cloverConnector.showMessage("Welcome to Clover Connector!");
            // NOTE:  We are NOT returning the device to the default screen!  Because we are not,
            // the message will remain on the device until it is told to change it.
        },

        /**
         * Resets your Clover device (will cancel ongoing transactions and return to the welcome screen).
         */
        resetDevice: function (): void {
            if (pendingSaleRequest) {
                this.checkPaymentStatus();
            } else {
                cloverConnector.resetDevice();
            }
        },

        // Only called by manual input from the merchant after the pending payments status has been checked via checkPaymentStatus.
        forceResetDevice: function() {
            cloverConnector.resetDevice();
        },

        /**
         * Performs a sale on your Clover device.
         */
        performSale: function (): void {
            if (!pendingSaleRequest) {
                pendingSaleRequest = new clover.remotepay.SaleRequest();
                pendingSaleRequest.setExternalId(clover.CloverID.getNewId());
                pendingSaleRequest.setAmount(10000);
                pendingSaleRequest.setAutoAcceptSignature(true);
                pendingSaleRequest.setApproveOfflinePaymentWithoutPrompt(true);
                pendingSaleRequest.setDisableDuplicateChecking(true);
                pendingSaleRequest.setCardEntryMethods(clover.CardEntryMethods.ALL);
                console.log({message: "Sending sale", request: pendingSaleRequest});
                toggleElement("actions", false);
                updateStatus(`Payment: ${pendingSaleRequest.getExternalId()} for $${pendingSaleRequest.getAmount() / 100} is in progress.`, null, "pendingStatusContainer", "pendingMessage");
                // Send the sale to the device.
                cloverConnector.sale(pendingSaleRequest);
            } else {
                this.checkPaymentStatus();
            }
        },

       /**
        * Handles payment reconciliation which is critical to the POS.  This is critical for non-happy path flows where the POS has a bad connection
        * to the device and may have missed messages.  The POS must provide the merchant a way to reconcile payments as quickly as
        * possibly (while the customer is still present).  In this simple example this is done by displaying a button which allows this function to
        * be executed while a payment is pending.  This function first attempts to recover any missed messages (retrieveDeviceStatus) and then
        * utilizes the retrievePayment API to check the payment's status and either reconcile it or allow the merchant to reset the
        * device (which may void the transaction).
        */
        checkPaymentStatus: function () {
            if (pendingSaleRequest) {
                // If a message was lost etc. the retrieveDevice status request will ask the device to send the last message.
                // This can help the POS recover if the device is stuck on a challenge screen, etc.  The last message will
                // be sent independently of the retrieveDeviceStatus response and thus the retrieveDeviceStatus response
                // does not need to be checked.
                const retrieveDeviceStatusRequest = new clover.remotepay.RetrieveDeviceStatusRequest();
                retrieveDeviceStatusRequest.setSendLastMessage(true);
                cloverConnector.retrieveDeviceStatus(retrieveDeviceStatusRequest);
                // Retrieve the payment status.
                updateStatus(`Payment ${pendingSaleRequest.getExternalId()} is currently pending.  Checking payment status ...`);
                const retrievePaymentRequest = new clover.remotepay.RetrievePaymentRequest();
                retrievePaymentRequest.setExternalPaymentId(pendingSaleRequest.getExternalId());
                cloverConnector.retrievePayment(retrievePaymentRequest);
            } else {
                updateStatus(`There is currently no pending payment.`);
            }
        },

        /**
         * It is important to properly dispose of your Clover Connector, this function is called in window.onbeforeunload in index.html.
         */
        cleanup: function (): void {
            if (cloverConnector) {
                cloverConnector.dispose();
                toggleElement("actions", false);
                updateStatus("Not connected to your Clover device.  Please refresh the page to re-connect and perform an action.");
            }
        },

        showNetworkInfo: function(): void {
            toggleElement("networkInfo", true);
            toggleElement("cloudInfo", false);
        },

        showCloudInfo: function(): void {
            toggleElement("cloudInfo", true);
            toggleElement("networkInfo", false);
        }

    };

    /**
     * Builds a configuration container from the web form.
     */
    function buildConnectionConfigFromWebForm(): any {
        const config: any = {};
        if (isCloudConfig()) {
            config["applicationId"] = (document.getElementById("cloudAppId") as HTMLInputElement).value;
            config["accessToken"] = (document.getElementById("accessToken") as HTMLInputElement).value;
            config["cloverServer"] = (document.getElementById("cloverServer") as HTMLInputElement).value;
            config["merchantId"] = (document.getElementById("merchantId") as HTMLInputElement).value;
            config["deviceId"] = (document.getElementById("deviceId") as HTMLInputElement).value;
            config["friendlyId"] = (document.getElementById("friendlyId") as HTMLInputElement).value;
        } else {
            config["applicationId"] = (document.getElementById("snpdAppId") as HTMLInputElement).value;
            config["endpoint"] = (document.getElementById("endpoint") as HTMLInputElement).value;
            config["posName"] = (document.getElementById("posName") as HTMLInputElement).value;
            config["serialNumber"] = (document.getElementById("serialNumber") as HTMLInputElement).value;
            config["authToken"] = authToken;
        }
        return config;
    }

    function isCloudConfig(): boolean {
        const cloudInfo = document.getElementById("cloudInfo");
        return cloudInfo && cloudInfo.style.display === "block";
    }

    /**
     * Build and return the connection configuration object for cloud.
     *
     * @param connectionConfiguration
     * @returns {WebSocketCloudCloverDeviceConfiguration}
     */
    function getDeviceConfigurationForCloud(connectionConfiguration: any): clover.CloverDeviceConfiguration {
        const configBuilder: clover.WebSocketCloudCloverDeviceConfigurationBuilder = new clover.WebSocketCloudCloverDeviceConfigurationBuilder(connectionConfiguration.applicationId,
            connectionConfiguration.deviceId, connectionConfiguration.merchantId, connectionConfiguration.accessToken);
        configBuilder.setCloverServer(connectionConfiguration.cloverServer);
        configBuilder.setFriendlyId(connectionConfiguration.friendlyId);
        configBuilder.setHeartbeatInterval(1000);
        return configBuilder.build();
    }

    /**
     * Build and return the connection configuration object for network. When initially connecting to Secure Network
     * Pay Display pairing is required.  The configuration object provides callbacks so the application can
     * handle the pairing however it chooses.  In this case we update a UI element on the web page with the
     * pairing code that must be entered on the device to establish the connection.  The authToken returned
     * in onPairingSuccess can be saved and used later to avoid pairing for subsequent connection attempts.
     *
     * @param connectionConfiguration
     * @returns {WebSocketPairedCloverDeviceConfiguration}
     */
    function getDeviceConfigurationForNetwork(connectionConfiguration: any): clover.WebSocketPairedCloverDeviceConfiguration {
        const onPairingCode = (pairingCode) => {
            const pairingCodeMessage = `Please enter pairing code ${pairingCode} on the device`;
            updateStatus(pairingCodeMessage, true);
            console.log(`    >  ${pairingCodeMessage}`);
        };
        const onPairingSuccess = (authTokenFromPairing) => {
            console.log(`    > Got Pairing Auth Token: ${authTokenFromPairing}`);
            authToken = authTokenFromPairing;
        };

        const configBuilder: clover.WebSocketPairedCloverDeviceConfigurationBuilder = new clover.WebSocketPairedCloverDeviceConfigurationBuilder(
            connectionConfiguration.applicationId,
            connectionConfiguration.endpoint,
            connectionConfiguration.posName,
            connectionConfiguration.serialNumber,
            connectionConfiguration.authToken,
            onPairingCode,
            onPairingSuccess);

        return configBuilder.build();
    }

    /**
     * Custom implementation of ICloverConnector listener, handles responses from the Clover device.
     */
    function buildCloverConnectionListener() {
        return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, {

            onSaleResponse: function (response: clover.remotepay.SaleResponse): void {
                console.log({message: "Payment response received", response: response});
                const requestAmount = pendingSaleRequest.getAmount();
                const requestExternalId = pendingSaleRequest.getExternalId();
                pendingSaleRequest = null; // The sale is complete
                toggleElement("actions", true);
                toggleElement("pendingStatusContainer", false);
                if (response.getSuccess()) {
                    const payment = response.getPayment();
                    // We are choosing to void the payment if it was not authorized for the full amount.
                    if (payment && payment.getAmount() < requestAmount) {
                        const voidPaymentRequest = new clover.remotepay.VoidPaymentRequest();
                        voidPaymentRequest.setPaymentId(payment.getId());
                        voidPaymentRequest.setVoidReason(clover.order.VoidReason.REJECT_PARTIAL_AUTH);
                        updateStatus(`The payment was approved for a partial amount ($${payment.getAmount() / 100}) and will be voided.`, false);
                        cloverConnector.voidPayment(voidPaymentRequest);
                    } else {
                        updateStatus(`${payment.getResult()}: Payment ${payment.getExternalPaymentId()} for $${payment.getAmount() / 100} is complete.`, response.getResult() === clover.remotepay.ResponseCode.SUCCESS);
                        if (!response.getIsSale()) {
                            console.log({error: "Response is not a sale!"});
                        }
                    }
                } else {
                    updateStatus(`Payment ${requestExternalId} for $${requestAmount / 100} has failed or was voided.`, false);
                    this.resetDevice(); // The device may be stuck.
                }
            },

            //clover.remotepay.ResultStatus.SUCCESS

            onRetrievePaymentResponse: function(retrievePaymentResponse: clover.remotepay.RetrievePaymentResponse) {
                console.log({message: "onRetrievePaymentResponse", response: retrievePaymentResponse});
                if (pendingSaleRequest) {
                    if (retrievePaymentResponse.getExternalPaymentId() === pendingSaleRequest.getExternalId()) {
                        if (retrievePaymentResponse.getQueryStatus() === clover.remotepay.QueryStatus.FOUND) {
                            // The payment's status can be used to resolve the payment in your POS.
                            const payment = retrievePaymentResponse.getPayment();
                            updateStatus(`${payment.getResult()}: Payment ${pendingSaleRequest.getExternalId()} is complete.`, payment.getResult() === clover.payments.Result.SUCCESS);
                            pendingSaleRequest = null; // The pending sale is complete.
                            toggleElement("actions", true);
                            toggleElement("pendingStatusContainer", false);
                        } else if (retrievePaymentResponse.getQueryStatus() === clover.remotepay.QueryStatus.IN_PROGRESS) {
                            // payment either not found or in progress,
                            updateStatus(`Payment: ${pendingSaleRequest.getExternalId()} for $${pendingSaleRequest.getAmount() / 100} is in progress.   If you would like to start a new payment, you may reset the device.  However, doing so may void payment ${pendingSaleRequest.getExternalId()}.  If you would like to reset the device anyway please <a onclick="forceResetDevice()" href="#">click here</a> to confirm.`, null, "pendingStatusContainer", "pendingMessage");
                        } else if (retrievePaymentResponse.getQueryStatus() === clover.remotepay.QueryStatus.NOT_FOUND) {
                            updateStatus(`Payment: ${pendingSaleRequest.getExternalId()} wasn't taken or was voided.`, false);
                            toggleElement("pendingStatusContainer", false);
                        }
                    }
                }
            },

            onResetDeviceResponse(retrievePaymentResponse: clover.remotepay.ResetDeviceResponse) {
                if (pendingSaleRequest) {
                    // Verify the payment status, the reset will generally void payments, but not in all cases.
                    const retrievePaymentRequest = new clover.remotepay.RetrievePaymentRequest();
                    retrievePaymentRequest.setExternalPaymentId(pendingSaleRequest.getExternalId());
                    cloverConnector.retrievePayment(retrievePaymentRequest);
                }
            },

            // See https://docs.clover.com/build/working-with-challenges/
            onConfirmPaymentRequest: function (request: clover.remotepay.ConfirmPaymentRequest): void {
                console.log({message: "Automatically accepting payment", request: request});
                updateStatus("Automatically accepting payment", true);
                cloverConnector.acceptPayment(request.getPayment());
                // to reject a payment, pass the payment and the challenge that was the basis for the rejection
                // getCloverConnector().rejectPayment(request.getPayment(), request.getChallenges()[REJECTED_CHALLENGE_INDEX]);
            },

            // See https://docs.clover.com/build/working-with-challenges/
            onVerifySignatureRequest: function (request: clover.remotepay.VerifySignatureRequest): void {
                console.log({message: "Automatically accepting signature", request: request});
                updateStatus("Automatically accepting signature", true);
                cloverConnector.acceptSignature(request);
                // to reject a signature, pass the request to verify
                // getCloverConnector().rejectSignature(request);
            },

            onDeviceReady: function (merchantInfo: clover.remotepay.MerchantInfo): void {
                updateStatus("The connection to your Clover Device has been established.", true);
                toggleElement("connectionForm", false);
                if (!pendingSaleRequest) {
                    console.log({message: "Device Ready to process requests!", merchantInfo: merchantInfo});
                    toggleElement("actions", true);
                } else {
                    // We have an unresolved sale.  The connection to the device was lost and the customer is in the
                    // middle of or finished the payment with the POS disconnected.  Calling retrieveDeviceStatus
                    // with setSendLastMessage will ask the Clover device to send us the last message it
                    // sent which may allow us to proceed with the payment.
                    const retrieveDeviceStatusRequest = new clover.remotepay.RetrieveDeviceStatusRequest();
                    retrieveDeviceStatusRequest.setSendLastMessage(true);
                    cloverConnector.retrieveDeviceStatus(retrieveDeviceStatusRequest);
                }
            },

            onDeviceError: function (cloverDeviceErrorEvent: clover.remotepay.CloverDeviceErrorEvent): void {
                console.log({message: `An error has occurred: ${cloverDeviceErrorEvent.getMessage()}`});
                updateStatus(`An error has occurred: ${cloverDeviceErrorEvent.getMessage()}`, false);
            },

            onDeviceDisconnected: function (): void {
                console.log({message: "You have been disconnected from the Clover device."});
                updateStatus("The connection to your Clover Device has been dropped.", false);
                toggleElement("connectionForm", true);
                toggleElement("actions", false);
            }

        });
    }

    function toggleElement(eleId: string, show: boolean): void {
        let actionsEle: HTMLElement = document.getElementById(eleId);
        if (show) {
            actionsEle.style.display = "block";
        } else {
            actionsEle.style.display = "none";
        }
    }

    function updateStatus(message: string, success: boolean = false, containerId: string = "statusContainer", messageId: string = "statusMessage"): void  {
        toggleElement(containerId, true);
        const statusEle = document.getElementById(messageId);
        statusEle.innerHTML = message;
        if (success === false) {
            statusEle.className = "alert alert-danger";
        } else if (success) {
            statusEle.className = "alert alert-success";
        } else {
            statusEle.className = "alert alert-warning";
        }
    }

};

export {cloudExample}
