import clover from 'remote-pay-cloud';
import POSCloverConnectorListener from './POSCloverConnectorListener';
import React from 'react';
import { myConfig } from '../config.js';

export default class CloverConnection {

    constructor(options){
        this.cloverConnector = null;
        this.connected = false;
        this.applicationId = 'com.clover.cloud-pos-example-react';
        Object.assign(this, options);
    }
    connectToDevicePairing(uriText, authToken) {
        console.log('connecting.....', uriText, authToken);
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);

        const onPairingCode = (pairingCode) => {
            console.log(`Pairing code is ${pairingCode}`);
            this.setPairingCode(pairingCode);
        };

        const onPairingSuccess = (authToken) => {
            console.log(`Pairing succeeded, authToken is ${authToken}`);
        };

        const networkConfigurationBuilder = new clover.WebSocketPairedCloverDeviceConfigurationBuilder(this.applicationId,  uriText, 'example_pos','register_1', authToken, onPairingCode, onPairingSuccess);
        const pairedConfiguration = networkConfigurationBuilder.setPosName('pos.name')
            .setHeartbeatInterval(1000)
            .setReconnectDelay(3000)
            .build();
        this.cloverConnector = cloverConnectorFactory.createICloverConnector(pairedConfiguration);

        let connectorListener = new POSCloverConnectorListener({
            cloverConnector: this.cloverConnector,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature,
            toggleConnection: this.toggleConnectionState,
            customSuccess: this.customSuccess,
            newCustomMessage: this.newCustomMessage,
            finalCustomMessage: this.finalCustomMessage
        });

        this.cloverConnector.addCloverConnectorListener(connectorListener);
        this.cloverConnector.initializeConnection();
    }

    connectToDeviceCloud(accessToken, merchantId, deviceId, forceConnect = false) {
        console.log('connecting.....', accessToken, merchantId, deviceId);
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);

        const cloudConfigurationBuilder = new clover.WebSocketCloudCloverDeviceConfigurationBuilder(this.applicationId, deviceId, merchantId, accessToken);
        const cloudConfiguration = cloudConfigurationBuilder.setCloverServer(myConfig.cloverServer)
            .setFriendlyId(clover.CloverID.getNewId())
            .setForceConnect(forceConnect)
            .setHeartbeatInterval(1000)
            .setHeartbeatDisconnectTimeout(3000)
            .build();
        this.cloverConnector = cloverConnectorFactory.createICloverConnector(cloudConfiguration);

        let connectorListener = new POSCloverConnectorListener({
            cloverConnector: this.cloverConnector,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature,
            toggleConnection: this.toggleConnectionState,
            customSuccess: this.customSuccess,
            newCustomMessage: this.newCustomMessage,
            finalCustomMessage: this.finalCustomMessage
        });

        this.cloverConnector.addCloverConnectorListener(connectorListener);
        this.cloverConnector.initializeConnection();
    }

}
