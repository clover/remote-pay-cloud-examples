import { browserHistory } from 'react-router';
import ButtonNormal from './ButtonNormal';
import clover from 'remote-pay-cloud';
import CurrencyFormatter from './../utils/CurrencyFormatter';
import React from 'react';
import Refund from '../models/Refund';
import RefundRow from './RefundRow';
import sdk from 'remote-pay-cloud-api';
import TitleBar from './TitleBar';
import TransactionRow from './TransactionRow';

export default class Refunds extends React.Component {

    constructor(props){
        super(props);
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.formatter = new CurrencyFormatter;
        this.store = this.props.store;
        this.state = {
            refundAmount: 0.00,
            refunds : this.store.getRefunds()
        };

        this.goToRefund = this.goToRefund.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.makeRefund = this.makeRefund.bind(this);
    }

    handleChange(e){    // handles refund amount change
        this.setState({ refundAmount: parseFloat(e.target.value).toFixed(2)});
    }

    makeRefund(refund){       // makes manual refund
        let externalPaymentID = clover.CloverID.getNewId();
        document.getElementById('refund_input').value = '0.00';

        let request = new sdk.remotepay.ManualRefundRequest();
        request.setExternalId(externalPaymentID);
        request.setAmount(this.formatter.convertFromFloat(this.state.refundAmount));
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        this.cloverConnector.manualRefund(request);
    }

    goToRefund(refund){
            browserHistory.push({pathname: '/payment', state: {type: 'refund', refund: refund.id}});
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
                    return <TransactionRow key={"refund-" + i} transaction={refund} onClick={this.goToRefund}/>
                }, this)}
            </div>
        );
    }
}