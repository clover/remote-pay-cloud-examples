export default class PaymentRefund {

    constructor(){
        this.amount = 0;
        this.date = new Date();
        this.employee = 'EMPLOYEE';
        this.orderId = undefined;
        this.paymentId = undefined;
        this.refundId = undefined;
    }

    getAmount(){
        return this.amount;
    }

    setAmount(amount){
        this.amount = amount;
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

    getOrderId(){
        return this.orderId;
    }

    setOrderId(orderId){
        this.orderId = orderId;
    }

    getPaymentId(){
        return this.paymentId;
    }

    setPaymentId(paymentId){
        this.paymentId = paymentId;
    }

    getRefundId(){
        return this.refundId;
    }

    setRefundId(refundId){
        this.refundId = refundId;
    }

}