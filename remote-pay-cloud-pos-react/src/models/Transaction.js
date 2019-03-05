
export default class Transaction {

    constructor(){
        this.amount = 0;
        this.cardDetails = null;
        this.cardType = 'Default';
        this.date = new Date();
        this.deviceId = null;
        this.employee = 'Employee';
        this.entryMethod = '';
        this.id = null;
        this.tender = 'Credit Card';
        this.transactionState = 'OPEN';
        this.transactionTitle = null;
        this.transactionType = '';
        this.refund = false;
        this.result = 'Successful';
        this._tipAmount = '';
    }

    getAmount(){
        return this.amount;
    }

    setAmount(amount){
        this.amount = amount;
    }

    getCardDetails(){
        return this.cardDetails;
    }

    setCardDetails(cardDetails){
        this.cardDetails = cardDetails;
    }

    getCardType(){
        return this.cardType;
    }

    setCardType(cardType){
        this.cardType = cardType;
    }

    getDate(){
        return this.date;
    }

    setDate(date){
        this.date = date;
    }

    getEmployee(){
        return this.employee;
    }

    setEmployee(employee){
        this.employee = employee;
    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
    }

    getTender(){
        return this.tender;
    }

    setTender(tender){
       this.tender = tender;
    }

    getTransactionTitle(){
        return this.transactionTitle;
    }

    setTransactionTitle(transactionTitle){
        this.transactionTitle = transactionTitle;
    }

    getTransactionType(){
        return this.transactionType;
    }

    setTransactionType(transactionType){
        this.transactionType = transactionType;
    }

    getRefund(){
        return this.refund;
    }

    setRefund(refund){
        this.refund = refund;
    }

    getEntryMethod(){
        return this.entryMethod;
    }

    setEntryMethod(entryMethod){
        this.entryMethod = entryMethod;
    }

    getTransactionState(){
        return this.transactionState;
    }

    setTransactionState(state){
        this.transactionState = state;
    }

    getDeviceId(){
        return this.deviceId;
    }

    setDeviceId(id){
        this.deviceId = id;
    }


    getTipAmount() {
        return this._tipAmount;
    }

    setTipAmount(value) {
        this._tipAmount = value;
    }
}