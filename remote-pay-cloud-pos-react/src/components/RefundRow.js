import React from 'react';

export default class RefundRow extends React.Component {

    constructor(props) {
        super(props);
        this.refund = this.props.refund;
    }

    render(){
        const amount = parseFloat(this.refund.amount).toFixed(2);
        const date = this.refund.date;

        return (
            <div className="refund_row" >
                <div>{date.toLocaleDateString()} {date.toLocaleTimeString()}</div>
                <div><strong>${amount}</strong></div>
            </div>
        )
    }
}
