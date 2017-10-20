import React from 'react';

export default class PaymentRow extends React.Component {

    render(){
        const left = this.props.left;
        const right = this.props.right;

        return (
            <div className="payment_row">
                <div className="payment_row_left">{left}</div>
                <div className="payment_row_right">{right}</div>
            </div>
        )
    }
}
