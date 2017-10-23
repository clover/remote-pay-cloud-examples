
export default class Item {

    constructor(id, title, price, taxable, tippable){
        this.id = id;
        this.price = price;
        this.taxable = taxable;
        this.tippable = tippable;
        this.title = title;
    }

    getId(){
        return this.id;
    }

    getTitle(){
        return this.title;
    }

    getPrice(){
        return this.price;
    }

    getTaxable(){
        return this.taxable;
    }

    getTippable(){
        return this.tippable;
    }
}