import React from 'react';

export default class RegisterLineItem extends React.Component {

    render(){
        const price = this.props.price;
        const quantity = this.props.quantity;
        const title = this.props.title;

        return (
            <div className="space_between_row">
                <div>{quantity}</div>
                <div className="register_item_title">{title}</div>
                <div>{price}</div>
            </div>
        )
    }
}
