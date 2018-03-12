export default class CustomPayloadMessage {

    constructor(payloadContent, sentToCustomActivity){
        this.payloadContent = payloadContent;
        this.sentToCustomActivity = sentToCustomActivity;
    }

    getPayload(){
        return this.payloadContent;
    }

    isSentToCustomActivity(){
        return this.sentToCustomActivity;
    }
}