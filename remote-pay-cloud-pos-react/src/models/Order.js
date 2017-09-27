import CurrencyFormatter from "../utils/CurrencyFormatter";
import clover from 'remote-pay-cloud-api';
import Item from './Item';

export default class Order {

    constructor(id) {
        this.id = id;
        this.items = [];
        this.displayItems = [];
        this.status = "OPEN";
        this.date = new Date();
        this.orderPayments = [];
        this.refunds = [];
        this.discount = null;
        this.formatter = new CurrencyFormatter();
        this.pendingPaymentId = null;
    }

    getId() {
        return this.id;
    }

    setPendingPaymentId(id){
        this.pendingPaymentId = id;
    }

    getPendingPaymentId(){
        return this.pendingPaymentId;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    addItem(id, title, price, tippable, taxable){
        let orderItem = this.getOrderItemById(id);
        let item = this.getItemById(id);
        if(item == null){
            this.items.push(new Item(id, title, price, tippable, taxable));
        }
        if(orderItem == null){
            let lineItem = new clover.order.DisplayLineItem();
            lineItem.setId(id);
            lineItem.setName(title);
            lineItem.setPrice(this.formatter.formatCurrency(price));
            lineItem.setQuantity(1);
            this.displayItems.push(lineItem);
        }
        else{
            orderItem.setQuantity(orderItem.quantity + 1);
        }
    }

    getItems(){
        return this.items;
    }

    getDisplayItems(){
        return this.displayItems;
    }

    getItemById(id){
        let orderItem = null;
        this.items.filter(function( obj ) {
            if( obj.id == id){
                orderItem = obj;
            }
        });
        return orderItem;
    }

    getOrderItemById(id){
        let orderItem = null;
        this.displayItems.filter(function( obj ) {
            if( obj.id == id){
                orderItem = obj;
            }
        });
        return orderItem;
    }

    getPaymentById(id){
        let payment= null;
        this.payments.filter(function( obj ) {
            if( obj.id == id){
                payment = obj;
            }
        });
        return payment;
    }

    getTotal() {
        let total = (parseFloat(this.getPreTaxSubTotal()) + parseFloat(this.getTaxAmount()));
        return parseFloat(total).toFixed(2);
    }
    getDate(){
        return this.date;
    }

    addOrderPayment(orderPayment){
        this.orderPayments.push(orderPayment);
    }

    getOrderPayments(){
        let _orderPayments = [];
        this.orderPayments.forEach(function (orderPayment) {
            if(orderPayment.transactionType !== "VOIDED"){
                _orderPayments.push(orderPayment);
            }
        },this);
        return _orderPayments;
    }

    getRefunds(){
        return this.refunds;
    }

    addRefund(refund){
        this.refunds.push(refund);
    }

    addDiscount(discount){
        this.discount = discount;
    }

    getDiscount(){
        return this.discount;
    }

    getTaxableSubtotal() {
        let sub = 0;
        this.displayItems.forEach(function(item){
            let _item = this.getItemById(item.id);
            if (_item.getTaxable()) {
                sub = parseFloat(parseFloat(sub) + (this.formatter.convertToFloat(_item.price) * item.quantity));
            }
        }, this);
        if (this.discount != null) {
            sub = this.discount.appliedTo(sub);
        }
        return parseFloat(sub).toFixed(2);
    }

    getPreTaxSubTotal() {
        let sub = 0;
        this.displayItems.forEach(function(item){
            let _item = this.getItemById(item.id);
            sub = parseFloat(parseFloat(sub) + (this.formatter.convertToFloat(_item.price) * item.quantity));
        }, this);
        if (this.discount != null) {
            sub = this.discount.appliedTo(sub);
        }
        return parseFloat(sub).toFixed(2);
    }

    getTaxAmount() {
        let taxAmount = parseFloat(this.getTaxableSubtotal() * 0.07).toFixed(2);
        return taxAmount;
    }

    getTippableAmount() {
        let tippableAmount = 0;
        this.displayItems.forEach(function(item){
            let _item = this.getItemById(item.id);
            if(_item.getTippable()){
                tippableAmount = parseFloat(parseFloat(tippableAmount) + (this.formatter.convertToFloat(_item.price) * item.quantity));
            }
        }, this);
        if (this.discount != null) {
            tippableAmount = this.discount.appliedTo(tippableAmount);
        }
        return parseFloat(tippableAmount + parseFloat(this.getTaxAmount())).toFixed(2); // should match Total if there aren't any "non-tippable" items

    }
}