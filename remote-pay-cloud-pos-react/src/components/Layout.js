import ButtonNormal from "./ButtonNormal";
import Connect from "./../utils/CloverConnection";
const data = require ("../../src/items.js");
import Discount from '../models/Discount';
import Item from '../models/Item';
import { Link } from 'react-router';
import QrReader from 'react-qr-reader';
import React, { Component } from 'react'
import Store from '../models/Store';


export default class Layout extends Component {

    constructor(props){
        super(props);
        this.state = {
            challenge: false,
            challengeContent: null,
            choosePrinter: false,
            connected : false,
            delay: 100,
            fadeBackground: false,
            inputOptions: null,
            localhost: false,
            pairingCode: '',
            preAuth: false,
            printers: [],
            refundSuccess: false,
            response: false,
            responseFail: false,
            result: 'No Result',
            request: null,
            saleFinished: false,
            signatureRequest: null,
            showSignature: false,
            showQR: false,
            statusArray: null,
            statusText: '',
            statusToggle: false,
            tipAdjust: false,
            tipAmount: 0,
            uriText : 'wss://192.168.0.35:12345/remote_pay',
            vaultedCard : false
        };

        this.acceptPayment = this.acceptPayment.bind(this);
        this.acceptSignature = this.acceptSignature.bind(this);
        this.challenge = this.challenge.bind(this);
        this.choosePrinter = this.choosePrinter.bind(this);
        this.closeStatusArray = this.closeStatusArray.bind(this);
        this.closePairingCode = this.closePairingCode.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
        this.confirmSignature = this.confirmSignature.bind(this);
        this.connect = this.connect.bind(this);
        this.fadeBackground = this.fadeBackground.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleScan = this.handleScan.bind(this);
        this.inputOptions = this.inputOptions.bind(this);
        this.QRClicked = this.QRClicked.bind(this);
        this.rejectPayment = this.rejectPayment.bind(this);
        this.rejectSignature = this.rejectSignature.bind(this);
        this.setPairingCode = this.setPairingCode.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.tipAdded = this.tipAdded.bind(this);
        this.toggleConnectionState = this.toggleConnectionState.bind(this);
        this.unfadeBackground = this.unfadeBackground.bind(this);

        this.store = new Store();

        this.cloverConnection = new Connect({
            toggleConnectionState: this.toggleConnectionState,
            setPairingCode: this.setPairingCode,
            setStatus: this.setStatus,
            challenge: this.challenge,
            tipAdded: this.tipAdded,
            store: this.store,
            closeStatus: this.closeStatus,
            inputOptions: this.inputOptions,
            confirmSignature: this.confirmSignature
        });

        this.initStore();
    }

    initStore(){        // initializes store
        data.forEach(function(item){
            let newItem = new Item(item.id, item.title, item.itemPrice, item.taxable, item.tippable);
            this.store.addItem(newItem);
        }, this);

        this.store.addDiscount(new Discount('10% Off', 0 , 0.1));
        this.store.addDiscount(new Discount('$5 Off', 500 , 0.00));
    }

    connect(){      // connects to Clover device
        this.cloverConnection.connectToDevice(this.state.uriText, null);
    }

    toggleConnectionState(connected){       // toggles Clover device connection state
        this.setState({ connected: connected});
        if(connected){
            this.setState({ fadeBackground: false });
        }
    }

    setPairingCode(pairingCode){        // sets pairing code
        console.log('setPairingCode', pairingCode);
        this.setState({ pairingCode: pairingCode, fadeBackground: true });
    }

    closePairingCode(){     // closes pairing code
        this.setState({ pairingCode: '', fadeBackground: false });
    }

    confirmSignature(request){      // shows popup for confirming signature
        this.closeStatus();
        let signature = request.signature;
        this.setState({showSignature: true, fadeBackground: true, signatureRequest: request });
        const ctx = this.refs.canvas.getContext('2d');
        ctx.scale(0.25, 0.25);
        for (var strokeIndex = 0; strokeIndex < signature.strokes.length; strokeIndex++) {
            var stroke = signature.strokes[strokeIndex];
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (var pointIndex = 1; pointIndex < stroke.points.length; pointIndex++) {
                ctx.lineTo(stroke.points[pointIndex].x, stroke.points[pointIndex].y);
                ctx.stroke();
            }
        }
    }

    acceptSignature(){      // accepts signature
        this.cloverConnection.cloverConnector.acceptSignature(this.state.signatureRequest);
        this.closeSignature();
    }

    rejectSignature(){      // rejects signature
        this.cloverConnection.cloverConnector.rejectSignature(this.state.signatureRequest);
        this.closeSignature();
    }

    setStatus(message, reason) {        // decides how to display status
        //console.log(message, reason);
        if((typeof message === 'object') && (message !== null)){
            this.setState({ statusArray: message,  statusToggle: false, fadeBackground: true, responseFail: false, refundSuccess: false, choosePrinter: false , tipAdjust: false, vaultedCard: false });
        }
        else if(message == 'Printers'){
            this.setState({ printers: reason })
        }
        else if (message == 'Sale Processed Successfully' || message == 'Auth Processed Successfully' || message === 'PreAuth Successful' || message === 'PreAuth Processed Successfully') {
            this.saleFinished(message);
        }
        else if(message === 'Response was not a sale'){
            this.setState({ responseFail : true, statusText: reason, fadeBackground: true, statusToggle: true, inputOptions: null, refundSuccess: false, choosePrinter: false,  tipAdjust: false, vaultedCard: false });
            setTimeout(function() {
                this.setState({ statusToggle: false, fadeBackground: false });
            }.bind(this), 1200);
        }
        else if(reason === 'Toggle'){
            this.statusToggle(message);
        }
        else{
            this.setState({
                statusToggle: true,
                statusText: message,
                challenge: false,
                saleFinished: false,
                vaultedCard: false,
                preAuth: false,
                inputOptions: null,
                fadeBackground: true,
                responseFail: false,
                refundSuccess: false,
                choosePrinter: false,
                tipAdjust: false,
            });
        }
    }

    saleFinished(message){      // called when sale is finished
        if(message === 'PreAuth Successful'){
            this.setState({ preAuth: true });
        }
        this.setState({ statusText: message, statusToggle: true, saleFinished: true, fadeBackground: true, responseFail: false, refundSuccess: false, response: true, choosePrinter: false,  tipAdjust: false, vaultedCard: false});
        setTimeout(function() {
            this.setState({ statusToggle: false, fadeBackground: false, response: false });
        }.bind(this), 1500);
    }

    statusToggle(message){      // shows status for 1.5 seconds then closes
        if(message === 'Card Successfully Vaulted'){
            this.setState({ vaultedCard: true, refundSuccess: false, tipAdjust: false });
        }
        else if(message === 'Refund Processed Successfully'){
            this.setState({ refundSuccess: true, vaultedCard: false, tipAdjust: false });
        }
        else if(message === 'Tip adjusted successfully'){
            this.setState({ refundSuccess: false, vaultedCard: false, tipAdjust: true });
        }
        else{
            this.setState({ refundSuccess: false, vaultedCard: false, tipAdjust: false });
        }
        this.setState({ statusToggle: true, statusText: message, challenge: false, saleFinished: false, fadeBackground: true, responseFail: false, choosePrinter: false, inputOptions: null });
        setTimeout(function() {
            this.setState({ statusToggle: false, fadeBackground: false });
        }.bind(this), 1500);
    }


    closeStatusArray(){ // closes status array
        this.setState({ statusArray : null, fadeBackground: false });
    }

    closeSignature(){       // closes signature verification popup
        this.setState({ showSignature: false, fadeBackground: false });
    }


    closeStatus(){      // closes status
        if(!this.state.challenge && !this.state.response){
            this.setState({ statusToggle: false });
            if(this.state.statusArray === null){
                this.setState({ fadeBackground: false })
            }
        }
    }

    tipAdded(tipAmount){     // sets tip amount
        this.setState({tipAmount : tipAmount });
    }

    challenge(challenge, request){      // shows challenge as popup
        this.setState({ statusToggle: true, statusText: challenge.message, challenge : true, request : request, inputOptions: null, challengeContent: challenge });
    }

    acceptPayment(){       // accepts payment
        this.cloverConnection.cloverConnector.acceptPayment(this.state.request.payment);
        this.setState({ challenge : false, statusToggle : false, fadeBackground: false });
    }

    rejectPayment(){        //rejects payment
        this.cloverConnection.cloverConnector.rejectPayment(this.state.request.payment, this.state.challengeContent);
        this.setState({ challenge: false, statusToggle: false, fadeBackground: false, responseFail: true });
    }

    inputOptions(io){       // sets input options
        this.setState({inputOptions: io});
    }

    inputClick(io){     // performs input option click
        this.cloverConnection.cloverConnector.invokeInputOption(io);
        this.closeStatus();
    }

    choosePrinter(printer){     // sets chosen printer
        console.log("printer chosen: ", printer);
        this.setState({ printer : printer, choosePrinter: false });
    }

    QRClicked(){        // shows QR screen
        this.setState({ showQR: true });
    }

    handleScan(data){       // connects to device from qr scan
        if(data !== null && data !== undefined && this.state.result === 'No Result') {
            if(!this.state.connected) {
                this.setState({ result: data });
                let dataPieces = data.split('?');
                let authToken = dataPieces[1].split('=')[1];
                this.cloverConnection.connectToDevice(dataPieces[0], authToken);
            }
        }
    }

    handleError(err){       // handles qr code reader error
        console.log("QR Reader Error", err);
        this.setStatus('There was an error using the QR-Reader, please connect through Network Pay Display');
        this.setState({ showQR : false , localhost: false });
    }

    handleChange (e) {      // handles network pay display uri text
        this.setState({ uriText: e.target.value });
    }

    fadeBackground(){       // fades background for popup
        this.setState({ fadeBackground: true });
    }

    unfadeBackground(){     // unfades background
        this.setState({ fadeBackground: false });
    }

    componentWillMount() {
        if (location.hostname === 'localhost' || location.protocol === 'https:'){
            this.setState({localhost: true});
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', () => {
            let cloverConnector = this.cloverConnection.cloverConnector;
            if (cloverConnector) {
                cloverConnector.dispose();
            }
        });
    }

    render() {
        let choosePrinter=this.state.choosePrinter;
        let fadeBackground = this.state.fadeBackground;
        let localhost = this.state.localhost;
        let showBody = this.state.connected;
        let showChallenge = this.state.challenge;
        let showQR = this.state.showQR;
        let showSignature = this.state.showSignature;
        let showStatus = this.state.statusToggle;
        let status = this.state.statusText;

        let connectionState = 'Disconnected';
        if( this.state.connected) {
            connectionState = 'Connected';
            if(this.store.getStoreName()!== null){
                connectionState = (connectionState + ' to ' + this.store.getStoreName());
            }
        }

        let pairing = <div></div>;
        if( this.state.pairingCode.length > 0){
            pairing = (<div className="popup popup_container">
                <div className="close_popup" onClick={this.closePairingCode}>X</div>
                <div className="pairing_code">Enter pairing code: <span>{this.state.pairingCode}</span> into your device</div>
            </div>);
        }

        let listContainer = <div></div>;
        let showStatusArray = false;
        let statusArrayTitle = "";
        if(this.state.statusArray !== null){
            showStatusArray = true;
            statusArrayTitle = this.state.statusArray.title;
            let listItems = this.state.statusArray.data.map((line, i) =>
                <p key={"line-" + i}>{line}</p>
            );
            listContainer = (<div className="card_data_content">{listItems}</div>);
        }

        let inputContainer = <div></div>;
        let showInputOptions = false;
        if(this.state.inputOptions !== null){
            showInputOptions = true;
            let inputButtons = this.state.inputOptions.map((option, i) =>
                <ButtonNormal key={"option-" + i} title={option.description} color="white" extra="input_options_button" onClick={() => {this.inputClick(option)}}/>
            );
            inputContainer = (<div className="input_buttons">{inputButtons}</div>);
        }

        const previewStyle = {
            height: 240,
            width: 320
        };

        return (
            <div className="app-content">
                {fadeBackground && <div className="popup_opaque"></div>}
                <div className="page_header">
                    <Link to="/">
                        <img className="home_logo" src={'images/home.png'}/>
                    </Link>
                    <div id="connection_status">
                        {connectionState}
                    </div>
                    <div className="filler_space"></div>
                </div>

                {showSignature &&
                <div className="popup popup_container">
                    <div className="close_popup" onClick={this.closeSignature}>X</div>
                    <canvas className="signature" ref="canvas"/>
                    <div className="reject_accept">
                        <ButtonNormal title="Reject" color="white" extra="left dialog_button" onClick={this.rejectSignature}/>
                        <ButtonNormal title="Accept" color="white" extra="right dialog_button" onClick={this.acceptSignature}/>
                    </div>
                </div>
                }

                {showStatusArray &&
                <div className="card_data popup">
                    <div className="close_popup" onClick={this.closeStatusArray}>X</div>
                    <h3>{statusArrayTitle}</h3>
                    {listContainer}
                </div>}

                {showStatus &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closeStatus}>X</div>
                    <div className="status">
                        {status}
                    </div>
                    {showInputOptions && <div>{inputContainer}</div>}
                    {showChallenge &&
                    <div className="reject_accept">
                        <ButtonNormal title="Reject" color="white" extra="left dialog_button" onClick={this.rejectPayment} />
                        <ButtonNormal title="Accept" color="white" extra="right dialog_button" onClick={this.acceptPayment}/>
                    </div>
                    }
                </div>
                }

                {choosePrinter &&
                <div className="popup popup_container choose_printer">
                    {this.state.printers.map((printer, i) => {
                        return <div key={"printer-" + i} className="printer_row" onClick={() =>{this.choosePrinter(printer)}}>
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
                        </div>
                    })}
                </div>
                }

                {showBody? (
                    <div className="body_content">{React.cloneElement(this.props.children,
                        {
                            toggleConnectionState: this.toggleConnectionState,
                            cloverConnection: this.cloverConnection,
                            store: this.store,
                            setStatus : this.setStatus,
                            closeStatus: this.closeStatus,
                            saleFinished : this.state.saleFinished,
                            tipAmount : this.state.tipAmount,
                            vaultedCard: this.state.vaultedCard,
                            preAuth: this.state.preAuth,
                            fadeBackground: this.fadeBackground,
                            unfadeBackground: this.unfadeBackground,
                            responseFail: this.state.responseFail,
                            refundSuccess: this.state.refundSuccess,
                            printers: this.state.printers,
                            tipAdjust: this.state.tipAdjust
                        })}
                    </div>
                ):(
                    <div className="connect_container">
                        <img className="clover_logo" src={"images/clover_logo.png"}/>
                        <p>Example POS</p>

                        {!showQR &&
                        <div className="column_plain center">
                            <h3>Enter the URI of your device</h3>
                            <p> This can be found in the Network Pay Display app</p>
                            <div className="connect_box">
                                <input className="input_field" type="text" id="uri" value={this.state.uriText} onChange={this.handleChange}/>
                                <ButtonNormal color="white" title="Connect" extra="connect_button" onClick={this.connect}/>
                            </div>
                            {localhost &&
                            <div className="qr_box">
                                <div className="row_padding">or</div>
                                < div className="qr_button">
                                    <ButtonNormal color="white"  extra="connect_button margin_right" title="Connect with QR" onClick={this.QRClicked}/>
                                    <span className="qr_tooltip">This can be found by running your finger up and down four times on the screen while in Network Pay Display and then pressing the QR code to print</span>
                                </div>
                            </div>
                            }
                        </div>
                        }
                        {pairing}
                        {showQR &&
                        <div className="column_plain center">
                            <QrReader
                                delay={this.state.delay}
                                style={previewStyle}
                                onError={this.handleError}
                                onScan={this.handleScan}
                            />
                            <p>{this.state.result}</p>
                        </div>
                        }
                    </div>
                )}
            </div>
        );
    }

}