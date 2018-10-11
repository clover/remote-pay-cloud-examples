import clover from 'remote-pay-cloud';
import CurrencyFormatter from './../utils/CurrencyFormatter';
import Transaction from "./Transaction";

export default class Store {

    constructor() {
        this.allowOfflinePayments = true;
        this.approveOfflinePaymentWithoutPrompt = true;
        this.automaticSignatureConfirmation = true;
        this.automaticPaymentConfirmation = true;
        this.availableItems = [];
        this.cardEntryMethods = clover.CardEntryMethods.DEFAULT;
        this.credits = [];
        this.customActivity = null;
        this.deviceId = null;
        this.disableDuplicateChecking =true;
        this.disablePrinting = false;
        this.disableReceiptOptions = true;
        this.discounts = [];
        this.forceOfflinePayments = true;
        this.formatter = new CurrencyFormatter();
        this.currentOrder = null;
        this.lastVaultedCard = null;
        this.orders = [];
        this.orderId = 0;
        this.paymentId = 0;
        this.preAuth = null;
        this.preAuthPaymentId = null;
        this.refunds = [];
        this.signatureEntryLocation = clover.sdk.payments.DataEntryLocation.NONE;
        this.signatureThreshold = 0;
        this.storeName = null;
        this.tipAmount = 0;
        this.tipMode = clover.sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT;
        this.transactions = [];
        this.vaultedCards = [];
        this.tipSuggestion1 = new clover.sdk.merchant.TipSuggestion();
        this.tipSuggestion1.setIsEnabled(true);
        this.tipSuggestion1.setName("Good");
        this.tipSuggestion1.setPercentage(15);
        this.tipSuggestion2 =  new clover.sdk.merchant.TipSuggestion();
        this.tipSuggestion2.setIsEnabled(true);
        this.tipSuggestion2.setName("Great");
        this.tipSuggestion2.setPercentage(18);
        this.tipSuggestion3 = new clover.sdk.merchant.TipSuggestion();
        this.tipSuggestion3.setIsEnabled(true);
        this.tipSuggestion3.setName("Wow!");
        this.tipSuggestion3.setPercentage(20);
        this.tipSuggestion4 = new clover.sdk.merchant.TipSuggestion();
        this.tipSuggestion4.setIsEnabled(true);
        this.tipSuggestion4.setName("Best Service Ever!");
        this.tipSuggestion4.setPercentage(30);
        this.getNextPaymentId = this.getNextPaymentId.bind(this);
    }

    setStoreName(name){
        this.storeName = name;
    }

    getStoreName(){
        return this.storeName;
    }

    setCurrentOrder(current) {
        this.currentOrder = current;
    }

    getCurrentOrder() {
        return this.currentOrder;
    }

    getNextPaymentId() {
        this.paymentId++;
        return this.paymentId;
    }

    getNextOrderId(){
        this.orderId++;
        return this.orderId;
    }

    getLastOpenOrder(){
        let order = null;
        if(this.orders.length > 0) {
            let lastOrder = this.orders[this.orders.length - 1];
            if (lastOrder.status === 'OPEN' && this.currentOrder.id !== lastOrder.id && lastOrder.items.length === 0) {
                order = lastOrder;
            }
        }
        return order;
    }

    getOrderById(id) {
        let order = null;
        this.orders.filter(function (obj) {
            if (obj.id == id) {
                order = obj;
            }
        });
        return order;
    }

    getItemById(id) {
        let item = null;
        this.availableItems.filter(function (obj) {
            if (obj.id == id) {
                item = obj;
            }
        });
        return item;
    }

    getPaymentByCloverId(paymentId){
        let payment = null;
        this.orders.forEach(function (order) {
            order.orderPayments.forEach(function (orderPayment) {
                if(orderPayment.cloverPaymentId === paymentId){
                    payment = orderPayment;
                }
            }, this);
        }, this);
        return payment;
    }

    getRefundByCloverId(refundId){
        let refund = null;
        this.refunds.forEach(function (refund_) {
                if(refund_.id === refundId){
                    refund = refund_;
                }
        }, this);
        return refund;
    }

    getOrderByCloverPaymentId(paymentId){
        let selectedOrder = null;
        this.orders.forEach(function (order) {
            order.orderPayments.forEach(function (orderPayment) {
                if(orderPayment.cloverPaymentId === paymentId){
                    selectedOrder = order;
                }
            }, this);
        }, this);
        return selectedOrder;
    }

    getOrders() {
        return this.orders;
    }

    getTransactions() {
        return this.transactions;
    }

    addTransaction(transaction){
        this.transactions.push(transaction);
    }

    updateTransactionToRefund(transactionId){
        this.transactions.filter(function (obj) {
            if (obj.id == transactionId) {
                let refundTransaction = obj;
                obj.setRefund(true);
            }
        });
    }

    updateTransactionToVoided(transactionId){
        this.transactions.filter(function (obj) {
            if (obj.id == transactionId) {
                obj.setTransactionType('VOIDED');
            }
        });
        let payment = this.getPaymentByCloverId(transactionId);
        payment.setTransactionType('VOIDED');
        let order = this.getOrderByCloverPaymentId(transactionId);
        order.setStatus('OPEN');
    }

    setCardEntryMethods(cardEntryMethods) {
        this.cardEntryMethods = cardEntryMethods;
    }

    getCardEntryMethods() {
        return this.cardEntryMethods;
    }

    getItems() {
        return this.availableItems;
    }

    addItem(item) {
        this.availableItems.push(item);
    }

    getOrders() {
        return this.orders;
    }

    addOrder(order) {
        this.orders.push(order);
    }

    getVaultedCards() {
        return this.vaultedCards;
    }

    addCard(card) {
        this.lastVaultedCard = card;
        this.vaultedCards.push(this.lastVaultedCard);
    }

    getLastVaultedCard(){
        return this.lastVaultedCard;
    }

    getCredits() {
        return this.credits;
    }

    addRefund(refund) {
        this.refunds.push(refund);
        let transaction = this.createTransactionFromRefund(refund);
        this.transactions.push(transaction);
    }

    createTransactionFromRefund(refund){
        let transaction = new Transaction();
        transaction.amount = this.formatter.convertToFloat(refund.amount);
        transaction.cardDetails = refund.getCardDetails();
        transaction.cardType = refund.getCardType();
        transaction.date = refund.getDate();
        transaction.id = refund.getId();
        transaction.tender = refund.getTender();
        transaction.transactionTitle = refund.getTransactionTitle();
        transaction.transactionType = refund.getTransactionType();
        transaction.refund = true;
        transaction.entryMethod = refund.getEntryMethod();
        transaction.transactionState = refund.getTransactionState();
        transaction.deviceId = this.getDeviceId();
        return transaction;
    }

    getPreAuth() {
        return this.preAuth;
    }

    setPreAuth(preauth) {
        this.preAuth = preauth;
    }

    getPreAuthPaymentId(){
        return this.preAuthPaymentId;
    }

    setPreAuthPaymentId(id){
        this.preAuthPaymentId = id;
    }

    getRefunds() {
        return this.refunds;
    }

    addPaymentToCurrentOrder(payment) {
        this.currentOrder.addOrderPayment(payment);
    }

    addDiscount(discount) {
        this.discounts.push(discount);
    }

    getDiscounts() {
        return this.discounts;
    }

    setForceOfflinePayments(forceOffline) {
        this.forceOfflinePayments = forceOffline;
    }

    getForceOfflinePayments() {
        return this.forceOfflinePayments;
    }

    setAllowOfflinePayments(allowOffline) {
        this.allowOfflinePayments = allowOffline;
    }

    getAllowOfflinePayments() {
        return this.allowOfflinePayments;
    }

    setApproveOfflinePaymentWithoutPrompt(approveOfflinePaymentWithoutPrompt) {
        this.approveOfflinePaymentWithoutPrompt = approveOfflinePaymentWithoutPrompt;
    }

    getApproveOfflinePaymentWithoutPrompt() {
        return this.approveOfflinePaymentWithoutPrompt;
    }

    getSignatureEntryLocation() {
        return this.signatureEntryLocation;
    }

    setSignatureEntryLocation(location) {
        this.signatureEntryLocation = location;
    }

    getTipMode() {
        return this.tipMode;
    }

    setTipMode(tipMode) {
        this.tipMode = tipMode;
    }

    getTipAmount() {
        return this.tipAmount;
    }

    setTipAmount(tipAmount) {
        this.tipAmount = tipAmount;
    }

    getSignatureThreshold() {
        return this.signatureThreshold;
    }

    setSignatureThreshold(threshold) {
        this.signatureThreshold = threshold;
    }

    getDisableDuplicateChecking() {
        return this.disableDuplicateChecking;
    }

    setDisableDuplicateChecking(disableDuplicateChecking) {
        this.disableDuplicateChecking = disableDuplicateChecking;
    }

    getDisableReceiptOptions(){
        return this.disableReceiptOptions;
    }

    setDisableReceiptOptions(disableReceiptOptions){
        this.disableReceiptOptions = disableReceiptOptions;
    }

    getDisablePrinting() {
        return this.disablePrinting;
    }

    setDisablePrinting(disablePrinting){
        this.disablePrinting = disablePrinting;
    }

    getAutomaticSignatureConfirmation() {
        return this.automaticSignatureConfirmation;
    }

    setAutomaticSignatureConfirmation(automaticSignatureConfirmation) {
        this.automaticSignatureConfirmation = automaticSignatureConfirmation;
    }

    getAutomaticPaymentConfirmation() {
        return this.automaticPaymentConfirmation;
    }

    setAutomaticPaymentConfirmation(automaticPaymentConfirmation) {
        this.automaticPaymentConfirmation = automaticPaymentConfirmation;
    }

    setCustomActivity(activity){
        this.customActivity = activity;
    }

    getCustomActivity(){
        return this.customActivity;
    }

    getDeviceId(){
        return this.deviceId;
    }

    setDeviceId(id){
        this.deviceId = id;
    }

    getTipSuggestion1(){
        return this.tipSuggestion1;
    }

    setTipSuggestion1(tipSuggestion1){
        this.tipSuggestion1 = tipSuggestion1;
    }

    getTipSuggestion2(){
        return this.tipSuggestion2;
    }

    setTipSuggestion2(tipSuggestion2){
        this.tipSuggestion2 = tipSuggestion2;
    }

    getTipSuggestion3(){
        return this.tipSuggestion3;
    }

    setTipSuggestion3(tipSuggestion3){
        this.tipSuggestion3 = tipSuggestion3;
    }

    getTipSuggestion4(){
        return this.tipSuggestion4;
    }

    setTipSuggestion4(tipSuggestion4){
        this.tipSuggestion4 = tipSuggestion4;
    }

}
