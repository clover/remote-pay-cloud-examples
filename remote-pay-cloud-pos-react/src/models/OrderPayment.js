import CurrencyFormatter from '../utils/CurrencyFormatter';

export default class OrderPayment {

    constructor(id) {
        this.amount = 0;
        this.cardDetails = 'EBT 3453';
        this.cardType = null;
        this.cashBackAmount = 0.00;
        this.cloverOrderId = null;
        this.cloverPaymentId = null;
        this.date = new Date();
        this.deviceId = 'C03458DF83458';
        this.employee = 'Employee';
        this.entryMethod = 'SWIPED';
        this.externalPaymentId = null;
        this.formatter = new CurrencyFormatter();
        this.id = id;
        this.refunds = [];
        this.status = 'OPEN';
        this.taxAmount = 0;
        this.tender = 'Credit Card';
        this.tipAmount = 0;
        this.transactionState='CLOSED';
        this.transactionTitle = null;
        this.transactionType = '';
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
            return this.formatter.convertToFloat(this.tipAmount);
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
        let amount =  this.formatter.convertToFloat(this.amount);
        let tipAmount = this.getTipAmount();
        console.log('getTotal tipAmount', tipAmount, 'amount', amount);
        let total = parseFloat(parseFloat(amount) + parseFloat(tipAmount)).toFixed(2);
        console.log('getTotal', total);
        return total;
    }

    getTotalForRequest(){

    }

    addRefund(refund){
        if(this.refunds === undefined){
            this.refunds = [];
        }
        this.refunds.push(refund);
    }

    getRefundsAmount(){
        let totalAmount = 0;
        this.refunds.forEach(function (refund) {
            totalAmount = totalAmount + refund.amount;
        });
        return totalAmount;
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