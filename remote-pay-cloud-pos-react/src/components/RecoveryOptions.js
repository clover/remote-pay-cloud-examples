import React from 'react';
import ButtonNormal from "./ButtonNormal";
import sdk from 'remote-pay-cloud-api';

export default class RecoveryOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPaymentPopup : false,
            keepPaymentPopupOpen: false,
            showReset : false,
            queryPaymentText: 'JANRZXDFT3JF',
        };
        this.fadeBackground = this.props.fadeBackground;
        this.unfadeBackground = this.props.unfadeBackground;
        this.addPaymentID = this.addPaymentID.bind(this);
        this.closePaymentID = this.closePaymentID.bind(this);
        this.resetClicked = this.resetClicked.bind(this);
        this.resetDevice = this.resetDevice.bind(this);
        this.dismissReset = this.dismissReset.bind(this);
        this.queryPaymentChange = this.queryPaymentChange.bind(this);
        this.queryPayment = this.queryPayment.bind(this);
        this.getDeviceStatus = this.getDeviceStatus.bind(this);
        this.getDeviceStatusResend = this.getDeviceStatusResend.bind(this);
        this.getPendingPayments = this.getPendingPayments.bind(this);
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        //console.log("Recovery Options: ", this.props);
    }

    resetDevice(){
        this.unfadeBackground();
        this.cloverConnector.resetDevice();
        this.dismissReset();
    }

    resetClicked(){
        this.fadeBackground();
        this.setState({showReset: true});
    }

    dismissReset(){
        this.unfadeBackground();
        this.setState({showReset : false});
    }

    addPaymentID(){
        this.fadeBackground();
        this.setState({ showPaymentPopup: true});
    }

    queryPaymentChange(e){
        this.setState({ queryPaymentText: e.target.value});
    }

    queryPayment(){
        this.unfadeBackground();
        let externalPaymentId = this.state.queryPaymentText;
        console.log("queryPayment", externalPaymentId);
        this.closePaymentID();
        let request = new sdk.remotepay.RetrievePaymentRequest();
        request.setExternalPaymentId(externalPaymentId);
        this.cloverConnector.retrievePayment(request);
    }

    closePaymentID(){
        this.unfadeBackground();
        this.setState({ showPaymentPopup : false});
    }

    getDeviceStatus(){
        this.cloverConnector.retrieveDeviceStatus(new sdk.remotepay.RetrieveDeviceStatusRequest(false));
    }

    getDeviceStatusResend(){
        this.cloverConnector.retrieveDeviceStatus(new sdk.remotepay.RetrieveDeviceStatusRequest(true));
    }

    getPendingPayments(){
        this.cloverConnector.retrievePendingPayments();
    }

    render(){
        let showPaymentId = this.state.showPaymentPopup;
        let reset = this.state.showReset;
        return(

            <div className="recovery_options">
                {reset &&
                <div className="reset_warning popup">
                    <p>Are you sure you want to reset the device?</p>
                    <p>Warning: You may lose any pending transaction information.</p>
                    <div className="reject_accept">
                        <ButtonNormal color="white" extra="left dialog_button" title="No" onClick={this.dismissReset} />
                        <ButtonNormal color="red" extra="right dialog_button" title="Yes" onClick={this.resetDevice} />
                    </div>
                </div>
                }
                {showPaymentId &&
                <div className="enter_payment_id popup">
                    <div className="close_popup" onClick={this.closePaymentID}>X</div>
                    <div className="payment_id_body">
                        <div className="row center row_padding">
                            <div className="input_title">Enter Payment ID:</div>
                            <input className="input_input" type="text" onChange={this.queryPaymentChange} value={this.state.queryPaymentText}/>
                        </div>
                        <div className="row center margin_top">
                            <ButtonNormal title="Lookup" extra="preauth_button" color="white" onClick={this.queryPayment} />
                        </div>
                    </div>
                </div>
                }
                <h2>Recovery Options</h2>
                <ButtonNormal title="Reset" color="white" extra="button_large" onClick={this.resetClicked}/>
                <ButtonNormal title="Payment by ID" color="white" extra="button_large" onClick={this.addPaymentID}/>
                <ButtonNormal title="Pending Payments" color="white" extra="button_large" onClick={this.getPendingPayments}/>
                <ButtonNormal title="Device Status" color="white" extra="button_large" onClick={this.getDeviceStatus}/>
                <ButtonNormal title="Device Status (w/message resend)" color="white" extra="button_large" onClick={this.getDeviceStatusResend}/>
            </div>
        );
    }
}