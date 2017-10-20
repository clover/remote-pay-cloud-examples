import CurrencyFormatter from '../utils/CurrencyFormatter';

export default class Discount {

    constructor(name, amount, percentage) {
        this.amountOff = amount;
        this.formatter = new CurrencyFormatter();
        this.name = name;
        this.percentageOff = percentage;
    }

    getAmountOff() {
        return this.amountOff;
    }

    setAmountOff(value) {
        this.percentageOff = 0.00;
        this.amountOff = value;
    }

    getPercentageOff() {
        return this.percentageOff;
    }

    setPercentageOff(value) {
        this.amountOff = 0;
        this.percentageOff = value;
    }

    getName() {
        return this.name;
    }

    appliedTo(sub) {
        sub = parseFloat(sub).toFixed(2);
        if (this.getAmountOff() == 0) {
            sub = (sub - (sub * this.getPercentageOff()));
        } else {
            sub -= this.formatter.convertToFloat(this.amountOff);
        }
        return Math.max(sub, 0);
    }

    getValue(sub) {
        let value = this.formatter.convertToFloat(this.amountOff);
        if (this.getAmountOff() == 0) {
            value = (sub * this.getPercentageOff());
        }
        return value;
    }
}
