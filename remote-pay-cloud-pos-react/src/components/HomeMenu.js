import { browserHistory, Link } from 'react-router';
import ButtonNormal from './ButtonNormal';
import clover from 'remote-pay-cloud';
import CurrencyFormatter from './../utils/CurrencyFormatter';
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
                    </div>
                </Link>
                <div className="home_button" onClick={this.preAuth}>
                    <div className="home_title">New Tab (PreAuth)</div>
                </div>
                <Link to="/orders">
                    <div className="home_button">
                        <div className="home_title">View Orders</div>
                    </div>
                </Link>
                <Link to="/vault-card">
                    <div className="home_button">
                        <div className="home_title">Customers (Vault Card)</div>
                    </div>
                </Link>
                <Link to="/refunds">
                    <div className="home_button">
                        <div className="home_title">Manual Refunds / Credit</div>
                    </div>
                </Link>
                <Link to="/transactions">
                    <div className="home_button">
                        <div className="home_title">Transactions</div>
                    </div>
                </Link>
                <Link to="/custom-activities">
                    <div className="home_button">
                        <div className="home_title">Custom Activities</div>
                    </div>
                </Link>
                <Link to="/device">
                    <div className="home_button">
                        <div className="home_title">Device</div>
                    </div>
                </Link>
                <Link to="/recovery-options">
                    <div className="home_button">
                        <div className="home_title">Recovery Options</div>
                    </div>
                </Link>
            </div>
        );
    }
}