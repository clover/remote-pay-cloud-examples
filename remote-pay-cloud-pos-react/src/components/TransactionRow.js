import Checkmark from './Checkmark';
import ImageHelper from "../utils/ImageHelper";
import React from 'react';

export default class TransactionRow extends React.Component {

    constructor(props) {
        super(props);
        this.imageHelper = new ImageHelper();
        this.transaction = this.props.transaction;
        console.log('Transaction Row', this.transaction);
    }

    render(){
        const cardDetails = this.transaction.cardDetails;
        let checkmark = this.transaction.result;
        const date = this.transaction.date.toLocaleDateString([], {month: 'short', day: 'numeric', year: 'numeric'});
        const employee = this.transaction.employee;
        let image = this.imageHelper.getCardTypeImage(this.transaction.cardType);
        const _onClick = this.props.onClick;
        const paymentId = this.transaction.id;
        const tender = this.transaction.tender;
        const time = this.transaction.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        let total = this.transaction.getAmount();
        let displayTotal = '$' +total;

        let paymentType = this.transaction.transactionTitle;
        if (this.transaction.refund || paymentType === 'Manual Refund'){
            paymentType = 'Refund';
            displayTotal=(<span className="red_text">(${total})</span>);
        }
        if(this.transaction.transactionType == 'VOIDED'){
            paymentType = 'Voided';
            displayTotal=(<span className="red_text">(${total})</span>);
        }

        return (
            <div className="transaction_row" onClick={() => {_onClick(this.transaction)}}>
                <div className="transaction_row_column">
                    <div><strong>{time}</strong></div>
                    <div className="grey_text">{date}</div>
                </div>
                <div className="checkmark_row">
                    {checkmark && <Checkmark/>}
                    <div className="column_plain">
                        <div><strong>{paymentType}</strong></div>
                        <div className="grey_text">{paymentId}</div>
                    </div>
                </div>
                <div className="transaction_row_column">
                    <div><strong>{displayTotal}</strong></div>
                </div>
                <div className="transaction_tender">
                    <img className="tender_logo" src={image}/>
                    <div className="transaction_tender_column">
                        <div><strong>{tender}</strong></div>
                        <div className="grey_text">{cardDetails}</div>
                    </div>
                </div>
                <div className="transaction_row_column last_item">
                    <div><strong>{employee}</strong></div>
                </div>
            </div>
        )
    }
}
