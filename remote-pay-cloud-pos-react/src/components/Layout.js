import React, { Component } from 'react'
import QrReader from 'react-qr-reader';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import Connect from "./../utils/CloverConnection";
import Store from '../models/Store';
import Item from '../models/Item';
import Discount from '../models/Discount';
const data = require ("../../src/items.js");


export default class Layout extends Component {

    constructor(props){
        super(props);
        this.state = {
            connected : false,
            uriText : "wss://192.168.0.35:12345/remote_pay",
            pairingCode: '',
            statusText: '',
            statusToggle: false,
            challenge: false,
            challengeContent: null,
            request: null,
            saleFinished: false,
            tipAmount: 0,
            statusArray: null,
            vaultedCard : false,
            preAuth: false,
            inputOptions: null,
            fadeBackground: false,
            responseFail: false,
            signatureRequest: null,
            showSignature: false,
            refundSuccess: false,
            showQR: false,
            delay: 100,
            result: 'No Result',
            response: false,
        };

        // Create binding for React since we aren't using React.createClass - https://daveceddia.com/avoid-bind-when-passing-props/.
        this.toggleConnectionState = this.toggleConnectionState.bind(this);
        this.setPairingCode = this.setPairingCode.bind(this);
        this.closePairingCode = this.closePairingCode.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.connect = this.connect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.challenge = this.challenge.bind(this);
        this.acceptPayment = this.acceptPayment.bind(this);
        this.rejectPayment = this.rejectPayment.bind(this);
        this.tipAdded = this.tipAdded.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
        this.closeCardData = this.closeCardData.bind(this);
        this.inputOptions = this.inputOptions.bind(this);
        this.fadeBackground = this.fadeBackground.bind(this);
        this.unfadeBackground = this.unfadeBackground.bind(this);
        this.confirmSignature = this.confirmSignature.bind(this);
        this.acceptSignature = this.acceptSignature.bind(this);
        this.rejectSignature = this.rejectSignature.bind(this);
        this.QRClicked = this.QRClicked.bind(this);
        this.connectQR = this.connectQR.bind(this);
        this.handleScan = this.handleScan.bind(this);

        this.store = new Store();
        this.initStore();

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
    }

    componentDidMount() {
        window.addEventListener('beforeunload', () => {
            let cloverConnector = this.cloverConnection.cloverConnector;
            if (cloverConnector) {
                cloverConnector.dispose();
            }
        });
    }

    initStore(){
        data.forEach(function(item){
            let newItem = new Item(item.id, item.title, item.itemPrice, item.taxable, item.tippable);
            this.store.addItem(newItem);
        }, this);

        this.store.addDiscount(new Discount("10% Off", 0 , 0.1));
        this.store.addDiscount(new Discount("$5 Off", 500 , 0.00));
    }

    toggleConnectionState(connected){
        this.setState({ connected: connected});
        if(connected){
            this.setState({fadeBackground: false});
        }
    }

    setPairingCode(pairingCode){
        this.setState({ pairingCode: pairingCode, fadeBackground: true});
    }

    closePairingCode(){
        this.setState({ pairingCode: '', fadeBackground: false});
    }

    confirmSignature(request){
        console.log("calling closeStatus");
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

    acceptSignature(){
        this.cloverConnection.cloverConnector.acceptSignature(this.state.signatureRequest);
        this.closeSignature();
    }

    rejectSignature(){
        this.cloverConnection.cloverConnector.rejectSignature(this.state.signatureRequest);
        this.closeSignature();
    }

    setStatus(message, reason) {
        //console.log(message, reason);
        if((typeof message === "object") && (message !== null)){
            this.setState({statusArray: message,  statusToggle: false, fadeBackground: true, responseFail: false, refundSuccess: false});
        }
        else if (message == 'Sale Processed Successfully' || message == 'Auth Processed Successfully' || message === "PreAuth Successful" || message === "PreAuth Processed Successfully") {
            this.saleFinished(message);
        }
        else if(message === 'Response was not a sale'){
            this.setState({responseFail : true, statusText: reason, fadeBackground: true, statusToggle: true, inputOptions: null, refundSuccess: false});
            setTimeout(function() {
                this.setState({statusToggle: false, fadeBackground: false});
            }.bind(this), 1200);
        }
        else if(reason === "Toggle"){
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
                refundSuccess: false
            });
        }
    }

    saleFinished(message){
        //console.log("saleFinished");
        if(message === 'PreAuth Successful'){
            this.setState({preAuth: true});
        }
        this.setState({statusText: message, statusToggle: true, saleFinished: true, fadeBackground: true, responseFail: false, refundSuccess: false, response: true});
        setTimeout(function() {
            this.setState({statusToggle: false, fadeBackground: false, response: false});
        }.bind(this), 1500);
    }

    statusToggle(message){
        if(message === 'Card Successfully Vaulted'){
            this.setState({vaultedCard: true, refundSuccess: false});
        }
        if(message === 'Refund Processed Successfully'){
            this.setState({refundSuccess: true});
        }
        this.setState({statusToggle: true, statusText: message, challenge: false, saleFinished: false, fadeBackground: true, responseFail: false});
        setTimeout(function() {
            this.setState({statusToggle: false, fadeBackground: false});
        }.bind(this), 1500);
    }


    closeCardData(){
        this.setState({statusArray : null, fadeBackground: false});
    }

    closeSignature(){
        this.setState({showSignature: false, fadeBackground: false});
    }


    closeStatus(){
        if(!this.state.challenge && !this.state.response){
            this.setState({statusToggle: false});
            if(this.state.statusArray === null){
                this.setState({fadeBackground: false})
            }
        }
    }

    tipAdded(tipAmount){
        this.setState({tipAmount : tipAmount });
    }

    challenge(challenge, request){
        this.setState({statusToggle: true, statusText: challenge.message, challenge : true, request : request, inputOptions: null, challengeContent: challenge});
    }

    acceptPayment(){
        this.cloverConnection.cloverConnector.acceptPayment(this.state.request.payment);
        this.setState({challenge : false, statusToggle : false, fadeBackground: false});
    }

    rejectPayment(){
        this.cloverConnection.cloverConnector.rejectPayment(this.state.request.payment, this.state.challengeContent);
        this.setState({challenge: false, statusToggle: false, fadeBackground: false, responseFail: true});
    }

    inputOptions(io){
        this.setState({inputOptions: io});
    }

    inputClick(io){
        this.cloverConnection.cloverConnector.invokeInputOption(io);
        this.closeStatus();
    }


    connect(){
        this.cloverConnection.connectToDevice(this.state.uriText, null);
    }

    connectQR(){

    }

    QRClicked(){
        this.setState({showQR: true});
    }

    handleScan(data){
        if(data !== null && data !== undefined && this.state.result === 'No Result') {
            if(!this.state.connected) {
                this.setState({result: data});
                let dataPieces = data.split('?');
                let authToken = dataPieces[1].split('=')[1];
                this.cloverConnection.connectToDevice(dataPieces[0], authToken);
            }
        }
    }

    handleError(err){
        console.log(err);
    }

    handleChange (e) {
        this.setState({ uriText: e.target.value });
    }

    fadeBackground(){
        this.setState({fadeBackground: true});
    }

    unfadeBackground(){
        //console.log('unfade background called');
        this.setState({fadeBackground: false});
    }

    render() {
        let connectionState = "Disconnected";
        if( this.state.connected) {
            connectionState = "Connected";
            if(this.store.getStoreName()!== null){
                connectionState = (connectionState + " to "+this.store.getStoreName());
            }
        }
        let showBody = this.state.connected;
        // let showBody = true;
        let pairing = <div/>;
        if( this.state.pairingCode.length > 0){
            pairing = (<div className="popup popup_container">
                <div className="close_popup" onClick={this.closePairingCode}>X</div>
                <div className="pairing_code">Enter pairing code: <span>{this.state.pairingCode}</span> into your device</div>
            </div>);
        }
        let showStatus = this.state.statusToggle;
        let status = this.state.statusText;
        let listContainer = <div></div>;
        let inputContainer = <div></div>;
        let showStatusArray = false;
        let statusArrayTitle = "";
        let showInputOptions = false;
        let fadeBackground = this.state.fadeBackground;
        if(this.state.statusArray !== null){
            showStatusArray = true;
            statusArrayTitle = this.state.statusArray.title;
            let listItems = this.state.statusArray.data.map((line, i) =>
                <p key={'line-'+i}>{line}</p>
            );
            listContainer = (<div className="card_data_content">
                {listItems}
            </div>);
        }
        if(this.state.inputOptions !== null){
            showInputOptions = true;
            let inputButtons = this.state.inputOptions.map((option, i) =>
                <ButtonNormal key={'option-'+i} title={option.description} color="white" extra="input_options_button" onClick={() => {this.inputClick(option)}}/>
            );
            inputContainer = (<div className="input_buttons">{inputButtons}</div>);
        }
        let showChallenge = this.state.challenge;
        let showSignature = this.state.showSignature;
        let showQR = this.state.showQR;
        const previewStyle = {
            height: 240,
            width: 320,
        };

        return (
            <div className="app-content">
                {fadeBackground &&
                <div className="popup_opaque"></div>
                }
                <div className="page_header">
                    <Link to="/">
                        <img className="home_logo" src={'images/home.png'}/>
                    </Link>
                    <div id="connection_status">
                        {connectionState}
                    </div>
                    <div className="filler_space"/>
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
                    <div className="close_popup" onClick={this.closeCardData}>X</div>
                    <h3>{statusArrayTitle}</h3>
                    {listContainer}
                </div>}
                {showStatus &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closeStatus}>X</div>
                    <div className="status">
                        {status}
                    </div>
                    {showInputOptions &&
                    <div>
                        {inputContainer}
                    </div>
                    }
                    {showChallenge &&
                    <div className="reject_accept">
                        <ButtonNormal title="Reject" color="white" extra="left dialog_button" onClick={this.rejectPayment} />
                        <ButtonNormal title="Accept" color="white" extra="right dialog_button" onClick={this.acceptPayment}/>
                    </div>
                    }
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
                        })}
                    </div>
                ):(
                    <div className="connect_container">
                        <img className="clover_logo" src={'images/clover_logo.png'}/>
                        <p>Example POS</p>

                        {!showQR &&

                        <div className="column_plain center">
                            <h3>Enter the URI of your device</h3>
                            <p> This can be found in the Network Pay Display app</p>
                            <div className="connect_box">
                                <input className="input_field" type="text" id="uri" value={this.state.uriText} onChange={this.handleChange}/>
                                <ButtonNormal color="white" title="Connect" extra="connect_button" onClick={this.connect}/>
                            </div>
                            <div className="row_padding">or</div>
                            <div className="qr_button">
                                <ButtonNormal color="white"  extra="connect_button margin_right" title="Connect with QR" onClick={this.QRClicked}/>
                                <span className="qr_tooltip">This can be found by running your finger up and down four times on the screen while in Network Pay Display and then pressing the QR code to print</span>
                            </div>
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