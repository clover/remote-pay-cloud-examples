import React from 'react';
import PaymentRow from "./PaymentRow";
import ButtonNormal from "./ButtonNormal";
import Refund from "../models/Refund";
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import Checkmark from './Checkmark';
import sdk from 'remote-pay-cloud-api';
import clover from 'remote-pay-cloud';

export default class Payment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showTipAdjust: false,
            showRefund: false,
            tipAmount: 0.00,
            refundDisabled: false
        }
        this.adjustTip = this.adjustTip.bind(this);
        this.finishAdjustTip = this.finishAdjustTip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.makeRefund = this.makeRefund.bind(this);
        this.voidPayment = this.voidPayment.bind(this);
        this.store = this.props.store;
        if(this.props.location.state != null) {
            this.type = this.props.location.state.type;
            if(this.type === 'payment'){
                this.paymentId = this.props.location.state.id;
                this.payment = this.store.getPaymentByCloverId(this.paymentId);
            }
            else if(this.type === 'refund'){
                this.refundId = this.props.location.state.refund;
            }

        }
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.formatter = new CurrencyFormatter();
    }

    adjustTip(){
        this.setState({showTipAdjust : true});
    }

    finishAdjustTip(){
        this.setState({showTipAdjust: false});
        let tempTip = parseFloat(this.state.tipAmount).toFixed(2);
        this.payment.setTipAmount(tempTip);
    }

    handleChange (e) {
        this.setState({ tipAmount: e.target.value });
    }

    makeRefund(){
        console.log(this.payment);
        let refund = new sdk.remotepay.RefundPaymentRequest();
        refund.setAmount(this.payment.amount);
        refund.setPaymentId(this.payment.cloverPaymentId);
        refund.setOrderId(this.payment.cloverOrderId);
        refund.setFullRefund(true);
        console.log(refund);
        this.cloverConnector.refundPayment(refund);
    }

    voidPayment(){
     let vpr = new sdk.remotepay.VoidPaymentRequest();
        vpr.setPaymentId(this.payment.cloverPaymentId);
        vpr.setOrderId(this.payment.cloverOrderId);
        vpr.setVoidReason(sdk.order.VoidReason.USER_CANCEL);
        this.cloverConnector.voidPayment(vpr);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.refundSuccess){
            this.payment = this.store.getPaymentByCloverId(this.payment.cloverPaymentId);
            this.setState({ showRefund: true, refundDisabled: true});
        }
    }

    componentDidMount(){
            if(this.payment.refunds !== undefined){
                this.setState({showRefund: true, refundDisabled: true});
            }
    }

    render(){
        const date = this.payment.date;
        const total = this.formatter.formatCurrency(this.payment.amount);
        const tender = this.payment.tender;
        const cardDetails = this.payment.cardDetails;
        const employee = this.payment.employee;
        const deviceId = this.payment.deviceId;
        const paymentId = this.payment.id;
        const entryMethod = this.payment.entryMethod;
        const transactionType = this.payment.transactionType;
        const transactionState = this.payment.transactionState;
        // let cashBack = this.payment.cashBackAmount;
        // if(cashBack === 0) {
        //     cashBack = "$0.00";
        // }
        let showTips = true;
        let showTipButton = true;
        if(this.payment.transactionTitle === "Payment"){
            showTipButton = false;
        }
        let tipText = "Adjust Tip";
        let tipAmount = parseFloat(this.formatter.convertToFloat(this.payment.getTipAmount())).toFixed(2);
        if(tipAmount ===0 || tipAmount <= 0){
            showTips = false;
            tipAmount = "0.00";
            tipText = "Add Tip";
        }
        const showRefunds = this.state.showRefund;
        let showTipAdj = this.state.showTipAdjust;
        let absTotal = parseFloat(parseFloat(this.formatter.convertToFloat(this.payment.amount)) + parseFloat(this.formatter.convertToFloat(this.payment.getTipAmount()))).toFixed(2);
        if(this.state.showRefund){
            absTotal = "$0.00";
        }
        let check = false;
        let status = this.payment.status;
        if(status === "SUCCESS"){
            check = true;
        }

        return(
            <div className="payments">
                <h2>Payment Details</h2>
                <div className="payments_container">
                    <div className="payments_all_details">
                        <div className="payments_list">
                            <div className="paymentDetails">
                                <div className="space_between_row space_under">
                                    <div><strong>Payment</strong></div>
                                    <div className="middle_grow"><strong>{date.toLocaleDateString()}  •  {date.toLocaleTimeString()}</strong></div>
                                    <div><strong>{total}</strong></div>
                                </div>
                                {check && <div className="row"><Checkmark/><div className="payment_successful">Payment successful</div></div>}
                                <div className="payment_details_list">
                                    <PaymentRow left="Tender:" right={tender}/>
                                    <PaymentRow left="Card Details:" right={cardDetails}/>
                                    <PaymentRow left="Employee:" right={employee}/>
                                    <PaymentRow left="Device ID:" right={deviceId}/>
                                    <PaymentRow left="Payment ID:" right={paymentId}/>
                                    <PaymentRow left="Entry Method:" right={entryMethod}/>
                                    <PaymentRow left="Transaction Type:" right={transactionType}/>
                                    <PaymentRow left="Transaction State:" right={transactionState}/>
                                    {/*<PaymentRow left="Cashback:" right={cashBack}/>*/}
                                </div>
                            </div>
                            {showTips &&
                            <div className="payment_section">
                                <div className="space_between_row space_under">
                                    <div><strong>Tip</strong></div>
                                    <div><strong>${tipAmount}</strong></div>
                                </div>
                            </div>}
                            {showRefunds &&
                            <div className="payment_section">
                                {this.payment.refunds.map(function (refund, i) {
                                    return(
                                        <div key={'refund-'+i} className="space_between_row space_under">
                                            <div><strong>Refund</strong></div>
                                            <div className="middle_grow"/>
                                            <div><strong>{this.formatter.formatCurrency(refund.amount)}</strong></div>
                                        </div>)
                                }, this)}
                            </div>
                            }
                            <div className="payment_section">
                                <div className="space_between_row space_under">
                                    <div><strong>Total</strong></div>
                                    <div><strong>${absTotal}</strong></div>
                                </div>
                            </div>
                            {showTipAdj && <div className="popup_container popup">
                                <h4>Adjust Tip Amount:</h4>
                                <div className="tip_adjust_input">
                                    <span className="dollar_span">$</span>
                                    <input id="adjustTip" type="number" min="0.01" step="0.01" defaultValue={tipAmount} onChange={this.handleChange}/>
                                </div>
                                <ButtonNormal title="Save" color="white" onClick={this.finishAdjustTip}/>

                            </div>}
                        </div>
                    </div>
                    <div className="column">
                        <ButtonNormal title="Refund" color="red" extra="add_tip" onClick={this.makeRefund} disabled={this.state.refundDisabled}/>
                        <ButtonNormal title="Void Payment" color="white" extra="add_tip" onClick={this.voidPayment} disabled={this.state.refundDisabled}/>
                        {showTipButton && <ButtonNormal title={tipText} color="white" extra="add_tip" onClick={this.adjustTip} disabled={this.state.refundDisabled}/>}
                    </div>
                </div>
            </div>
        );
    }
}