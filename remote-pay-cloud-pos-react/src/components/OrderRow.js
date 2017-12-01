import React from 'react';

export default class OrderRow extends React.Component {

    constructor(props) {
        super(props);
        this.order = this.props.order;
    }

    render(){
        const onClick = this.props.onClick;
        const orderDate = this.order.date;
        const orderId = this.order.id;
        const orderStatus = this.order.status;
        const totalWTax = this.order.getTotal();

        let employee = '';
        let tender = '';
        if(this.order.orderPayments.length > 0) {
            tender = this.order.orderPayments[0].tender;
            employee = this.order.orderPayments[0].employee;
        }

        let statusColor = 'yellow_text';
        if(orderStatus == 'PAID'){
            statusColor = 'green_text';
        }
        else if(orderStatus == 'REFUNDED' || orderStatus == 'MANUALLY REFUNDED'){
            statusColor = 'red_text';
        }

        return (
            <div className="order_row" onClick={() => {onClick(orderId)}}>
                <div className="order_row_left">
                    <div><strong>{orderDate.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</strong></div>
                    <div className="grey_text">{orderDate.toLocaleDateString()}</div>
                </div>
                <div className="order_row_left">
                    <div><strong>${totalWTax}</strong></div>
                    <div className="grey_text">{tender}</div>
                </div>
                <div className="order_row_middle">
                   <div className={statusColor}><strong>{orderStatus}</strong></div>
                    <div className="grey_text">{employee}</div>
                </div>
                <div className="order_row_right">
                    <div>
                        {orderId}
                    </div>
                </div>
            </div>
        )
    }
}
