import React from 'react';
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import ImageHelper from "./../utils/ImageHelper";
import Checkmark from './Checkmark';

export default class OrderPaymentRow extends React.Component {

    constructor(props) {
        super(props);
        this.orderPayment = this.props.orderPayment;
        this.order = this.props.order;
        console.log("orderpayment" , this.props);
        this.formatter = new CurrencyFormatter();
        this.imageHelper = new ImageHelper();
    }

    render(){
        const status = this.orderPayment.status;
        let check = false;
        if(status === "SUCCESS"){
            check = true;
        }
        const date = this.orderPayment.date;
        //const id = this.orderPayment.id;
        const total = this.formatter.formatCurrency(this.orderPayment.amount);
        //let tip = this.formatter.formatCurrency(this.orderPayment.tipAmount);
        const onClick = this.props.onClick;
        let image = this.imageHelper.getCardTypeImage(this.orderPayment.cardType);
        const tender = this.orderPayment.tender;
        const cardDetails = this.orderPayment.cardDetails;
        return (
            <div className="order_item_row" onClick={() => {onClick(this.orderPayment)}}>
                {check && <Checkmark/> }
                <div className="order_row_left">
                    <div><strong>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></div>
                    <div>{date.toLocaleDateString()}</div>
                </div>
                <div className="transaction_tender">
                    <img className="tender_logo" src={image}/>
                    <div className="transaction_tender_column">
                        <div>{tender}</div>
                        <div>{cardDetails}</div>
                    </div>
                </div>
                <div className="order_row_right">
                    <div><strong>{total}</strong></div>
                    <div>PAYMENT</div>
                </div>
            </div>
            //<div className="order_item_row" onClick={() => {onClick(this.orderPayment)}}>
            //    <Checkmark/>
            //    <div className="order_row_left">
            //        <div>{status}</div>
            //        <div>{id}</div>
            //    </div>
            //    <div className="order_row_right">
            //        <div><strong>{total}</strong></div>
            //        <div>Tip:   {tip}</div>
            //    </div>
            //</div>
        )
    }
}
