# Remote Pay Cloud Starter

This repository contains a sample web application that uses Clover Connector to connect to a Clover device and perform basic operations.

To clone this repository, enter the following on the command line:

    git clone git@github.com:clover/remote-pay-cloud-examples.git
    cd remote-pay-cloud-starter
   
Next, you will need to modify the Clover Connector configuration in `index.js`.  Please see the "Configuration Note" comments in the code for guidance.
  
Once the Clover Connector configuration has been set, you can build and run the application locally with the following commands:
  
    npm install
    npm run build
    npm start 
    
This will start a local server on port 3000. You can then navigate to http://localhost:3000 to view the application.    
    
## Prerequisites
Please see the [Getting Started with Clover Connector tutorial](https://docs.clover.com/build/getting-started-with-clover-connector/?sdk=browser) for more information and a list of prerequisites.
