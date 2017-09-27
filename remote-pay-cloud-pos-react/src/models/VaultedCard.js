
export default class VaultedCard {

    constructor(card){
        this.card = card;
        this.name = '';
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
}