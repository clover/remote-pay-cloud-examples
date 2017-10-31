## Overview

This example contains a simple Node.js application which demonstrates how to connect to a Clover Device using the Clover Javascript Cloud Connector, and communicating with it in order to display information, perform sales and other operations.

## Requirements
- Node.js - We recommend [v6.11.3 LTS] (https://nodejs.org/en/).  

## Running the Example
```bash
$ npm install
$ node ./lib/ExamplesCLI.js
```

## Implementation Notes
The JavaScript Cloud Connector requires a WebSocket and XMLHttpRequest (cloud only) implementation.  When running in the browser these dependencies are provided.  In a Node.js environment these dependencies must be provided.  Below is a list of libraries that have been tested and work with the JavaScript Cloud Connector.

- WebSocket
    - Recommended - https://www.npmjs.com/package/ws (3.2.0) - This library works out of the box with the JavaScript Cloud Connector.
    - Alternative - https://www.npmjs.com/package/nodejs-websocket - (1.7.1) - This library works but due to API differences the CloverWebSocketInterface.connect method must be overridden (from ./lib/support/ExampleWebSocketFactory.js):
    
    ```javascript
      webSocketOverrides["connect"] = function () {
        this.webSocket = this.createWebSocket(this.endpoint);
        // The nodejs-websocket library uses "on" instead of "addEventListener" and it
        // sends the data unwrapped.  We are accounting for these differences here so
        // that nodejs-websocket plays nicely with our API.
        this.webSocket["on"]("connect", (event) => this.notifyOnOpen({data: event})); // not standard
        this.webSocket["on"]("text", (event) => this.notifyOnMessage({data: event})); // not standard
        this.webSocket["on"]("binary", (event) => this.notifyOnMessage({data: event})); // not standard
        this.webSocket["on"]("close", (event) => this.notifyOnClose({data: event}));
        this.webSocket["on"]("error", (event) => this.notifyOnError({data: event}));
        return this;
    }
  
    ```
- XMLHttpRequest    
   - Recommended - https://www.npmjs.com/package/xmlhttprequest-ssl (1.5.4) - This library works out of the box with the JavaScript Cloud Connector.

- IImageUtil
   - IImageUtil is part of the Clover API.
   - An IImageUtil implementation is passed in the configuration object used when connecting to the device and is used for printing and retrieving images from a URL.  An example implementation is provided in this repository (./lib/support/ImageUtil.js)
