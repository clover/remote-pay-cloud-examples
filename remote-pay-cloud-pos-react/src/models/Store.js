import clover from 'remote-pay-cloud';
import sdk from 'remote-pay-cloud-api';
import Transaction from "./Transaction";

export default class Store {

    constructor() {
        this.storeName = null;
        this.cardEntryMethods = clover.CardEntryMethods.DEFAULT;
        this.availableItems = [];
        this.orders = [];
        this.vaultedCards = [];
        this.lastVaultedCard = null;
        this.credits = [];
        this.preAuth = null;
        this.preAuthPaymentId = null;
        this.transactions = [];
        this.refunds = [];
        this.paymentId = 0;
        this.orderId = 0;
        this.currentOrder = null;
        this.discounts = [];
        //this.forceOfflinePayments = undefined;
        //this.allowOfflinePayments = undefined;
        //this.approveOfflinePaymentWithoutPrompt = undefined;
        this.forceOfflinePayments = true;
        this.allowOfflinePayments = true;
        this.approveOfflinePaymentWithoutPrompt = true;
        //this.signatureEntryLocation = undefined;
        this.signatureEntryLocation = sdk.payments.DataEntryLocation.NONE;
        //this.tipMode = undefined;
        this.tipMode = sdk.payments.TipMode.NO_TIP;
        this.tipAmount = 0;
        this.signatureThreshold = 0;
        this.disableDuplicateChecking =true;
        this.disableReceiptOptions = true;
        this.disablePrinting = false;
        this.automaticSignatureConfirmation = true;
        this.automaticPaymentConfirmation = true;
        this.getNextPaymentId = this.getNextPaymentId.bind(this);
        this.customActivity = null;

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
            if (lastOrder.status === "OPEN" && this.currentOrder.id !== lastOrder.id && lastOrder.items.length === 0) {
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
        let payment= null;
        this.orders.forEach(function (order) {
            order.orderPayments.forEach(function (orderPayment) {
                if(orderPayment.cloverPaymentId === paymentId){
                    payment = orderPayment;
                }
            }, this);
        }, this);
        return payment;
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
        console.log("createTransaction", refund);
        let transaction = new Transaction();
        transaction.amount = refund.getTotal();
        transaction.cardDetails = refund.getCardDetails();
        transaction.cardType = refund.getCardType();
        transaction.date = refund.getDate();
        transaction.id = refund.getId();
        transaction.tender = refund.getTender();
        transaction.transactionType = refund.getTransactionType();
        console.log(transaction);
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

    addPaymentToOrder(payment, orderId) {
        let order = this.getOrderById(orderId);
        order.addOrderPayment(payment);
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

}
