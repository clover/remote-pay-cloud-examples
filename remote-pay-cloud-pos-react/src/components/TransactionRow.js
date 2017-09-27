import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";
import ImageHelper from "../utils/ImageHelper";

export default class TransactionRow extends React.Component {

    constructor(props) {
        super(props);
        this.transaction = this.props.transaction;
        console.log('transaction', this.transaction);
        this.imageHelper = new ImageHelper();
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const date = this.transaction.date.toLocaleDateString();
        const time = this.transaction.date.toLocaleTimeString();
        const paymentId = this.transaction.id;
        let total = this.transaction.getAmount();
        let displayTotal = "$" +total;
        const tender = this.transaction.tender;
        const cardDetails = this.transaction.cardDetails;
        const employee = this.transaction.employee;
        const onClick = this.props.onClick;
        let paymentType = this.transaction.transactionTitle;
        if (paymentType === 'Refund' || paymentType === 'Manual Refund'){
            displayTotal=(<span className="red_text">(${total})</span>);
        }
        let image = this.imageHelper.getCardTypeImage(this.transaction.cardType);

        return (
            <div className="transaction_row" onClick={() => {onClick(this.transaction)}}>
                <div className="transaction_row_column">
                    <div><strong>{time}</strong></div>
                    <div>{date}</div>
                </div>
                <div className="transaction_row_column">
                    <div>{paymentType}</div>
                    <div>{paymentId}</div>
                </div>
                <div className="transaction_row_column">
                    <div> {displayTotal}</div>
                </div>
                <div className="transaction_tender">
                    <img className="tender_logo" src={image}/>
                    <div className="transaction_tender_column">
                        <div>{tender}</div>
                        <div>{cardDetails}</div>
                    </div>
                </div>
                <div className="transaction_row_column last_item">
                    <div>
                        {employee}
                    </div>
                </div>
            </div>
        )
    }
}
