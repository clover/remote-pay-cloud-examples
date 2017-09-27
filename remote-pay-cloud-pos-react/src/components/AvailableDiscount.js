import React from 'react';
import PropTypes from 'prop-types';
import CurrencyFormatter from "./../utils/CurrencyFormatter";

export default class AvailableDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.formatter = new CurrencyFormatter();
        this.discount = this.props.discount;
    }

    render(){
        const name = this.discount.name;
        const amount = this.discount.amountOff;
        const percent = this.discount.percentageOff;
        const onClick = this.props.onClick;
        let value = amount;
        if(amount == 0){
            value = percent;
        }

        return (
            <div className="available_item" onClick={() => {onClick(this.discount)}}>
                <div className="item_title"><span>{name}</span></div>
                <div className="discount_bottom"/>
            </div>
        )
    }
}