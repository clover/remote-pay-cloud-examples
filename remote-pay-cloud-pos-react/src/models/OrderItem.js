import CurrencyFormatter from "../utils/CurrencyFormatter";

export default class OrderItem {

    constructor(item, orderId) {
        this.id = item.id;
        this.item = item;
        this.orderId = orderId;
        this.quantity = 1;
        this.formatter = new CurrencyFormatter();
    }

    getId(){
        return this.id;
    }

    getItem(){
        return this.item;
    }

    getOrderId(){
        return this.orderId;
    }

    getQuantity(){
        return this.quantity;
    }

    incrementQuantity(quantity){
        this.quantity += quantity;
    }

    calculateTotal(){
        let total = (this.item.price * this.quantity);
        return this.formatter.convertToFloat(total);
    }


}
