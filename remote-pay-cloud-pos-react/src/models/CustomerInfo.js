
export default class CustomerInfo{

    constructor() {
        this.phoneNumber = null;
        this.customerName = null;

    }

    setPhoneNumber(number){
        this.phoneNumber = number;
    }

    getPhoneNumber(){
        return this.phoneNumber;
    }

    setCustomerName(name){
        this.customerName = name;
    }

    getCustomerName(){
        return this.customerName;
    }

//public static final Creator<CustomerInfo> CREATOR = new Creator<CustomerInfo>() {
//@Override
//    public CustomerInfo createFromParcel(Parcel in) {
//        return new CustomerInfo(in);
//    }
//
//@Override
//    public CustomerInfo[] newArray(int size) {
//        return new CustomerInfo[size];
//    }
//};
//
//@Override
//public int describeContents() {
//    return 0;
//}
//
//@Override
//public void writeToParcel(Parcel dest, int flags) {
//    dest.writeString(phoneNumber);
//    dest.writeString(customerName);
//}
}
