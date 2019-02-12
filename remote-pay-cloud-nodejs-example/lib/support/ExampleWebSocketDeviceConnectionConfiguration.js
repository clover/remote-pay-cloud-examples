(function (module) {
    const clover = require("remote-pay-cloud");

    var deviceConnectionConfiguration = module.exports;

    /**
     * Returns a network or cloud connection configuration based on the passed parameters.
     *
     * @param connectionConfiguration
     * @param useCloud
     * @returns {target}
     */
    deviceConnectionConfiguration.create = function (connectionConfiguration, useCloud) {
        let configBuilder = null;
        if (useCloud) {
            // Cloud Configuration.
            configBuilder  = new clover.WebSocketCloudCloverDeviceConfigurationBuilder(
                connectionConfiguration.remoteApplicationId,
                connectionConfiguration.deviceId,
                connectionConfiguration.merchantId,
                connectionConfiguration.accessToken);
            configBuilder.setCloverServer(connectionConfiguration.cloverServer);
            configBuilder.setFriendlyId(connectionConfiguration.friendlyId);
            configBuilder.setHttpSupport(connectionConfiguration.httpSupport);
            configBuilder.setWebSocketFactoryFunction(connectionConfiguration.webSocketFactoryFunction);
        } else {
            let onPairingCode = (pairingCode) => {
                console.log(`    > Entering Pairing Code on Device: ${pairingCode}`);
            };
            let onPairingSuccess = (authToken) => {
                console.log(`    > Got Pairing Auth Token: ${authToken}`);
            };
            // Network Configuration.
            configBuilder = new clover.WebSocketPairedCloverDeviceConfigurationBuilder(connectionConfiguration.remoteApplicationId,
                connectionConfiguration.endpoint, connectionConfiguration.serialNumber, connectionConfiguration.authToken, onPairingCode, onPairingSuccess);
            configBuilder.setWebSocketFactoryFunction(connectionConfiguration.webSocketFactoryFunction);
            configBuilder.setPosName(connectionConfiguration.posName)
        }
        return configBuilder.build();
    };
})(module);

