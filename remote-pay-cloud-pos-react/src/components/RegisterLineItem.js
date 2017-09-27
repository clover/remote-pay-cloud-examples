import React from 'react';

export default class RegisterLineItem extends React.Component {

    render(){
        const quantity = this.props.quantity;
        const title = this.props.title;
        const price = this.props.price;



        return (
            <div className="space_between_row">
                <div>{quantity}</div>
                <div className="register_item_title">{title}</div>
                <div>{price}</div>
            </div>
        )
    }
}
