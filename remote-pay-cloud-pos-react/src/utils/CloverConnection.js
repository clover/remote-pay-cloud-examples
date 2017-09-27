import React from 'react';
import clover from 'remote-pay-cloud';
import POSCloverConnectorListener from "./POSCloverConnectorListener";

export default class CloverConnection {

    constructor(options){
        this.connected = false;
        this.cloverConnector = null;
        Object.assign(this, options);
    }

    getConnected (){
        console.log("getConnected called", this.connected);
        return this.connected;
    }

    setConnected(connected){
        this.connected = connected;
    }

    connectToDevice(uriText, authToken) {
        console.log("connecting.....", uriText, authToken);
        // let saleCalled = false;
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);
        let connector = cloverConnectorFactory.createICloverConnector(new ExampleWebsocketPairedCloverDeviceConfiguration({
            uri: uriText,
            applicationId: "com.clover.cloud-pos-example-react",
            posName: "pos.name",
            serialNumber: "register_1",
            authToken: authToken,
            heartbeatInterval: 1000,
            reconnectDelay: 3000
        }, this.toggleConnectionState, this.setConnected.bind(this), this.setPairingCode));
        this.cloverConnector = connector;

        let connectorListener = new POSCloverConnectorListener({
            cloverConnector: this.cloverConnector,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature
        });

        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();
    }

}

export class ExampleWebsocketPairedCloverDeviceConfiguration extends clover.WebSocketPairedCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    constructor(
        rawConfiguration, toggleConnectionState, setConnected, setPairingCode, cloverConnector) {
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
        this.setConnected = setConnected;
        this.setPairingCode = setPairingCode;
        this.cloverConnector = cloverConnector;
    }

    onPairingCode(pairingCode) {
        console.log("Pairing code is " + pairingCode);
        this.setPairingCode(pairingCode);
    }

    onPairingSuccess(authToken) {
        console.log("Pairing succeeded, authToken is " + authToken);
        this.toggleConnectionState(true);
        this.setConnected(true);
    }
}

