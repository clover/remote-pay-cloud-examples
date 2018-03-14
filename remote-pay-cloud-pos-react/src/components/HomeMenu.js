import { browserHistory, Link } from 'react-router';
import CurrencyFormatter from './../utils/CurrencyFormatter';
import React from 'react';
import RegisterIcon from './SVGs/RegisterIcon';
import NewTabIcon from './SVGs/NewTabIcon';
import OrdersIcon from './SVGs/OrdersIcon';
import CustomersIcon from './SVGs/CustomersIcon';
import RefundsIcon from './SVGs/RefundsIcon';
import TransactionsIcon from './SVGs/TransactionsIcon';
import CustomActivitiesIcon from './SVGs/CustomActivitiesIcon';
import DeviceIcon from './SVGs/DeviceIcon';
import RecoveryIcon from './SVGs/RecoveryIcon';

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
                        <div className="home_title">Register</div>
                        <RegisterIcon/>
                    </div>
                </Link>
                <div className="home_button" onClick={this.preAuth}>
                    <div className="home_title">New Tab (PreAuth)</div>
                    <NewTabIcon/>
                </div>
                <Link to="/orders">
                    <div className="home_button">
                        <div className="home_title">View Orders</div>
                        <OrdersIcon/>
                    </div>
                </Link>
                <Link to="/vault-card">
                    <div className="home_button">
                        <div className="home_title">Customers (Vault Card)</div>
                        <CustomersIcon/>
                    </div>
                </Link>
                <Link to="/refunds">
                    <div className="home_button">
                        <div className="home_title">Manual Refunds / Credit</div>
                        <RefundsIcon/>
                    </div>
                </Link>
                <Link to="/transactions">
                    <div className="home_button">
                        <div className="home_title">Transactions</div>
                        <TransactionsIcon/>
                    </div>
                </Link>
                <Link to="/custom-activities">
                    <div className="home_button">
                        <div className="home_title">Custom Activities</div>
                        <CustomActivitiesIcon/>
                    </div>
                </Link>
                <Link to="/device">
                    <div className="home_button">
                        <div className="home_title">Device</div>
                        <DeviceIcon/>
                    </div>
                </Link>
                <Link to="/recovery-options">
                    <div className="home_button">
                        <div className="home_title">Recovery Options</div>
                        <RecoveryIcon/>
                    </div>
                </Link>
            </div>
        );
    }
}