import ButtonNormal from './ButtonNormal';
import ButtonPrinterDropdown from './ButtonPrinterDropdown';
import React from 'react';
import clover from 'remote-pay-cloud';

export default class Device extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            imagePreviewUrl: null,
            printers: [],
            printImageURL: 'http://dkcoin8.com/images/game-of-thrones-live-clipart-6.jpg',
            printTextContent : 'Print This!!',
            printType: null,
            queryPaymentText: 'JANRZXDFT3JF',
            showDropDown : false,
            showMessageContent : 'Hello Message!'
        };

        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.store = this.props.store;

        this.closeout = this.closeout.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleImageChangeDropDown = this.handleImageChangeDropDown.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.openCashDrawer = this.openCashDrawer.bind(this);
        this.printChange = this.printChange.bind(this);
        this.printerChosen = this.printerChosen.bind(this);
        this.printFromURL = this.printFromURL.bind(this);
        this.printImageChange = this.printImageChange.bind(this);
        this.printText = this.printText.bind(this);
        this.readCardData = this.readCardData.bind(this);
        this.showDropDown = this.showDropDown.bind(this);
        this.showThankYouScreen = this.showThankYouScreen.bind(this);
        this.showWelcomeScreen = this.showWelcomeScreen.bind(this);
    }

    showMessage(){      // shows message on Clover Device
        this.cloverConnector.showMessage(this.state.showMessageContent);
    }

    printText(){        // prints text on Clover Device
        let pr = new clover.sdk.remotepay.PrintRequest();
        pr.setText([this.state.printTextContent]);
        this.cloverConnector.print(pr);
    }

    printerChosen(printer, printType){      // executes print job based on type selected
        if(printType === 'URL'){
            let pr = new clover.sdk.remotepay.PrintRequest();
            pr.setImageUrl([this.state.printImageURL]);
            pr.setPrintDeviceId(printer.id);
            this.cloverConnector.print(pr);
        }
        else if(printType === 'TEXT'){
            let pr = new clover.sdk.remotepay.PrintRequest();
            pr.setText([this.state.printTextContent]);
            pr.setPrintDeviceId(printer.id);
            this.cloverConnector.print(pr);
        }
        else if(printType === 'CASH'){
            let ocdr = new clover.sdk.remotepay.OpenCashDrawerRequest();
            ocdr.setReason('POS JavaScript Example Test');
            ocdr.setDeviceId(printer.id);
            this.cloverConnector.openCashDrawer(ocdr);
        }
        this.setState({ printType: null });
    }

    showWelcomeScreen(){     // shows welcome screen on Clover device
        this.cloverConnector.showWelcomeScreen();
    }

    showThankYouScreen(){       // shows thank you screen on Clover device
        this.cloverConnector.showThankYouScreen();
    }

    handleImageChange(e) {      // tells device to print image selected
        e.preventDefault();
        this.setState({showDropDown : false});

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({ file: file, imagePreviewUrl: reader.result });
            let image = new Image();
            image.src = reader.result;

            let pr = new clover.sdk.remotepay.PrintRequest();
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

    handleImageChangeDropDown(e, printer) {     // tells device to print image selected from printer selected
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

            let pr = new clover.sdk.remotepay.PrintRequest();
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

    closeout(){     // tells Clover device to closeout
        let request = new clover.sdk.remotepay.CloseoutRequest();
        request.setAllowOpenTabs(false);
        request.setBatchId(null);
        this.cloverConnector.closeout(request);
    }

    openCashDrawer(){       // tells Clover device to open cash drawer
        let ocdr = new clover.sdk.remotepay.OpenCashDrawerRequest();
        ocdr.setReason('POS JavaScript Example Test');
        this.cloverConnector.openCashDrawer(ocdr);
    }

    printFromURL(){     // tells Clover device to print image from URL
        let pr = new clover.sdk.remotepay.PrintRequest();
        pr.setImageUrl([this.state.printImageURL]);
        this.cloverConnector.print(pr);
    }

    readCardData(){     // tells Clover device to read card data
        this.cloverConnector.readCardData(new clover.sdk.remotepay.ReadCardDataRequest(this.store.getCardEntryMethods()));
    }

    messageChange(e){       // handles message change for show message
        this.setState({ showMessageContent: e.target.value});
    }

    printChange(e){     // handles text change for print text
        this.setState({ printTextContent: e.target.value});
    }

    printImageChange(e){     // handles image url change for print image from url
        this.setState({ printImageURL: e.target.value});
    }

    showDropDown(){     // toggles dropdown for print image printer selection
        this.setState( { showDropDown : !this.state.showDropDown });
    }

    componentWillMount() {
        let rpr = new clover.sdk.remotepay.RetrievePrintersRequest();
        this.cloverConnector.retrievePrinters(rpr);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.printers !== null && this.state.printers.length < 1){
            this.setState({ printers : newProps.printers });
        }
    }

    render(){
        let printersAdded = this.state.printers.length > 0;
        const showDropDown = this.state.showDropDown;

        let className = showDropDown ? 'button_dropdown_open' : 'button_dropdown';
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
                            <div className="dropdown_container">
                                <div className={className}>
                                    <div className="row button_device">
                                        <input className="file_upload upload" name="file" id="file" type="file" onChange={(e)=>this.handleImageChange(e)} />
                                        <label className="dropdown_button" htmlFor="file">Print Image</label>
                                        <button onClick={this.showDropDown} className="dropdown_dropdown">
                                            <i className="fa fa-caret-down" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                                {showDropDown &&
                                <div className="dropdown">
                                    <div className="printer_row border_top">
                                        <input className="file_upload" name="file" id={"file_dropdown_default"} type="file" onChange={(e)=>this.handleImageChange(e)} />
                                        <label className="printer_row_no_border" htmlFor={"file_dropdown_default"}>
                                            <img className="printer_image" src="images/printer.png"/>
                                            <div>DEFAULT</div>
                                        </label>
                                    </div>
                                    {this.state.printers.map((printer, i) => {
                                        return (
                                            <div key={'printer-' + i} className="printer_row">
                                                <input className="file_upload" name="file" id={"file_dropdown" + i} type="file" onChange={(e)=>this.handleImageChangeDropDown(e, printer)} />
                                                <label  className="printer_row_no_border" htmlFor={"file_dropdown" + i}>
                                                    <img className="printer_image" src="images/printer.png"/>
                                                    <div>
                                                        <div className="row_wrap print_row_bold">
                                                            <div>Name:</div>
                                                            <div>{printer.name}</div>
                                                        </div>
                                                        <div className="row_wrap print_row_small">
                                                            <div>ID:</div>
                                                            <div>{printer.id}</div>
                                                        </div>
                                                        <div className="row_wrap print_row_small">
                                                            <div>Type:</div>
                                                            <div>{printer.type}</div>
                                                        </div>
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