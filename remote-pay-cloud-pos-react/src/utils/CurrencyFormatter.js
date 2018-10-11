export default class CurrencyFormatter {

    formatCurrency(currency){
        if(currency === 0){
            return '$0.00';
        }
        else {
            let number = currency.toString();
            let first = number.substr(0, number.length - 2);
            if(first.length < 1){
                first = '0';
            }
            let last = number.substr(number.length - 2);
            return `$${first}.${last}`;
        }
    }

    convertStringToFloat(currency){
        let float = currency.substr(1,currency.length);
        return parseFloat(float);
    }

    convertToFloat(currency){
        if(currency === 0){
            return parseFloat(0.00).toFixed(2);
        }
        let number = currency.toString();
        let first = number.substr(0,number.length-2);
        let last =  number.substr(number.length-2);
        if(last.length == 1){
            last = "0" + last;
        }
        let float = first+"."+last;
        return parseFloat(float).toFixed(2);
    }

    convertFromFloat(currency){
        let parts = currency.toString().split('.');
        return parts[0] + parts[1];
    }
}