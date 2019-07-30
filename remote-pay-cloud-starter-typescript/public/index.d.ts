declare const cloudExample: () => {
    /**
     * Establishes a connection to the Clover device based on the configuration provided.
     */
    connect: (connectionConfiguration?: any) => boolean;
    /**
     * Sends a message to your Clover device.
     */
    showMessage: () => void;
    /**
     * Resets your Clover device (will cancel ongoing transactions and return to the welcome screen).
     */
    resetDevice: () => void;
    /**
     * Performs a sale on your Clover device.
     */
    performSale: () => void;
    /**
     * It is important to properly dispose of your Clover Connector, this function is called in window.onbeforeunload in index.html.
     */
    cleanup: () => void;
    showNetworkInfo: () => void;
    showCloudInfo: () => void;
};
export { cloudExample };
