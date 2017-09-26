(function (module) {

    var prompts = module.exports;

    var required = function (input) {
        if (!input || input.length === 0) {
            return false;
        }
        return true;
    }

    prompts.initial = [
        {
            type: "list",
            name: "followPrompts",
            message: "Would you like to follow prompts or manually enter your configuration in the connectWithManualConfig function in lib/Example.js?",
            choices: [{
                name: "Follow prompts",
                value: "prompts"
            }, {
                name: "Manually enter configuration",
                value: "manual"
            }],
            default: "manual"
        }
    ];

    prompts.configuration = [
        {
            type: "list",
            name: "action",
            message: "What action would you like to take?",
            choices: [{
                name: "Display a message on my Clove device",
                value: "message"
            }, {
                name: "Initiate a sale",
                value: "sale"
            }],
            default: "message"
        },
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
    ]

})(module);