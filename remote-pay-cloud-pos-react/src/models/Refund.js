export default class Refund {

    constructor(){
        this.amount = 0;
        this.cardDetails = null;
        this.cardType = "Default";
        this.date = new Date();
        this.employee = "Employee";
        this.id = null;
        this.tender = "Credit Card";
        this.transactionTitle = null;
        this.transactionType = '';
    }

    getAmount(){
        return parseFloat(this.amount).toFixed(2);
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

    getTotal(){
        return parseFloat(this.amount).toFixed(2);
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
}