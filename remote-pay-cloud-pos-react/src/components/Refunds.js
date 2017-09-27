import React from 'react';
import ButtonNormal from "./ButtonNormal";
import Refund from "../models/Refund";
import TitleBar from "./TitleBar";
import RefundRow from "./RefundRow";
import TransactionRow from "./TransactionRow";
import sdk from 'remote-pay-cloud-api';
import clover from 'remote-pay-cloud';
import CurrencyFormatter from "./../utils/CurrencyFormatter";

export default class Refunds extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.makeRefund = this.makeRefund.bind(this);
        this.store = this.props.store;
        this.state = {
            refundAmount: 0.00,
            refunds : this.store.getRefunds(),
        };
        this.formatter = new CurrencyFormatter;
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        console.log(this.state.refunds);
    }

    handleChange(e){
        this.setState({ refundAmount: parseFloat(e.target.value).toFixed(2)});
    }

    makeRefund(){
        let externalPaymentID = clover.CloverID.getNewId();
        //let refund = new Refund(this.state.refundAmount);
        //this.store.addRefund(refund);
        //this.setState({refunds : this.store.getRefunds()});
        document.getElementById("refund_input").value = "0.00";
        let request = new sdk.remotepay.ManualRefundRequest();
        request.setExternalId(externalPaymentID);
        request.setAmount(this.formatter.convertFromFloat(this.state.refundAmount));
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        this.cloverConnector.manualRefund(request);
    }

    render(){
        let refunds = this.store.getRefunds();
        return(
            <div className="refunds">
                <div className="make_refund">
                    <div>Enter the Refund Amount:</div>
                    <div>
                        <span className="dollar_span_refund">$</span>
                        <input id="refund_input" className="refund_input" type="text" defaultValue="0.00" onChange={this.handleChange}/>
                    </div>
                    <ButtonNormal extra="refund_button" title="Make Refund" color="white" onClick={this.makeRefund} />
                </div>
                <TitleBar title="Refunds"/>
                {refunds.map(function (refund, i) {
                    return <TransactionRow key={'refund-'+i} transaction={refund}/>
                }, this)}
            </div>
        );
    }
}