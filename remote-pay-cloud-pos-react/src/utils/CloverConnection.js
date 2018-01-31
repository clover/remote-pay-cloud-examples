import clover from 'remote-pay-cloud';
import POSCloverConnectorListener from './POSCloverConnectorListener';
import React from 'react';
import { myConfig } from '../config.js';

export default class CloverConnection {

    constructor(options){
        this.cloverConnector = null;
        this.connected = false;
        Object.assign(this, options);
    }
    connectToDevicePairing(uriText, authToken) {
        console.log('connecting.....', uriText, authToken);
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);
        let connector = cloverConnectorFactory.createICloverConnector(new ExampleWebsocketPairedCloverDeviceConfiguration({
            uri: uriText,
            applicationId: 'com.clover.cloud-pos-example-react',
            posName: 'pos.name',
            serialNumber: 'register_1',
            authToken: authToken,
            heartbeatInterval: 1000,
            reconnectDelay: 3000
        }, this.toggleConnectionState, this.setPairingCode));
        this.cloverConnector = connector;

        let connectorListener = new POSCloverConnectorListener({
            cloverConnector: this.cloverConnector,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature,
            toggleConnection: this.toggleConnectionState
        });

        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();
    }

    connectToDeviceCloud(accessToken, merchantId, deviceId) {
        console.log('connecting.....', accessToken, merchantId, deviceId);
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);
        let connector = cloverConnectorFactory.createICloverConnector(new ExampleWebsocketCloudCloverDeviceConfiguration({
            appId: 'com.clover.cloud-pos-example-react',
            cloverServer: myConfig.cloverServer,
            serialNumber: 'register_1',
            accessToken: accessToken,
            merchantId: merchantId,
            deviceId: deviceId,
            friendlyId: '',
            forceConnect: false,
            heartbeatInterval: 1000,
            reconnectDelay: 3000
        }, this.toggleConnectionState));
        this.cloverConnector = connector;

        let connectorListener = new POSCloverConnectorListener({
            cloverConnector: this.cloverConnector,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature,
            toggleConnection: this.toggleConnectionState
        });

        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();
    }

}

export class ExampleWebsocketPairedCloverDeviceConfiguration extends clover.WebSocketPairedCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    constructor(rawConfiguration, toggleConnectionState, setPairingCode, cloverConnector) {
        super(
            rawConfiguration.uri,
            rawConfiguration.applicationId,
            rawConfiguration.posName,
            rawConfiguration.serialNumber,
            rawConfiguration.authToken,
            clover.BrowserWebSocketImpl.createInstance,
            new clover.ImageUtil(),
            rawConfiguration.heartbeatInterval,
            rawConfiguration.reconnectDelay);
        this.toggleConnectionState = toggleConnectionState;
        this.setPairingCode = setPairingCode;
        this.cloverConnector = cloverConnector;
    }

    onPairingCode(pairingCode) {
        console.log(`Pairing code is ${pairingCode}`);
        this.setPairingCode(pairingCode);
    }

    onPairingSuccess(authToken) {
        console.log(`Pairing succeeded, authToken is ${authToken}`);
    }
}

export class ExampleWebsocketCloudCloverDeviceConfiguration extends clover.WebSocketCloudCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    constructor(rawConfiguration, toggleConnectionState, setConnected, cloverConnector) {
        super(
            rawConfiguration.appId,
            clover.BrowserWebSocketImpl.createInstance,
            new clover.ImageUtil(),
            rawConfiguration.cloverServer,
            rawConfiguration.accessToken,
            new clover.HttpSupport(XMLHttpRequest),
            rawConfiguration.merchantId,
            rawConfiguration.deviceId,
            rawConfiguration.friendlyId,
            rawConfiguration.forceConnect,
            rawConfiguration.heartbeatInterval,
            rawConfiguration.reconnectDelay);
        this.toggleConnectionState = toggleConnectionState;
        this.setConnected = setConnected;
        this.cloverConnector = cloverConnector;
    }
}