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
        if (this.getAmountOff() == 0) {
            sub = this.formatter.convertToFloat(sub);
            sub = parseFloat(sub - (sub * this.getPercentageOff())).toFixed(2);
            sub = this.formatter.convertFromFloat(sub);
        } else {
            sub -= this.amountOff;
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
