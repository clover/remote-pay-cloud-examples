import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";
import VaultedCardRow from './VaultedCardRow';
import { browserHistory, Link } from 'react-router';

export default class VaultCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPrompt : false,
            customerName : '',
            vaultedCards : [],
        };
        this.store = this.props.store;
        this.fadeBackground = this.props.fadeBackground;
        this.unfadeBackground = this.props.unfadeBackground;
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.vaultCard = this.vaultCard.bind(this);
        this.openOrder = this.openOrder.bind(this);
        this.promptForName = this.promptForName.bind(this);
        this.handleCustomerName = this.handleCustomerName.bind(this);
        this.showOptions = this.showOptions.bind(this);
    }

    init(){
        this.setState({vaultedCards: this.store.getVaultedCards()});
    }

    promptForName(){
        this.fadeBackground();
        this.setState({showPrompt: true, customerName: ''});
    }

    vaultCard(){
        this.unfadeBackground();
        this.setState({showPrompt: false});
        this.cloverConnector.vaultCard(this.store.cardEntryMethods);
    }

    openOrder(vaultedCard){
        browserHistory.push({pathname: '/register', state : {saleType : 'Vaulted', card: vaultedCard}});
    }

    handleCustomerName(e){
        this.setState({customerName : e.target.value})
    }

    showOptions(vaultedCard){
        //console.log('this will show vaulted card options');
        this.openOrder(vaultedCard);
    }

    componentWillReceiveProps(newProps) {
        if(newProps.vaultedCard === true){
            let lastVaulted = this.store.getLastVaultedCard();
            lastVaulted.setName(this.state.customerName);
            this.setState({vaultedCards: this.store.getVaultedCards()});
        }
    }

    componentDidMount(){
        this.init();
    }

    render() {
        let cards = this.state.vaultedCards;
        return (
            <div className="column">
                {this.state.showPrompt &&
                <div className="popup popup_container">
                    <div className="cards_title">Enter Customer Name to be Associated with Card:</div>
                    <div className="row">
                        <input className="cards_input" type="text" value={this.state.customerName}  onChange={this.handleCustomerName} />
                        <ButtonNormal color="white" title="Save" extra="cards_save_button" onClick={this.vaultCard} />
                    </div>
                </div>
                }
                <div className="card_list">
                    <TitleBar title="Vaulted Cards Associated w/ Customers"/>
                    {cards.map((card, i) => {
                        return <VaultedCardRow key={'card-'+i} card={card} onClick={this.showOptions}/>;
                    })}
                </div>
                <div className="cards_footer">
                    <div className="filler_space"/>
                    <ButtonNormal title="Vault New Card" color="white" extra="cards_button" onClick={this.promptForName}/>
                </div>
            </div>
        );
    }
}