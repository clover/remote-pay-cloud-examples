import React from 'react';
import ButtonNormal from "./ButtonNormal";
import ButtonPrinterDropdown from "./ButtonPrinterDropdown";
import sdk from 'remote-pay-cloud-api';

export default class Device extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessageContent : "Hello Message!",
            printTextContent : "Print This!!",
            queryPaymentText: 'JANRZXDFT3JF',
            printImageURL: 'http://dkcoin8.com/images/game-of-thrones-live-clipart-6.jpg',
            file: null,
            imagePreviewUrl: null,
            printers: [],
            printType: null,
            showDropDown : false
        };
        console.log("Device: ", this.props);
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.store = this.props.store;
        this.showMessage = this.showMessage.bind(this);
        this.printText = this.printText.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.printImageChange = this.printImageChange.bind(this);
        this.printChange = this.printChange.bind(this);
        this.printFromURL = this.printFromURL.bind(this);
        this.readCardData = this.readCardData.bind(this);
        this.showWelcomeScreen = this.showWelcomeScreen.bind(this);
        this.showThankYouScreen = this.showThankYouScreen.bind(this);
        this.closeout = this.closeout.bind(this);
        this.openCashDrawer = this.openCashDrawer.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleImageChangeDropDown = this.handleImageChangeDropDown.bind(this);
        this.printerChosen = this.printerChosen.bind(this);
        this.showDropDown = this.showDropDown.bind(this);
    }

    showMessage(){
        this.cloverConnector.showMessage(this.state.showMessageContent);
    }

    printText(){
        this.setState({printType: "TEXT"});
        let pr = new sdk.remotepay.PrintRequest();
        pr.setImageUrl([this.state.printImageURL]);
        this.cloverConnector.print(pr);
    }

    printerChosen(printer, printType){
        if(printType === 'URL'){
            let pr = new sdk.remotepay.PrintRequest();
            pr.setImageUrl([this.state.printImageURL]);
            pr.setPrintDeviceId(printer.id);
            this.cloverConnector.print(pr);
        }
        else if(printType === "TEXT"){
            let pr = new sdk.remotepay.PrintRequest();
            pr.setText([this.state.printTextContent]);
            pr.setPrintDeviceId(printer.id);
            this.cloverConnector.print(pr);
        }
        else if(printType === "CASH"){
            let ocdr = new sdk.remotepay.OpenCashDrawerRequest();
            ocdr.setReason("TEST");
            ocdr.setDeviceId(printer.id);
            this.cloverConnector.openCashDrawer(ocdr);
        }
        this.setState({printType: null});
    }

    showWelcomeScreen(){
        this.cloverConnector.showWelcomeScreen();
    }

    showThankYouScreen(){
        this.cloverConnector.showThankYouScreen();
    }

    handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            let image = new Image();
            image.src = reader.result;
            let pr = new sdk.remotepay.PrintRequest();
            pr.setImage([image]);
            image.addEventListener('load', function() {
                this.cloverConnector.print(pr);
            }.bind(this));
            image.addEventListener('error', function() {
                alert('error')
            })
        };
        reader.readAsDataURL(file);
    }

    handleImageChangeDropDown(e, printer) {
        //console.log("handleDropDown", printer);
        this.setState({showDropDown : false});
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            let image = new Image();
            image.src = reader.result;
            let pr = new sdk.remotepay.PrintRequest();
            pr.setImage([image]);
            pr.setPrintDeviceId(printer.id);
            image.addEventListener('load', function() {
                this.cloverConnector.print(pr);
            }.bind(this));
            image.addEventListener('error', function() {
                alert('error')
            })
        };
        reader.readAsDataURL(file);

    }

    closeout(){
        let request = new sdk.remotepay.CloseoutRequest();
        request.setAllowOpenTabs(false);
        request.setBatchId(null);
        this.cloverConnector.closeout(request);
    }

    openCashDrawer(){
        let ocdr = new sdk.remotepay.OpenCashDrawerRequest();
        ocdr.setReason("TEST");
        this.cloverConnector.openCashDrawer(ocdr);
    }

    printFromURL(){
        let pr = new sdk.remotepay.PrintRequest();
        pr.setImageUrl([this.state.printImageURL]);
        this.cloverConnector.print(pr);
    }

    readCardData(){
        this.cloverConnector.readCardData(new sdk.remotepay.ReadCardDataRequest(this.store.getCardEntryMethods()));
    }

    messageChange(e){
        this.setState({ showMessageContent: e.target.value});
    }

    printChange(e){
        this.setState({ printTextContent: e.target.value});
    }

    printImageChange(e){
        this.setState({ printImageURL: e.target.value});
    }

    componentWillMount() {
        let rpr = new sdk.remotepay.RetrievePrintersRequest();
        this.cloverConnector.retrievePrinters(rpr);
    }

    showDropDown(){
        this.setState({showDropDown : !this.state.showDropDown});
    }

    componentWillReceiveProps(newProps) {
        if(newProps.printers !== null && this.state.printers.length < 1){
            this.setState({printers : newProps.printers});
        }
    }

    render(){
        let printersAdded = this.state.printers.length > 0;
        const showDropDown = this.state.showDropDown;
        return(
            <div>
                {printersAdded &&
                <div className="device">
                    <h2>Device Options</h2>
                    <div className="device_options">
                        <div className="misc_row">
                            <input className="device_input" type="text" value={this.state.showMessageContent} onChange={this.messageChange}/>
                            <ButtonNormal extra="button_input" color="white" title="Show Message" onClick={this.showMessage}/>
                        </div>

                        <div className="misc_row">
                            <input className="device_input" type="text" value={this.state.printTextContent} onChange={this.printChange}/>
                            <ButtonPrinterDropdown title="Print Text" onClick={this.printText} printers={this.state.printers} dropDownClick={this.printerChosen} printType="TEXT"/>
                        </div>
                        <div className="misc_row">
                            <input className="device_input" type="text"  onChange={this.printImageChange} value={this.state.printImageURL}/>
                            <ButtonPrinterDropdown title="Print Image from Url" onClick={this.printFromURL} printers={this.state.printers} dropDownClick={this.printerChosen} printType="URL"/>
                        </div>
                        <div className="misc_row">
                            <div className="button_device">
                                <div className="button_dropdown">
                                    <input className="file_upload upload" name="file" id="file" type="file" onChange={(e)=>this.handleImageChange(e)} />
                                    <label className="dropdown_button" htmlFor="file">Print Image</label>
                                    <button onClick={this.showDropDown} className="dropdown_dropdown">V</button>
                                </div>
                                {showDropDown &&
                                <div className="dropdown">
                                    {this.state.printers.map((printer, i) => {
                                        return (
                                            <div key={'printer-' + i} className="printer_row">
                                                <input className="file_upload" name="file" id={"file_dropdown" + i} type="file" onChange={(e)=>this.handleImageChangeDropDown(e, printer)} />
                                                <label htmlFor={"file_dropdown" + i}>
                                                    <div className="row">
                                                        <div>ID:</div>
                                                        <div>{printer.id}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div>Name:</div>
                                                        <div>{printer.name}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div>Type:</div>
                                                        <div>{printer.type}</div>
                                                    </div>
                                                </label>
                                            </div>
                                        )})}
                                </div>
                                }
                            </div>
                            <ButtonNormal extra="button_device" color="white" title="Read Card Data" onClick={this.readCardData}/>
                        </div>
                        <div className="misc_row">
                            <ButtonNormal extra="button_device" color="white" title="Show Welcome Screen" onClick={this.showWelcomeScreen}/>
                            <ButtonNormal extra="button_device" color="white" title="Show Thank You Screen" onClick={this.showThankYouScreen}/>
                        </div>
                        <div className="misc_row">
                            <ButtonNormal extra="button_device" color="white" title="Closeout Orders" onClick={this.closeout}/>
                            <ButtonPrinterDropdown title="Open Cash Drawer" onClick={this.openCashDrawer} printers={this.state.printers} dropDownClick={this.printerChosen} printType="CASH"/>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}