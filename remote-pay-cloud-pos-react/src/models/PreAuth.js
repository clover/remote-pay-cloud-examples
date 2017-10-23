
export default class PreAuth {

    constructor(preAuth, payment){
        this.name = '';
        this.payment = payment;
        this.preAuth = preAuth;
    }

    getCard(){
        return this.card;
    }

    setCard(card){
        this.card = card;
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    getPayment(){
        return this.payment;
    }

    setPayment(payment){
        this.payment = payment;
    }
}