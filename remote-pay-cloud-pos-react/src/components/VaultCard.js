import { browserHistory, Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import React from 'react';
import TitleBar from "./TitleBar";
import VaultedCardRow from './VaultedCardRow';

export default class VaultCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customerName : '',
            showPrompt : false,
            vaultedCards : []
        };
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.fadeBackground = this.props.fadeBackground;
        this.store = this.props.store;
        this.unfadeBackground = this.props.unfadeBackground;

        this.handleCustomerName = this.handleCustomerName.bind(this);
        this.openOrder = this.openOrder.bind(this);
        this.promptForName = this.promptForName.bind(this);
        this.vaultCard = this.vaultCard.bind(this);
    }

    init(){     // populate with existing vaulted cards
        this.setState({vaultedCards: this.store.getVaultedCards()});
    }

    promptForName(){       // prompt user for name to be associated with card
        this.fadeBackground();
        this.setState({showPrompt: true, customerName: ''});
    }

    vaultCard(){        // vault card on Clover device
        this.unfadeBackground();
        this.setState({showPrompt: false});
        this.cloverConnector.vaultCard(this.store.cardEntryMethods);
    }

    openOrder(vaultedCard){         // go to register and pass through vaulted card
        browserHistory.push({pathname: '/register', state : {saleType : 'Vaulted', card: vaultedCard}});
    }

    handleCustomerName(e){      // handle customer name change
        this.setState({customerName : e.target.value})
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
                    <div className="row_padding">
                        <div className="cards_title">Enter Customer Name to be Associated with Card:</div>
                        <div className="row">
                            <input className="cards_input" type="text" value={this.state.customerName}  onChange={this.handleCustomerName} />
                            <ButtonNormal color="white" title="Save" extra="cards_save_button" onClick={this.vaultCard} />
                        </div>
                    </div>
                </div>
                }
                <div className="card_list">
                    <TitleBar title="Vaulted Cards Associated w/ Customers"/>
                    {cards.map((card, i) => {
                        return <VaultedCardRow key={'card-'+i} card={card} onClick={this.openOrder}/>;
                    })}
                </div>
                <div className="cards_footer">
                    <div className="filler_space"></div>
                    <ButtonNormal title="Vault New Card" color="white" extra="cards_button" onClick={this.promptForName}/>
                </div>
            </div>
        );
    }
}