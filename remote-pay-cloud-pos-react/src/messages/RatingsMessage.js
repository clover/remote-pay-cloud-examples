import PayloadMessage from './PayloadMessage';

export default class RatingsMessage extends PayloadMessage {
    constructor(ratings) {
        super('RatingsMessage', 'RATINGS');
        this.ratings = ratings;
    }
}