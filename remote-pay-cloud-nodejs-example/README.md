## Example Remote Pay Cloud POS in Node.js

This example contains a simple Node.js application that demonstrates how to connect to a Clover device using the Clover Javascript Cloud Connector. It also shows how to communicate with the device to display information, transact sales, and perform other operations.

## Requirements
- Node.js. We recommend [v6.11.3 LTS](https://nodejs.org/en/).  

## Running the example

To run the example app, enter the following on the command line:

```bash
$ npm install
$ node ./lib/ExampleCLI.js
```

## Implementation notes
The JavaScript Cloud Connector requires WebSocket and XMLHttpRequest (cloud only) implementations. The browser provides these implementations when using the Cloud Connector in a web application. However, implementations must be provided in a Node.js environment. Implementations can be found on npm. We've included a list of libraries that work with the JavaScript Cloud Connector below.

- WebSocket
    - [ws 3.2.0](https://www.npmjs.com/package/ws) (recommended) - This library works out of the box with the JavaScript Cloud Connector.
    - [nodejs-websocket 1.7.1](https://www.npmjs.com/package/nodejs-websocket) (alternative) - While this library works with the JavaScript Cloud Connector, the `CloverWebSocketInterface.connect` method must be overridden, due to API differences. From `./lib/support/ExampleWebSocketFactory.js`:
    
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
   - [xmlhttprequest-ssl 1.5.5](https://www.npmjs.com/package/xmlhttprequest-ssl) (recommended) - This library works out of the box with the JavaScript Cloud Connector.

- IImageUtil
   - `IImageUtil` is part of the Clover API.
   - An `IImageUtil` implementation is passed into the configuration object used when connecting to the device. It is used to print and retrieve images from a URL.  An example implementation is provided in this repository (see ./lib/support/ImageUtil.js).
