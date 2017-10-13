(function (module) {

    var prompts = module.exports;

    var required = function (input) {
        if (!input || input.length === 0) {
            return false;
        }
        return true;
    };

    prompts.actions = [
        {
            type: "list",
            name: "action",
            message: "What action would you like to take?",
            choices: [{
                name: "1. Sale",
                value: "Sale"
            }, {
                name: "2. Auth",
                value: "Auth"
            }, {
                name: "3. PreAuth",
                value: "PreAuth"
            }, {
                name: "4. Vault Card",
                value: "Vault"
            }, {
                name: "5. Manual Refund",
                value: "ManualRefund"
            }, {
                name: "6. Read Card Data",
                value: "ReadCard"
            }, {
                name: "7. Show Welcome Screen",
                value: "ShowWelcomeScreen"
            }, {
                name: "8. Show Thank You Screen",
                value: "ShowThankYouScreen"
            }, {
                name: "9. Display Message",
                value: "DisplayMessage"
            }, {
                name: "10. Reset Device",
                value: "ResetDevice"
            }, {
                name: "11. Print Image from URL",
                value: "PrintFromUrl"
            }, {
                name: "99. Exit",
                value: "Exit"
            }],
            default: "Sale"
        }
    ];

    prompts.configuration = [
        {
            type: "input",
            name: "applicationId",
            message: "Enter your Application Id:",
            default: "com.mybus.myapp"
        },
        {
            type: "list",
            name: "webSocketLibrary",
            message: "Which web socket library would you like to use?  ws (https://www.npmjs.com/package/ws) or nodejs-websocket (https://www.npmjs.com/package/nodejs-websocket)?",
            choices: ["ws", "nodejs-websocket"],
            default: "ws"
        },
        {
            type: "list",
            name: "connectorType",
            message: "Which connector would you like to use?",
            choices: ["Network", "Cloud"],
            default: "Network"
        }
    ];

    prompts.network = [
        {
            type: "input",
            name: "ipAddress",
            message: "Enter the IP address of the device you would like to connect to (e.g. 192.168.0.48):",
            validate: required
        },
        {
            type: "input",
            name: "port",
            message: "Enter the port of the server running on your device:",
            default: "12345",
            validate: required
        },
        {
            type: "list",
            name: "secure",
            message: "Would you like to use a secure connection (wss, https)?",
            choices: ["No", "Yes"],
            default: "Yes"
        }
    ];

    prompts.cloud = [
        {
            type: "input",
            name: "cloverServer",
            message: "Enter the location of your clover server:",
            default: "http://localhost:9000/",
            validate: required
        },
        {
            type: "input",
            name: "merchantId",
            message: "Enter your merchant id (e.g. 59RECDKBW11G6):",
            validate: required
        },
        {
            type: "input",
            name: "deviceId",
            message: "Enter your device id (e.g. c368b68c4175f5971af6d0359054d109):",
            validate: required
        },
        {
            type: "input",
            name: "accessToken",
            message: "Enter your access token:",
            validate: required
        },
        {
            type: "input",
            name: "friendlyId",
            message: "Enter your friendly id:",
            default: "friendly_id"
        }
    ];

    prompts.preAuth = [
        {
            type: "confirm",
            name: "preAuth",
            message: "Do you want to capture the pre auth for $20?",
            default: true
        }
    ];

    prompts.tip = [
        {
            type: "confirm",
            name: "tip",
            message: "Would you like to add a $2.00 tip?",
            default: false
        }
    ];

    prompts.amount = [
        {
            type: "input",
            name: "amount",
            message: "Amount in cents",
            default: 1000,
            validate: required
        }
    ];

    prompts.message = [
        {
            type: "input",
            name: "message",
            message: "Enter Message:",
            default: "Hello!"
        }
    ];

})(module);