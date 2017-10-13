var exampleCLI = (function (module) {
    const clover = require("remote-pay-cloud");
    const inquirer = require('inquirer');
    const XMLHttpRequest = require("xmlhttprequest-ssl").XMLHttpRequest;

    const ExampleWebSocketDeviceConnectionConfiguration = require("./support/ExampleWebSocketDeviceConnectionConfiguration");
    const DefaultConnectionListener = require("./support/DefaultConnectionListener");
    const ExampleWebSocketFactory = require("./support/ExampleWebSocketFactory");
    const ImageUtil = require("./support/ImageUtil");
    const MenuLauncher = require("./support/MenuLauncher");
    const Prompts = require("./support/Prompts");

    const executors = {
        "SaleExecutor": require("./executors/SaleExecutor"),
        "AuthExecutor": require("./executors/AuthExecutor"),
        "PreAuthExecutor": require("./executors/PreAuthExecutor"),
        "ManualRefundExecutor": require("./executors/ManualRefundExecutor"),
        "ReadCardExecutor": require("./executors/ReadCardExecutor"),
        "VaultExecutor": require("./executors/VaultExecutor")
    };

    var keepAlive = setTimeout(() => {
    }, 900000); // For examples purposes only, keeps Node's event loop alive.

    var cloverConnector = null;

    var setCloverConnector = function (cloverConnectorIn) {
        cloverConnector = cloverConnectorIn;
    };

    var cloverConnectorListener = null;

    var setCloverConnectorListener = function (cloverConnectorListenerIn) {
        cloverConnectorListener = cloverConnectorListenerIn;
    };

    var connectionConfigAnswers = null;

    var setConnectionConfigAnswers = function (connectionConfigAnswersIn) {
        connectionConfigAnswers = connectionConfigAnswersIn;
    }

    MenuLauncher.getLaunchSubject().subscribe(() => {
        showMenu();
    });

    // Display and handle the console prompts.
    var showMenu = function () {
        if (connectionConfigAnswers) {
            inquirer.prompt(Prompts.actions).then(function (actionAnswers) {
                connectAndPerformAction(Object.assign({}, actionAnswers, connectionConfigAnswers));
            });
        } else {
            inquirer.prompt(Prompts.configuration).then(function (configAnswers) {
                let connectorPrompts = configAnswers.connectorType === "Cloud" ? "cloud" : "network";
                inquirer.prompt(Prompts[connectorPrompts]).then((typeSpecificConnectionConfigAnswers) => {
                    inquirer.prompt(Prompts.actions).then((actionAnswers) => {
                        setConnectionConfigAnswers(Object.assign({}, configAnswers, typeSpecificConnectionConfigAnswers));
                        connectAndPerformAction(Object.assign({}, connectionConfigAnswers, actionAnswers));
                    });
                });
            });
        }
    };

    var connectAndPerformAction = function (answers) {
        if (!cloverConnector) {
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
                "imageUtil": ImageUtil.create()
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
            setCloverConnector(cloverConnector);
            let exampleConnectorListener = buildCloverConnectionListener(answers);
            cloverConnector.addCloverConnectorListener(exampleConnectorListener);
            setCloverConnectorListener(exampleConnectorListener);
            cloverConnector.initializeConnection();
        } else {
            executeAction(answers);
        }
    };

    var buildCloverConnectionListener = function (answers) {
        let defaultConnectorListener = DefaultConnectionListener.create(cloverConnector);
        return Object.assign(defaultConnectorListener, {
            onDeviceReady: function (merchantInfo) {
                cloverConnector.resetDevice();
                executeAction(answers);
            }
        });
    };

    var executeAction = function (answers) {
        // Connected and available to process requests
        const executor = executors[`${answers.action}Executor`];
        if (executor) {
            executor.create(cloverConnector, cloverConnectorListener).run();
        } else {
            const otherActions = {
                "ShowWelcomeScreen": () => {
                    cloverConnector.showWelcomeScreen();
                    showMenu();
                },
                "ShowThankYouScreen": () => {
                    cloverConnector.showThankYouScreen();
                    showMenu();
                },
                "DisplayMessage": () => {
                    inquirer.prompt(Prompts.message).then((answers) => {
                        cloverConnector.showMessage(answers.message);
                        showMenu();
                    });
                },
                "ResetDevice": () => {
                    cloverConnector.resetDevice();
                    showMenu();
                },
                "PrintFromUrl": () => {
                    const printPrompt = [
                        {
                            type: "input",
                            name: "printUrl",
                            message: "URL Image:",
                            default: "https://raw.githubusercontent.com/clover/clover-cloud-connector-unit-examples/master/public/images/test_receipt_8.jpg"
                        }
                    ];
                    inquirer.prompt(printPrompt).then((answers) => {
                        cloverConnector.printImageFromURL("https://raw.githubusercontent.com/clover/clover-cloud-connector-unit-examples/master/public/images/test_receipt_8.jpg");
                        setTimeout(() => showMenu(), 5000);
                    });
                },
                "Exit": () => disposeAndExit(cloverConnector)

            }
            otherActions[answers.action]();
        }
    };

    var disposeAndExit = function (cloverConnector) {
        console.log("Test Completed.  Cleaning up.");
        // As a best practice in the browser, ensure that the connection is closed cleanly on exit.
        // This should be done with all connectors. Failure to clean up the connection may result in
        // a failure to reconnect.
        cloverConnector.dispose();
        // For example purposes only, kills Node's event loop.
        clearTimeout(keepAlive);
        console.log("Exiting example application.  To restart please run 'node lib/ExampleCLI.js'");
    };

    return {
        showMenu: function () {
            showMenu();
        }
    }

})(module);

// Initiate the console app by displaying the menu.
exampleCLI.showMenu();

