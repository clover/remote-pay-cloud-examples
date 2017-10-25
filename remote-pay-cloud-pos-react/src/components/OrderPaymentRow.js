import Checkmark from './Checkmark';
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import ImageHelper from "./../utils/ImageHelper";
import React from 'react';

export default class OrderPaymentRow extends React.Component {

    constructor(props) {
        super(props);
        this.formatter = new CurrencyFormatter();
        this.imageHelper = new ImageHelper();
        this.order = this.props.order;
        this.orderPayment = this.props.orderPayment;
    }

    render(){
        const cardDetails = this.orderPayment.cardDetails;
        let check = (this.orderPayment.status === 'SUCCESS');
        const date = this.orderPayment.date;
        let image = this.imageHelper.getCardTypeImage(this.orderPayment.cardType);
        const onClick = this.props.onClick;
        const tender = this.orderPayment.tender;
        const total = this.formatter.formatCurrency(this.orderPayment.amount);
        const transactionType = this.orderPayment.transactionType.toUpperCase();

        return (
            <div className="order_item_row" onClick={() => {onClick(this.orderPayment)}}>
                <div className="row">
                    {check && <Checkmark/> }
                    <div className="column_plain">
                        <div><strong>{date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</strong></div>
                        <div className="grey_text">{date.toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="transaction_tender">
                    <img className="tender_logo" src={image}/>
                    <div className="transaction_tender_column">
                        <div><strong>{tender}</strong></div>
                        <div className="grey_text">{cardDetails}</div>
                    </div>
                </div>
                <div className="order_row_right">
                    <div><strong>{total}</strong></div>
                    <div className="grey_text">{transactionType}</div>
                </div>
            </div>
        )
    }
}
