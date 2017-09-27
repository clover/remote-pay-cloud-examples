
export default class ActivityMessage {

    constructor(action, payload) {
        this.action = action;
        this.payload = payload;
    }

    getAction() {
        return this.action;
    }

    getPayload() {
        return this.payload;
    }
}
