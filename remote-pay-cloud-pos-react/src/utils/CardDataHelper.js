
export default class CardDataHelper{

    getExpirationDate(exp){
        let first = exp.substr(0, 2);
        let last = exp.substr(2,4);
        let date = first + '/' + last;
        return date;
    }

    getCardDataArray(cardData){
        let cardDataString = [];
        cardDataString.push('Cardholder Name: ' + cardData.cardholderName);
        cardDataString.push('Encrypted: ' + cardData.encrypted);
        cardDataString.push('Expiration: ' + this.getExpirationDate(cardData.exp));
        cardDataString.push('First 6: ' + cardData.first6);
        cardDataString.push('First Name: ' + cardData.firstName);
        cardDataString.push('Last 4: ' + cardData.last4);
        cardDataString.push('Last Name: ' + cardData.lastName);
        cardDataString.push('Masked Track 1: ' + cardData.maskedTrack1);
        cardDataString.push('Masked Track 2: ' + cardData.maskedTrack2);
        cardDataString.push('Masked Track 3: ' + cardData.maskedTrack3);
        cardDataString.push('Primary Account Number: ' + cardData.pan);
        cardDataString.push('Track 1: ' + cardData.track1);
        cardDataString.push('Track 2: ' + cardData.track2);
        cardDataString.push('Track 3: ' + cardData.track3);
        return cardDataString;
    }



}