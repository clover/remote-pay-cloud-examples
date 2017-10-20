import CurrencyFormatter from './../utils/CurrencyFormatter';
import PropTypes from 'prop-types';
import React from 'react';

export default class AvailableItem extends React.Component {

    constructor(props) {
        super(props);
        this.formatter = new CurrencyFormatter();
        this.item = this.props.item;
    }

    render(){
        const id =this.item.id;
        const title = this.item.title;
        const itemPrice = this.formatter.formatCurrency(this.item.itemPrice);
        const tippable = this.item.tippable;
        const taxable = this.item.taxable;
        const onClick = this.props.onClick;
        return (
           <div className="available_item" onClick={() => {onClick(id, title, this.item.itemPrice, tippable, taxable)}}>
               <div className="item_title"><span>{title}</span></div>
               <div className="item_price">{itemPrice}</div>
           </div>
        )
    }
}

