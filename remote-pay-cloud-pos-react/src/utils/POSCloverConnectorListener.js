import React from 'react';
import Refund from '../models/Refund';
import PaymentRefund from '../models/PaymentRefund';
import clover from 'remote-pay-cloud-api';
import OrderPayment from '../models/OrderPayment';
import Transaction from '../models/Transaction';
import VaultedCard from '../models/VaultedCard';
import PreAuth from '../models/PreAuth';
import CustomerInfo from '../models/CustomerInfo';
import Rating from '../messages/Rating';
import RatingsMessage from '../messages/RatingsMessage';
import ConversationResponseMessage from '../messages/ConversationResponseMessage';
import MessageToActivity from '../messages/MessageToActivity';
import CustomerInfoMessage from '../messages/CustomerInfoMessage';
import CurrencyFormatter from './CurrencyFormatter';
import CardDataHelper from './CardDataHelper';

export default class POSCloverConnectorListener extends clover.remotepay.ICloverConnectorListener{

    constructor(options) {
        super();
        Object.assign(this, options);
        this.lastDeviceEvent = null;
        this.formatter = new CurrencyFormatter;
        this.cdh = new CardDataHelper;
        this.setPaymentStatus = this.setPaymentStatus.bind(this);
        this.createOrderPayment = this.createOrderPayment.bind(this);
        this.CUSTOM_ACTIVITY_PACKAGE = 'com.clover.cfp.examples.';
    }

    //<editor-fold desc="Clover Device Events">

    /*
     *                     CLOVER DEVICE EVENTS
     *****************************************************************
     */

    //<editor-fold desc="Device Communication">
    // COMMUNICATION

    onDeviceActivityStart(deviceEvent) {     // called when a Clover device activity starts
        // console.log("onDeviceActivityStart", deviceEvent);
        this.lastDeviceEvent = deviceEvent.getEventState();
        let message = deviceEvent.getMessage();
        if(message !== undefined && this.notCustomActivity(message) && message !== null) {
            this.setStatus(deviceEvent.getMessage());
        }
        if(!this.notCustomActivity(message)){
            this.customSuccess(true);
        }
        if(deviceEvent.inputOptions.length > 0){
            this.inputOptions(deviceEvent.inputOptions);
        }
    }

    onDeviceActivityEnd(deviceEvent) {      // called when a Clover device activity ends
        // console.log("onDeviceActivityEnd", deviceEvent);
        if(deviceEvent.getEventState() !== undefined){
            this.closeStatus();
        }
    }

    onDeviceConnected(){    // called when the Clover device is connected, but not ready to communicate
        console.log('onDeviceConnected');
    }

    onDeviceDisconnected(){     // called when the Clover device is disconnected
        console.log('onDeviceDisconnected');
    }

    onDeviceError(deviceErrorEvent){    // called when a Clover device error event is encountered
        console.log('onDeviceError', deviceErrorEvent);
        //TODO
    }

    onDeviceReady(merchantInfo){ // called when the Clover device is ready to communicate
        console.log('onDeviceReady', merchantInfo);
        this.store.setStoreName(merchantInfo.merchantName);
        this.store.setDeviceId(merchantInfo.deviceInfo.serial);
        this.toggleConnection(true);
        //this.cloverConnector.retrieveDeviceStatus(new sdk.remotepay.RetrieveDeviceStatusRequest(false));
    }

    onReady(merchantInfo){
        this.onDeviceReady(merchantInfo);
    }
    //</editor-fold>

    // PRINTING

    onPrintJobStatusResponse(response){     // the response contains the print job identifier and status
        console.log('onPrintJobStatusResponse', response);
        this.setStatus(`Print Job Status: ${response.status}`, 'Toggle');
    }

    onRetrievePrintersResponse(response){       // the response contains an array of the printers being passed back
        console.log('onRetrievePrintersResponse', response);
        this.setStatus('Printers', response.printers);
    }

    // RECOVERY

    onRetrievePendingPaymentsResponse(response) {       // called in response to a retrievePendingPayments request
        console.log('onRetrievePendingPaymentsResponse', response);
        let pending = [];
        if (response.success){
            if(response.pendingPaymentEntries.length < 1){
                pending.push('There are no Pending Payments');
            }
            else{
                response.pendingPaymentEntries.forEach(function(payment){
                    let line = (`${payment.paymentId} ${this.formatter.formatCurrency(payment.amount)}`);
                    pending.push(line);
                },this);
            }
            this.setStatus({title: 'Pending Payments', data: pending});
        }
        else{
            this.setStatus('Error Retrieving Pending Payments', 'Toggle');
        }
    }

    onRetrieveDeviceStatusResponse(response){       // called in response to retrieveDeviceState request
        console.log('onRetrieveDeviceStatusResponse', response);
        let status = [];
        status.push(`Result: ${response.result}`);
        status.push(`State: ${response.state}`);
        status.push(`ExternalActivityId: ${response.data.customActivityId}`);
        status.push(`Reason: ${response.reason}`);
        this.setStatus({title: 'Device Status', data: status});
    }

    onResetDeviceResponse(response) {       // called in response to a resetDevice request
        console.log('onResetDeviceResponse', response);
        if(response.success){
            this.setStatus('Reset Device Successful', 'Toggle');
        }
        else{
            this.setStatus(`Reset Device Failed, Reason: ${response.reason}`);
        }
    }

    onRetrievePaymentResponse(response) {       // called in response to a retrievePaymentRequest
        console.log('onRetrievePaymentResponse', response);
        let paymentLines = [];
        paymentLines.push('Retrieve Payment: ' + (response.success ? 'Success!' : 'Failed!'));
        paymentLines.push(`Query Status: ${response.queryStatus}`);
        paymentLines.push(`Reason: ${response.reason}`);
        if(response.payment !== null  && response.payment !== undefined) {
            paymentLines.push('**************************************************');
            paymentLines.push('PAYMENT');
            paymentLines.push(`Result: ${response.payment.result}`);
            paymentLines.push(`    Amount: ${this.formatter.formatCurrency(response.payment.amount)}`);
            let date = new Date(response.payment.createdTime);
            paymentLines.push(`    Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
        }
        console.log(paymentLines);
        this.setStatus({title: 'Payment Details', data: paymentLines});
    };

    // CUSTOM ACTIVITIES

    onMessageFromActivity(message){     // called when a message is sent from a custom activity
        console.log('onMessageFromActivity', message);
        this.newCustomMessage(message.payload);
    }

    onCustomActivityResponse(response) {        // called when a custom activity finishes
        console.log('onCustomActivityResponse', response);
         if (response.success) {
             this.finalCustomMessage(response.payload);
         }
         else {
             if (response.result  === 'CANCEL'){
                 this.setStatus(`Custom activity: ${response.action} was canceled. Reason: ${response.reason}`, 'Toggle');
             }
             else{
                 this.setStatus(`Failure! Custom activity: ${response.action} failed.  Reason: ${response.reason}`, 'Toggle');
             }
         }
    }

    //HELPERS

    notCustomActivity(message) {        // returns if message is custom activity or not
        return !message.includes('com.');
    }

    handleJokeResponse(payload) {       // handles response of joke for custom conversation activity
        let jokeResponseMessage = new ConversationResponseMessage(payload.message);
        this.setStatus(`Received response of: ${jokeResponseMessage.message}`, 'Toggle');
    }

    handleCustomerLookup(payload) {     // handles customer lookup for the custom ratings activity
        console.log('handleCustomerLookup', payload);
        let phoneNumber = payload.phoneNumber;
        console.log(`Just received phone number ${phoneNumber} from the Ratings remote application.`, 3000);
        console.log(`Sending customer name Ron Burgundy to the Ratings remote application for phone number ${phoneNumber}`, 3000);
        let customerInfo = new CustomerInfo();
        customerInfo.customerName = 'Ron Burgundy';
        customerInfo.phoneNumber = phoneNumber;
        let customerInfoMessage = new CustomerInfoMessage(customerInfo);
        console.log(customerInfoMessage);
        let customerInfoJson = JSON.stringify(customerInfoMessage);
        console.log(customerInfoJson);
        this.sendMessageToActivity('com.clover.cfp.examples.RatingsExample', customerInfoJson);
    }

    handleRatings(payload){     // handles ratings for custom ratings activity
        console.log('handleRatings', payload);
        let ratingsMessage = new RatingsMessage(JSON.stringify(payload));
        let ratingsPayload = ratingsMessage.ratings;
        this.setStatus(ratingsPayload, 'toggle');
        //this.showRatingsDialog(ratingsPayload);
    }

    handleRequestRatings() {        // handles the request ratings for the custom ratings activity
        console.log('handleRequestRatings');
        let rating1 = new Rating();
        rating1.id = 'Quality';
        rating1.question = 'How would you rate the overall quality of your entree?';
        rating1.value = 0;
        let rating2 = new Rating();
        rating2.id = 'Server';
        rating2.question = 'How would you rate the overall performance of your server?';
        rating2.value = 0;
        let rating3 = new Rating();
        rating3.id = 'Value';
        rating3.question = 'How would you rate the overall value of your dining experience?';
        rating3.value = 0;
        let rating4 = new Rating();
        rating4.id = 'RepeatBusiness';
        rating4.question = 'How likely are you to dine at this establishment again in the near future?';
        rating4.value = 0;
        let ratings = [rating1, rating2, rating3, rating4];
        let ratingsMessage = new RatingsMessage(ratings);
        let ratingsListJson = JSON.stringify(ratingsMessage);
        this.sendMessageToActivity('com.clover.cfp.examples.RatingsExample', ratingsListJson);
    }

    sendMessageToActivity(activityId, payload) {        // sends message to device for custom activities
        let messageRequest = new MessageToActivity(activityId, payload);
        this.cloverConnector.sendMessageToActivity(messageRequest);
    }

    // OTHER

    onReadCardDataResponse(response){       // called in response to a readCardData request
        console.log('onReadCardDataResponse', response);
        if(response.success) {
            let cardData = response.cardData;
            let cardDataString = this.cdh.getCardDataArray(cardData);
            this.setStatus({title: 'Card Data', data: cardDataString});
        }
        else{
            this.setStatus(`There was an Error Reading Card Data Reason: ${response.reason}`);
        }
    }

    //</editor-fold>

    //<editor-fold desc="Transaction Responses">

    /*
     *                      TRANSACTION RESPONSES
     *****************************************************************
     */


    // PRE AUTH

    onCapturePreAuthResponse(response){     // called in response to a capture of a pre auth payment
        console.log('onCapturePreAuthResponse', response);
        if (response.success) {
            let payment = this.store.getPreAuth().payment;
            console.log('capturePreAuthResponse', payment, this.store.getCurrentOrder());
            if (payment.id = response.paymentId) {
                payment.setStatus('PREAUTH');
                payment.setAmount(response.amount);
                this.store.setPreAuth(null);
                this.store.addPaymentToCurrentOrder(payment);
                this.store.getCurrentOrder().setStatus('PAID');
                this.store.getCurrentOrder().setCloverOrderId(payment.cloverOrderId);
                this.setStatus('PreAuth Processed Successfully');
            }
            else{
                this.setStatus('PreAuth Capture: Payment received does not match any of the stored PreAuth records');
            }
        }
        else{
            this.setStatus(`PreAuth Capture Error: Payment failed with response code = ${response.result} and reason: ${response.reason}`);
        }
        this.cloverConnector.showWelcomeScreen();
    }

    onPreAuthResponse(response) {    // called in response to a pre auth request
        console.log('onPreAuthResponse', response);
        if (response.success) {
            if (this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                let _payment = response.payment;
                let cashback = _payment.cashbackAmount === null ? 0 : _payment.cashbackAmount;
                let tip = _payment.tipAmount === null ? 0 : _payment.tipAmount;
                let payment = this.createOrderPayment(_payment, 'PreAuth');
                payment.setTipAmount(tip);
                payment.setCashback(cashback);
                this.setPaymentStatus(payment, response);
                let transaction = this.createTransactionFromOrderPayment(payment, true);
                this.store.addTransaction(transaction);
                this.store.setPreAuth(new PreAuth(response, payment));
                this.store.setPreAuthPaymentId(_payment.id);
                this.setStatus('PreAuth Successful');
            }
            else {
                this.setStatus(`External Id's Do Not Match`, 'Toggle');
            }
        }
        else{
            this.setStatus(`PreAuth Failed Reason: ${response.reason}`);
        }
    }

    // AUTH

    onAuthResponse(response){   // called in response to an auth request
        console.log('onAuthResponse', response);
        if(!response.isAuth){
            console.error('Response is not an Auth!');
            console.error(response);
        }
        else{
            if (response.success) {
                if(this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                    this.cloverConnector.showWelcomeScreen();
                    let currentOrder = this.store.currentOrder;
                    let orderPayment = this.createOrderPayment(response.payment, 'Auth');
                    let transaction = this.createTransactionFromOrderPayment(orderPayment, true);
                    this.store.addTransaction(transaction);
                    currentOrder.addOrderPayment(orderPayment);
                    currentOrder.setStatus('PAID');
                    currentOrder.setCloverOrderId(response.payment.order.id);
                    this.setStatus('Auth Processed Successfully');
                }
                else{
                    this.setStatus('External Id\'s Do Not Match', 'toggle');
                }
            }
            else{
                this.setStatus(`Auth Failed Reason: ${response.reason}`);
            }
        }
    }

    // SALE

    onSaleResponse(response) {      // called in response to a sale request
        console.log('onSaleResponse', response);
        if(response !== null) {
            if (!response.isSale) {
                this.setStatus('Response was not a sale', response.reason);
                if (response.payment.offline) {
                    if (response.success) {
                        let currentOrder = this.store.currentOrder;
                        currentOrder.setCloverOrderId(response.payment.order.id);
                        let orderPayment = this.createOrderPayment(response.payment, 'Payment');
                        currentOrder.addOrderPayment(orderPayment);
                        currentOrder.setStatus('Pending');
                        let transaction = this.createTransactionFromOrderPayment(orderPayment, true);
                        this.store.addTransaction(transaction);
                        this.setStatus('Sale Processed Successfully');
                        this.cloverConnector.showWelcomeScreen();
                    }
                }
                else {
                    console.error('Response is not an sale!');
                    console.error(response);
                }
            }
            else {
                if (response.success) {
                    if (this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                        this.cloverConnector.showWelcomeScreen();
                        let currentOrder = this.store.getCurrentOrder();
                        currentOrder.setCloverOrderId(response.payment.order.id);
                        let orderPayment = this.createOrderPayment(response.payment, 'Payment');
                        currentOrder.addOrderPayment(orderPayment);
                        currentOrder.setStatus('PAID');
                        let transaction = this.createTransactionFromOrderPayment(orderPayment, true);
                        this.store.addTransaction(transaction);
                        this.setStatus('Sale Processed Successfully');
                    }
                    else {
                        this.setStatus('External Id\'s Do Not Match');
                    }
                }
                else{
                    this.setStatus(`Sale Failed Reason: ${response.reason}`);
                }
            }
        }
        else{
            console.error('Error: Null SaleResponse');
        }
    }

    // TIPS

    onTipAdjustAuthResponse(response) {      // called in response to a tip adjust of an auth payment
        console.log('onTipAdjustAuthResponse', response);
        if (response.success) {
            let payment = this.store.getPaymentByCloverId(response.paymentId);
            payment.setTipAmount(response.tipAmount);
            this.setStatus('Tip adjusted successfully', 'Toggle');
        }
        else{
            this.setStatus(`Tip adjust failed, Reason: ${response.reason}`);
        }
    }

    onTipAdded(tipAdded){       // called when a customer selects a tip amount on the Clover device screen
        console.log('onTipAdded', tipAdded);
        //TODO add success check
        if (tipAdded.tipAmount > 0) {
            this.tipAdded(tipAdded.tipAmount);
        }
        else{
            this.tipAdded(0);
        }
    }

    // REFUNDS

    onManualRefundResponse(response) {      // called in response to a manual refund request
        console.log('onManualRefundResponse', response);
        if(response.success){
            this.setStatus('Manual Refund Successful', 'Toggle');
            let refund = this.createRefund(response);
            this.store.addRefund(refund);
        }
        else {
            this.setStatus(`Manual Refund Failed, Reason: ${response.reason}`);
        }
    }

    onRefundPaymentResponse(response){      // called in response to a refund payment request
        console.log('onRefundPaymentResponse', response);
        if(response.success) {
            let refund = new PaymentRefund();
            refund.setAmount(response.refund.amount);
            refund.setOrderId(response.orderId);
            refund.setPaymentId(response.paymentId);
            refund.setRefundId(response.refund.id);
            refund.setDate(new Date(response.refund.createdTime));
            let payment = this.store.getPaymentByCloverId(response.paymentId);
            payment.addRefund(refund);
            payment.setTransactionType('Refund');
            let order = this.store.getOrderByCloverPaymentId(response.paymentId);
            order.setStatus('REFUNDED');
            this.store.updateTransactionToRefund(response.paymentId);
            this.setStatus('Refund Processed Successfully', 'Toggle');
        }
        else{
            this.setStatus('Refund Failed: '+ response.message, 'Toggle');
        }
    }

    // VAULTED CARDS

    onVaultCardResponse(response) {     // called in response to a vault card request
        console.log('Vault Card Response', response);
        if(response.success) {
            let card = response.getCard();
            if (card) {
                this.store.addCard(new VaultedCard(card));
                this.setStatus('Card Successfully Vaulted', 'Toggle');
            }
        }
        else {
            this.setStatus('Card Vaulting Failed');
        }
    }

    // OTHER

    onConfirmPaymentRequest(request) {      // called when the Clover device requires confirmation for a payment (ex. duplicates/offline)
        console.log('onConfirmPaymentRequest', request);
        if(request.challenges.length > 0 && request.payment !== null){
            this.challenge(request.challenges[0], request);
        }
        else{
            console.error('Error: The ConfirmPaymentRequest was missing the payment and/or challenges.');
        }
    }

    onVerifySignatureRequest(request){      // called when the Clover device requires a signature to be verified
        console.log('onVerifySignatureRequest', request);
        this.confirmSignature(request);
    }

    onCloseoutResponse(response) {      // called in response to a closeout being processed
        console.log('onCloseoutResponse', response);
        if (response.success) {
            this.setStatus('Closeout Successful', 'Toggle');
        } else {
            this.setStatus(`Closeout Failed, Reason: ${response.reason}`);
        }
    }

    onVoidPaymentResponse(response){    // called in response to a void payment request
        console.log('onVoidPaymentResponse', response);
        if(response.success){
            this.store.updateTransactionToVoided(response.paymentId);
            this.setStatus('Payment Voided Successfully', 'Toggle');
        }
        else{
            this.setStatus(`Payment Void Failed, Reason: ${response.reason}`);
        }
    }

    // HELPERS

    createOrderPayment(payment, type){      // creates a new OrderPayment object from payment
        let orderPayment = new OrderPayment(this.store.getNextPaymentId());
        orderPayment.cloverPaymentId = payment.id;
        orderPayment.status = payment.result;
        orderPayment.transactionState = payment.cardTransaction.state;
        orderPayment.amount = payment.amount;
        orderPayment.taxAmount = payment.taxAmount;
        orderPayment.tipAmount = payment.tipAmount;
        orderPayment.date = new Date(payment.createdTime);
        orderPayment.tender = payment.tender.label;
        orderPayment.transactionType = payment.cardTransaction.type;
        orderPayment.cardDetails = (`${payment.cardTransaction.cardType} ${payment.cardTransaction.last4}`);
        orderPayment.cardType = payment.cardTransaction.cardType;
        orderPayment.externalPaymentId = payment.externalPaymentId;
        orderPayment.refunds = payment.refunds;
        orderPayment.cashBackAmount = payment.cashbackAmount;
        orderPayment.entryMethod = payment.cardTransaction.entryType;
        orderPayment.cloverOrderId = payment.order.id;
        orderPayment.cardType = payment.cardTransaction.cardType;
        orderPayment.transactionTitle = type;
        return orderPayment;
    }

    createTransactionFromOrderPayment(payment, result){     // creates a new Transaction object from payment
        let transaction = new Transaction();
        transaction.amount = payment.getTotal();
        transaction.cardDetails = payment.getCardDetails();
        transaction.cardType = payment.getCardType();
        transaction.date = payment.getDate();
        transaction.id = payment.getCloverPaymentId();
        transaction.result = result;
        transaction.tender = payment.getTender();
        transaction.transactionType = payment.getTransactionType();
        transaction.transactionTitle = payment.getTransactionTitle();
        return transaction;
    }

    setPaymentStatus(payment, response) {       // sets the payment status based on the response
        if (response.isSale) {
            payment.setStatus('PAID');
        } else if (response.isAuth) {
            payment.setStatus('AUTH');
        } else if (response.isPreAuth) {
            payment.setStatus('PREAUTH');
        }
    }

    createRefund(response){     // creates a Refund object based on the response
        console.log('createRefund', response);
        let refund = new Refund();
        refund.setAmount(response.credit.amount);
        refund.setCardDetails(`${response.credit.cardTransaction.cardType} ${response.credit.cardTransaction.last4}`);
        refund.setCardType(response.credit.cardTransaction.cardType);
        refund.setDate(new Date(response.credit.createdTime));
        refund.setId(response.credit.id);
        refund.setTender(response.credit.tender.label);
        refund.setTransactionTitle('Manual Refund');
        refund.setTransactionType(response.credit.cardTransaction.type);
        refund.setEntryMethod(response.credit.cardTransaction.entryType);
        refund.setTransactionState(response.credit.cardTransaction.state);
        console.log('createRefund', response);
        return refund;
    }

    //</editor-fold>

}
