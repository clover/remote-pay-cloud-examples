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
    // Configuration Note: Endpoint is required if you would like to use the Network Connector (Network Pay Display app).
    // Configuration Note: Leave endpoint as an empty string if you would like to use the Cloud Connector (Cloud Pay Display app).
    let endpoint = "wss://10.249.254.133:12345/remote_pay";
    let cloverDeviceConnectionConfiguration = getDeviceConfigurationForNetwork({
        "endpoint": endpoint, // Please update this if you would like to use the Network Connector.
        "applicationId": "Cloud Starter",
        "posName": "Cloud Starter POS",
        "serialNumber": "Register_1",
        "authToken": getAuthToken(),
        "webSocketFactoryFunction": clover.BrowserWebSocketImpl.createInstance,
        "imageUtil": new clover.ImageUtil()
    });
    if (this.endpoint && this.endpoint.length > 0) {
        // Configuration Note: If you would like to use the Cloud Connector accessToken, cloverServer, merchantId and deviceId must be set properly.
        cloverDeviceConnectionConfiguration = getDeviceConfigurationForCloud(Object.assign({}, cloverDeviceConnectionConfiguration, {
            "accessToken": "the OAuth access token that will be used when contacting the clover server. Tied to the merchant and the app",
            "cloverServer": "https://sandboxdev.dev.clover.com/",
            "httpSupport": new clover.HttpSupport(XMLHttpRequest),
            "merchantId": "VKYQ0RVGMYHRR",
            "deviceId": "the id (not uuid) of the device to connect to",
            "friendlyId": "Cloud Starter"
        }));
    } else {
        console.log(`Initializing connection to device at ${endpoint}`);
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
            console.log({message: "Disconnected", detailMessage: message});
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