import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Register from './components/Register';
import Refunds from './components/Refunds';
import Transactions from './components/Transactions';
import HomeMenu from './components/HomeMenu';
import Orders from './components/Orders';
import VaultCard from './components/VaultCard';
import CustomActivities from './components/CustomActivities';
import Payment from './components/Payment';
import Device from './components/Device';
import RecoveryOptions from './components/RecoveryOptions';
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import NotFoundPage from './components/NotFoundPage';
import PreAuth from './components/PreAuth';

const routes = (
    <Route path="/" component={Layout}>
            <IndexRoute component={IndexPage}/>
            <Route path='register' component={Register}/>
            <Route path='refunds' component={Refunds}/>
            <Route path='home-menu' component={HomeMenu}/>
            <Route path='preauth' component={PreAuth}/>
            <Route path='transactions' component={Transactions}/>
            <Route path='payment' component={Payment}/>
            <Route path='orders' component={Orders}/>
            <Route path='vault-card' component={VaultCard}/>
            <Route path='custom-activities' component={CustomActivities}/>
            <Route path='device' component={Device}/>
            <Route path='recovery-options' component={RecoveryOptions}/>
            <Route path='*' component={NotFoundPage}/>
    </Route>
);

export default routes;