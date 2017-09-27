import CurrencyFormatter from "../utils/CurrencyFormatter";

export default class OrderPayment {

    constructor(id) {
        this.id = id;
        this.cloverPaymentId = null;
        this.status = "OPEN";
        this.amount = 0;
        this.taxAmount = 0;
        this.tipAmount = 0;
        this.date = new Date();
        this.tender="Credit Card";
        this.transactionType = '';
        this.cardDetails = "EBT 3453";
        this.employee = "Employee";
        this.deviceId = "C03458DF83458";
        this.transactionState="CLOSED";
        this.transactionTitle = null;
        this.externalPaymentId = null;
        this.refunds = [];
        this.cashBackAmount = 0.00;
        this.entryMethod = "SWIPED";
        this.cloverOrderId = null;
        this.cardType = null;
        this.formatter = new CurrencyFormatter();
    }

    getId(){
        return this.cloverPaymentId;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    setAmount(amount){
        this.amount = amount;
    }

    getAmount() {
        return this.amount;
    }

    setTipAmount(tipAmount){
        this.tipAmount = tipAmount;
    }

    getTipAmount(){
        if(this.tipAmount !== null){
            return this.tipAmount;
        }
        else{
            return 0;
        }
    }

    getTender(){
        return this.tender;
    }

    setTender(tender){
        this.tender = tender;
    }

    getTransactionType(){
        return this.transactionType;
    }

    setTransactionType(transactionType){
        this.transactionType = transactionType;
    }

    getTotal(){
        return parseFloat(parseFloat(this.formatter.convertToFloat(this.amount)) + parseFloat(this.formatter.convertToFloat(this.getTipAmount()))).toFixed(2);
    }

    getTotalForRequest(){

    }

    addRefund(refund){
        if(this.refunds === undefined){
            this.refunds = [];
        }
        this.refunds.push(refund);
    }

    setOrderId(id){
        this.orderId = id;
    }

    getOrderId(){
        return this.orderId;
    }

    setExternalPaymentId(id){
        this.externalPaymentId = id;
    }

    getExternalPaymentId(){
        return this.externalPaymentId;
    }

    setCashback(cashback){
        this.cashBackAmount = cashback;
    }

    getCashback(){
        return this.cashBackAmount;
    }

    setCardType(cardType){
        this.cardType = cardType;
    }

    getCardType(){
        return this.cardType;
    }

    setCardDetails(cardDetails){
        this.cardDetails = cardDetails;
    }

    getCardDetails(){
        return this.cardDetails;
    }

    setDate(date){
        this.date = date;
    }

    getDate(){
        return this.date;
    }

    getCloverPaymentId(){
        return this.cloverPaymentId;
    }

    getTransactionTitle(){
        return this.transactionTitle;
    }

    setTransactionTitle(transactionTitle){
        this.transactionTitle = transactionTitle;
    }
}