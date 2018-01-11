var clover = require("remote-pay-cloud");

// This turns on logging for requests made through the ICloverConnector
clover.DebugConfig.loggingEnabled = true;

/**
 * Create an example object to use for testing.  This is only one way to
 * exercise a ICloverConnector instance
 *
 * @constructor
 */
CloudStarter = function () {
};

/**
 * The method we use to run the test
 */
CloudStarter.prototype.run = function () {
    // Shared by both Network and Cloud configurations.
    // Configuration Note: Enter your app's Remote Application Id below!
    // See: https://docs.clover.com/build/create-your-remote-app-id/ for more
    // information on how to obtain your remote application id.
    const baseConfiguration = {
        "applicationId": "yourRemoteApplicationId",
        "posName": "Cloud Starter POS",
        "serialNumber": "Register_1",
        "webSocketFactoryFunction": clover.BrowserWebSocketImpl.createInstance,
        "imageUtil": new clover.ImageUtil()
    };
    let cloverDeviceConnectionConfiguration = null;
    // Configuration Note: Set useCloudConfiguration to false to use the Clover's Network connector.
    const useCloudConfiguration = true;
    if (!useCloudConfiguration) {
        // Configuration Note: Endpoint is required if you would like to use the Network Connector (Network Pay Display app).
        // You can find the correct endpoint by opening the Network Pay Display app on your device.
        let endpoint = "wss://10.249.254.133:12345/remote_pay";
        cloverDeviceConnectionConfiguration = getDeviceConfigurationForNetwork(Object.assign({}, baseConfiguration, {
            "endpoint": endpoint,
            "authToken": getAuthToken()
        }));
    } else {
        // Configuration Note: See: https://docs.clover.com/build/getting-started-with-clover-connector/?sdk=browser for more information
        // on how to obtain the required connection parameter values.
        cloverDeviceConnectionConfiguration = getDeviceConfigurationForCloud(Object.assign({}, baseConfiguration, {
            "accessToken": "yourAccessTokenHere",
            "cloverServer": "https://sandbox.dev.clover.com/",
            "httpSupport": new clover.HttpSupport(XMLHttpRequest),
            "merchantId": "yourMerchantIdhere",
            "deviceId": "yourDeviceUUIDHere",
            "friendlyId": "Cloud Starter"
        }));
    }

    let builderConfiguration = {};
    builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);
    let cloverConnector = cloverConnectorFactory.createICloverConnector(cloverDeviceConnectionConfiguration);
    setCloverConnector(cloverConnector);
    cloverConnector.addCloverConnectorListener(buildCloverConnectionListener(cloverConnector));
    cloverConnector.initializeConnection();
};

CloudStarter.prototype.showMessage = function () {
    getCloverConnector().showMessage("Welcome to Clover Connector!");
    // NOTE:  We are NOT returning the device to the default screen!  Because we are not,
    // the message will remain on the device until it is told to change it.

    // Always properly dispose of the CloverConnector.
    cleanup();
};

CloudStarter.prototype.performSale = function () {
    var saleRequest = new clover.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10);
    saleRequest.setAutoAcceptSignature(false);
    console.log({message: "Sending sale", request: saleRequest});

    let defaultCloverConnectorListener = buildCloverConnectionListener(cloverConnector);
    getCloverConnector().addCloverConnectorListener(Object.assign({}, defaultCloverConnectorListener, {
        onSaleResponse: function (response) {
            updateStatus("Sale response received");
            console.log({message: "Sale response received", response: response});
            if (!response.getIsSale()) {
                console.log({error: "Response is not a sale!"});
            }
            // Always properly dispose of the CloverConnector.
            cleanup();
        },

        onConfirmPaymentRequest: function (request) {
            console.log({message: "Automatically accepting payment", request: request});
            updateStatus("Automatically accepting payment");
            getCloverConnector().acceptPayment(request.getPayment());
            // to reject a payment, pass the payment and the challenge that was the basis for the rejection
            // getCloverConnector().rejectPayment(request.getPayment(), request.getChallenges()[REJECTED_CHALLENGE_INDEX]);
        },

        onVerifySignatureRequest: function (request) {
            console.log({message: "Automatically accepting signature", request: request});
            updateStatus("Automatically accepting signature");
            getCloverConnector().acceptSignature(request);
            // to reject a signature, pass the request to verify
            // getCloverConnector().rejectSignature(request);
        }
    }));
    getCloverConnector().sale(saleRequest);
};

var getDeviceConfigurationForCloud = function (connectionConfiguration) {
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
};

var getDeviceConfigurationForNetwork = function (connectionConfiguration) {
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
};

/**
 * The definition of the listener.  It extends the functionality to the "interface" ICloverConnectorListener.
 * This implementation has a reference to the ICloverConnector passed in so that it can use it during the
 * program lifecycle.
 *
 * @param cloverConnector
 *
 * @constructor
 */
var buildCloverConnectionListener = function (cloverConnector) {
    return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, {

        onDeviceReady: function (merchantInfo) {
            updateStatus("Pairing successfully completed, your Clover device is ready to process requests.");
            console.log({message: "Device Ready to process requests!", merchantInfo: merchantInfo});
            toggleActions(true);
        },

        onDeviceDisconnected: function () {
            console.log({message: "Disconnected"});
            toggleActions(false);
        },

        onDeviceConnected: function () {
            console.log({message: "Connected, but not available to process requests"});
            toggleActions(false);
        }

    });
};

var cleanup = function() {
    getCloverConnector().dispose();
    toggleActions(false);
    updateStatus("Not connected to your Clover device.  Please connect to perform an action.")
}

var toggleActions = function (show) {
    let actionsEle = document.getElementById("actions");
    if (show) {
        actionsEle.style.display = "block";
    } else {
        actionsEle.style.display = "none";
    }
}

var updateStatus = function (message) {
    document.getElementById("status").innerHTML = message;
};

var setCloverConnector = function (cloverConnector) {
    this.cloverConnector = cloverConnector;
};

var getCloverConnector = function () {
    return this.cloverConnector;
};

var setAuthToken = function (authToken) {
    this.authToken = authToken;
};

var getAuthToken = function () {
    return this.authToken;
};

if ('undefined' !== typeof module) {
    module.exports = CloudStarter;
}