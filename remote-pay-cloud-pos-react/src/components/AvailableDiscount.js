import CurrencyFormatter from './../utils/CurrencyFormatter';
import PropTypes from 'prop-types';
import React from 'react';

export default class AvailableDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.discount = this.props.discount;
        this.formatter = new CurrencyFormatter();
    }

    render(){
        const name = this.discount.name;
        const onClick = this.props.onClick;

        return (
            <div className="available_item" onClick={() => {onClick(this.discount)}}>
                <div className="item_title"><span>{name}</span></div>
                <div className="discount_bottom"></div>
            </div>
        )
    }
}