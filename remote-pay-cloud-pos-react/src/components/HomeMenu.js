import { browserHistory, Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import clover from 'remote-pay-cloud';
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import React from 'react';
import sdk from 'remote-pay-cloud-api';

export default class HomeMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect : false
        };

        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.formatter = new CurrencyFormatter;
        this.setStatus = this.props.setStatus;
        this.store = this.props.store;

        this.preAuth = this.preAuth.bind(this);

        this.cloverConnector.showWelcomeScreen();
    }

    preAuth(){      // opens register page and tells register the sale type is a pre auth
        browserHistory.push({pathname: '/register', state : {saleType : 'PreAuth'}});
    }

    render(){

        return(
            <div className="home_menu">
                <Link to="/register">
                    <div className="home_button">
                        <div className="home_title">New Order</div>
                        <img className="home_icon" src={"images/new_order.png"}/>
                    </div>
                </Link>
                <div className="home_button">
                    <div className="home_title">New Tab (PreAuth)</div>
                    <img className="home_icon" src={"images/new_tab.png"}  onClick={this.preAuth}/>
                </div>
                <Link to="/orders">
                    <div className="home_button">
                        <div className="home_title">View Orders</div>
                        <img className="home_icon" src={"images/orders.png"}/>
                    </div>
                </Link>
                <Link to="/vault-card">
                    <div className="home_button">
                        <div className="home_title">Customers (Vault Card)</div>
                        <img className="home_icon" src={"images/card.png"}/>
                    </div>
                </Link>
                <Link to="/refunds">
                    <div className="home_button">
                        <div className="home_title">Manual Refunds / Credit</div>
                        <img className="home_icon" src={"images/refund.png"}/>
                    </div>
                </Link>
                <Link to="/transactions">
                    <div className="home_button">
                        <div className="home_title">Transactions</div>
                        <img className="home_icon" src={"images/transactions.png"}/>
                    </div>
                </Link>
                <Link to="/custom-activities">
                    <div className="home_button">
                        <div className="home_title">Custom Activities</div>
                        <img className="home_icon" src={"images/custom_activity.png"}/>
                    </div>
                </Link>
                <Link to="/device">
                    <div className="home_button">
                        <div className="home_title">Device</div>
                        <img className="home_icon" src={"images/device.png"}/>
                    </div>
                </Link>
                <Link to="/recovery-options">
                    <div className="home_button">
                        <div className="home_title">Recovery Options</div>
                        <img className="home_icon" src={"images/recovery.png"}/>
                    </div>
                </Link>
            </div>
        );
    }
}