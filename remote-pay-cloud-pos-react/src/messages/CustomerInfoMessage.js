import PayloadMessage from './PayloadMessage';

export default class CustomerInfoMessage extends PayloadMessage {

    constructor(customerInfo) {
        super('CustomerInfoMessage', 'CUSTOMER_INFO');
        this.customerInfo = customerInfo;
    }

    getCustomerInfo(){
        return this.customerInfo;
    }

}
