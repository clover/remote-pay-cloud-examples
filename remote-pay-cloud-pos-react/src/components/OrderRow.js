import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";

export default class OrderRow extends React.Component {

    constructor(props) {
        super(props);
        this.order = this.props.order;
        //console.log("orderRow", this.order);
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const orderId = this.order.id;
        const orderStatus = this.order.status;
        const orderDate = this.order.date;
        // const totalWTax = this.formatter.formatCurrency(this.order.getTotalwithTax());
        // const total = this.formatter.formatCurrency(this.order.getTotal());
        // const tax = this.formatter.formatCurrency(this.order.getTax());
        const totalWTax = this.order.getTotal();
        const total = parseFloat(this.order.getPreTaxSubTotal()).toFixed(2)
        const tax = parseFloat(this.order.getTaxAmount()).toFixed(2)
        const onClick = this.props.onClick;
        let tender = '';
        let employee = '';
        if(this.order.orderPayments.length > 0) {
            tender = this.order.orderPayments[0].tender;
            employee = this.order.orderPayments[0].employee;
        }
        let statusColor = "yellow_text";
        if(orderStatus == "PAID"){
            statusColor = "green_text";
        }
        else if(orderStatus == "REFUNDED" || orderStatus == "MANUALLY REFUNDED"){
            statusColor = "red_text";
        }

        return (
            <div className="order_row" onClick={() => {onClick(orderId)}}>
                <div className="order_row_left">
                    <div><strong>{orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></div>
                    <div className="grey_text">{orderDate.toLocaleDateString()}</div>
                </div>
                <div className="order_row_left">
                    <div><strong>${totalWTax}</strong></div>
                    <div className="grey_text">{tender}</div>
                </div>
                <div className="order_row_middle">
                   <div className={statusColor}>{orderStatus}</div>
                    <div className="grey_text">{employee}</div>
                </div>
                <div className="order_row_right">
                    <div>
                        {orderId}
                    </div>
                </div>
            </div>
            //<div className="order_row" onClick={() => {onClick(orderId)}}>
            //    <div className="order_row_left">
            //        <div>{orderId}</div>
            //        <div>{orderStatus}</div>
            //    </div>
            //    <div className="order_row_middle">
            //        {orderDate.toLocaleDateString()}  {orderDate.toLocaleTimeString()}
            //    </div>
            //    <div className="order_row_right">
            //        <div>
            //            <div className="order_grand_total"><strong>${totalWTax}</strong></div>
            //            <div>Subtotal:  ${total}</div>
            //            <div>Tax:   ${tax}</div>
            //        </div>
            //    </div>
            //</div>
        )
    }
}
