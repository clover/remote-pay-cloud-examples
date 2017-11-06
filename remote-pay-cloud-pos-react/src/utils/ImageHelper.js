export default class ImageHelper {

    getCardTypeImage(cardType){
        let image = 'images/tender_default.png';
        if(cardType === 'VISA'){
            image = 'images/tender_visa.png';
        }
        else if(cardType === 'AMEX'){
            image = 'images/tender_amex.png';
        }
        else if(cardType === 'MC'){
            image = 'images/tender_mc.png';
        }
        else if(cardType === 'DISCOVER'){
            image = 'images/tender_disc.png';
        }
        else if(cardType === 'EBT') {
            image = 'images/tender_ebt.png';
        }
        return image;
    }

    getPrinterTypeImage(printerType){
        let image = 'images/star.png';
        if(printerType === 'Mini'){
            image = 'images/mini_printer.png';
        }
        return image;
    }

    getDeviceImage(deviceTypeName){
        let image = '';
        if(deviceTypeName === 'BAYLEAF'){
            image = 'images/flex.png';
        }
        else if(deviceTypeName === 'MAPLECUTTER'){
            image = 'images/mini.png';
        }
        else if(deviceTypeName === 'LEAFCUTTER'){
            image = 'images/mobile.png';
        }
        return image;
    }

}