import * as clover from "remote-pay-cloud";

const cloudExample = () => {

    let cloverConnector: clover.remotepay.ICloverConnector = null;
    let authToken: string = null;

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
            // Work-around for typings issue in 3.1.0.  This will be fixed in the next release.
            (cloverConnector as any).addCloverConnectorListener(buildCloverConnectionListener());
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
            cloverConnector.resetDevice();
        },

        /**
         * Performs a sale on your Clover device.
         */
        performSale: function (): void {
            const saleRequest: clover.remotepay.SaleRequest = new clover.remotepay.SaleRequest();
            saleRequest.setExternalId(clover.CloverID.getNewId());
            saleRequest.setAmount(10);
            saleRequest.setAutoAcceptSignature(false);
            console.log({message: "Sending sale", request: saleRequest});
            // Perform the sale.
            cloverConnector.sale(saleRequest);
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
                updateStatus("Sale complete.", response.getResult() === "SUCCESS");
                console.log({message: "Sale response received", response: response});
                if (!response.getIsSale()) {
                    console.log({error: "Response is not a sale!"});
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
                updateStatus("Your Clover device is ready to process requests.", true);
                console.log({message: "Device Ready to process requests!", merchantInfo: merchantInfo});
                toggleElement("connectionForm", false);
                toggleElement("actions", true);
            },

            onDeviceError: function (cloverDeviceErrorEvent: clover.remotepay.CloverDeviceErrorEvent): void {
                updateStatus(`An error has occurred and we could not connect to your Clover Device. ${cloverDeviceErrorEvent.getMessage()}`, false);
                toggleElement("connectionForm", true);
                toggleElement("actions", false);
            },

            onDeviceDisconnected: function (): void {
                updateStatus("The connection to your Clover Device has been dropped.", false);
                console.log({message: "Disconnected"});
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

    function updateStatus(message: string, success: boolean = false): void  {
        toggleElement("statusContainer", true);
        const statusEle: HTMLElement = document.getElementById("statusMessage");
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
