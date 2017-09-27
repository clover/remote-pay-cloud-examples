
export default class PreAuth {

    constructor(preAuth, payment){
        this.preAuth = preAuth;
        this.name = '';
        this.payment = payment;
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