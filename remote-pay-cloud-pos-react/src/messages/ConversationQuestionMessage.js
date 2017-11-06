import PayloadMessage from './PayloadMessage';

export default class ConversationQuestionMessage extends PayloadMessage{

    constructor(message){
        super('ConversationQuestionMessage', 'CONVERSATION_QUESTION');
        this.message = message;
    }

    getPayload(){
        return {
            message : this.message,
            messageType : this.messageType,
            payloadClassName : this.payloadClassName
        };
    }
}