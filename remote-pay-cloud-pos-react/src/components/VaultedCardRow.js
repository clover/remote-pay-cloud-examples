import CardDataHelper from "./../utils/CardDataHelper";
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import React from 'react';

export default class VaultedCardRow extends React.Component {

    constructor(props) {
        super(props);
        this.card = this.props.card;
        this.cdh = new CardDataHelper();
        this.formatter = new CurrencyFormatter();
    }

    render(){
        let card = this.card.card;
        const onClick = this.props.onClick;

        return (
            <div className="vaulted_card_row" onClick={() => {onClick(this.card)}}>
                <div className="vaulted_card_name">{this.card.name}</div>
                <div className="vaulted_card_info">
                    <div>{card.first6}xxxxxx{card.last4}</div>
                    <div>Exp: {this.cdh.getExpirationDate(card.expirationDate)}</div>
                </div>
            </div>
        )
    }
}
