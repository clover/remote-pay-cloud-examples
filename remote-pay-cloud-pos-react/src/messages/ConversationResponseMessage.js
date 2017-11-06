import PayloadMessage from './PayloadMessage';

export default class ConversationResponseMessage extends PayloadMessage{

    constructor(message) {
        super('ConversationResponseMessage', 'CONVERSATION_RESPONSE');
        this.message = message;
    }
}