export default class PayloadMessage {

    constructor(payloadClassName, messageType){
        this.payloadClassName = (payloadClassName.length < 1) ? 'PayloadMessage' : payloadClassName;
        this.messageType = messageType;
    }

    getPayload(){
        return {
            messageType : this.messageType,
            payloadClassName : this.payloadClassName
        };
    }
}