
export default class CustomerInfo{

    constructor() {
        this.customerName = null;
        this.phoneNumber = null;
    }

    setCustomerName(name){
        this.customerName = name;
    }

    getCustomerName(){
        return this.customerName;
    }

    setPhoneNumber(number){
        this.phoneNumber = number;
    }

    getPhoneNumber(){
        return this.phoneNumber;
    }


}
