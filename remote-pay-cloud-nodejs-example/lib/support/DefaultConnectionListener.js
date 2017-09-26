(function(module) {
    const clover = require("remote-pay-cloud");

    var defaultConnectorListener = module.exports;

    defaultConnectorListener.create = function() {
        return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, defaultHandlers);
    }

    var defaultHandlers = {
        onDeviceConnected: function () {
            console.log("Connected, but pairing/authentication may be required before requests can be processed.");
        },
        onDeviceReady: function(mechantInfo) {
            console.log(`Your Clover device is ready to process requests! Merchant Information: ${mechantInfo}.`);
        },
        onDeviceDisconnected: function(message) {
            if (message) {
                console.log(message);
            }
        },
        onDeviceError: function(message) {
            console.log(`An error has occurred, details: ${message}`);
        }
    }

})(module);




