const clover = require("remote-pay-cloud");
const inquirer = require('inquirer');
const XMLHttpRequest = require("xmlhttprequest-ssl").XMLHttpRequest;

const ExampleWebSocketDeviceConnectionConfiguration = require("./support/ExampleWebSocketDeviceConnectionConfiguration");
const DefaultConnectionListener = require("./support/DefaultConnectionListener");
const ExampleWebSocketFactory = require("./support/ExampleWebSocketFactory");
const Prompts = require("./support/Prompts");

var keepAlive = setTimeout(function() { }, 900000); // For examples purposes only, keeps Node's event loop alive.

// Display and handle the console prompts.
inquirer.prompt(Prompts.initial).then((answers) => {
    if (answers.followPrompts === "prompts") {
        inquirer.prompt(Prompts.configuration).then(function (configAnswers) {
            let connectorPrompts = configAnswers.connectorType === "Cloud" ? "cloud" : "network";
            inquirer.prompt(Prompts[connectorPrompts]).then((connectionConfigAnswers) => {
                connectAndPerformAction(Object.assign({}, configAnswers, connectionConfigAnswers));
            });
        });
    } else {
        connectWithManualConfig()
    }
});

/**
 * If you would like to by-pass the configuration prompts, enter your configuration here and choose to manually enter your configuration at the first prompt.
 */
var connectWithManualConfig = function() {
    connectAndPerformAction({
        "applicationId": "com.butters.clover.com",
        "webSocketLibrary": "ws",
        "connectorType": "Cloud",
        "ipAddress": "",
        "port": "",
        "secure": "Yes",
        "action": "sale",
        "accessToken": "2e3273cf-d7ae-fc9f-8e4c-481ed0834ecc",
        "cloverServer": "http://localhost:9000/",
        "merchantId": "59RECDKBW11G6",
        "deviceId": "c368b68c4175f5971af6d0359054d109",
        "friendlyId": "testTerminal1_connection1"
    });
}

var connectAndPerformAction = function(answers) {
    let scheme = answers.secure === "Yes" ? "wss" : "ws";
    let endpoint = `${scheme}://${answers.ipAddress}:${answers.port}/remote_pay`;
    // Retrieve the web socket factory based on which library you are using (ws or nodejs-websocket).
    let webSocketFactory = ExampleWebSocketFactory.create(answers);
    // Default to network configuration.
    let connectionConfiguration = {
        "endpoint": endpoint,
        "applicationId": answers.applicationId,
        "posName": "Clover Remote Pay Cloud Tutorial",
        "serialNumber": "Register_1",
        "authToken": null,
        "webSocketFactoryFunction": webSocketFactory.get,
        "imageUtil": new clover.ImageUtil()
    };
    let useCloud = answers.connectorType === "Cloud";
    if (useCloud) {
        connectionConfiguration = Object.assign({}, connectionConfiguration, {
            "accessToken": answers.accessToken,
            "cloverServer": answers.cloverServer,
            "httpSupport": new clover.HttpSupport(XMLHttpRequest),
            "merchantId": answers.merchantId,
            "deviceId": answers.deviceId,
            "friendlyId": answers.friendlyId
        });
    } else {
        console.log(`Initializing connection to device at ${endpoint}`);
    }

    // Initialize the connection to the device.
    let cloverDeviceConnectionConfiguration = ExampleWebSocketDeviceConnectionConfiguration.create(connectionConfiguration, useCloud);
    let builderConfiguration = {};
    builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);
    let cloverConnector = cloverConnectorFactory.createICloverConnector(cloverDeviceConnectionConfiguration);
    let exampleConnectorListener = buildListenerForAction(cloverConnector, answers);
    cloverConnector.addCloverConnectorListener(exampleConnectorListener);
    cloverConnector.initializeConnection();
};

var buildListenerForAction = function(cloverConnector, answers) {
    let defaultConnectorListener = DefaultConnectionListener.create();
    let actionOnReady = function() {
        cloverConnector.showMessage("Welcome to Clover Connector!");
    }

    if (answers.action === "sale") {
        actionOnReady = function() {
            var saleRequest = new clover.remotepay.SaleRequest();
            saleRequest.setExternalId(clover.CloverID.getNewId());
            saleRequest.setAmount(10);
            console.log({message: "Sending sale", request: saleRequest});
            cloverConnector.sale(saleRequest);
        }
    }

    return Object.assign(defaultConnectorListener, {
        onDeviceReady: function (merchantInfo) {
            // Connected and available to process requests
            console.log({message: "In onDeviceReady, starting test", merchantInfo: merchantInfo});
            actionOnReady();
            setTimeout(() => {
                // NOTE:  We are NOT returning the device to the default screen!  Because we are not,
                // the message will remain on the device until it is told to change it.
                disposeAndExit(cloverConnector);
            }, 5000);
        }
    });

};

var disposeAndExit = function(cloverConnector) {
    console.log("Test Completed.  Cleaning up.");
    // As a best practice in the browser, ensure that the connection is closed cleanly on exit.
    // This should be done with all connectors. Failure to clean up the connection may result in
    // a failure to reconnect.
    cloverConnector.dispose();
    // For example purposes only, kills Node's event loop.
    clearTimeout(keepAlive);
    console.log("Exiting example application.  To restart please run 'node lib/Example.js'");
};