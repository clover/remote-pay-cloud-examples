import AvailableDiscount from './AvailableDiscount';
import AvailableItem from './AvailableItem';
import ButtonNormal from './ButtonNormal';
import clover from 'remote-pay-cloud';
import CurrencyFormatter from './../utils/CurrencyFormatter';
import ImageHelper from '../utils/ImageHelper';
import Order from '../models/Order';
import OrderPayment from '../models/OrderPayment';
import React from 'react';
import RegisterLine from './RegisterLine';
import RegisterLineItem from './RegisterLineItem';
import User from './SVGs/User';
import TipSuggestions from './TipSuggestions';

const data = require ('../../src/items.js');

export default class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            acceptOfflineSelection: 'default',
            allowOfflinePaymentsSelection: 'default',
            amountExceeded: false,
            areVaultedCards: false,
            chipCardEntry : false,
            confirmChallenges: false,
            confirmSignature: true,
            contactlessCardEntry : false,
            disableDuplicate: false,
            disablePrinting: false,
            disableReceipt: false,
            discount: '',
            fadeBackground: false,
            fadeSettingsBackground: false,
            forceOfflinePaymentSelection: 'default',
            makingSale: false,
            manualCardEntry : false,
            orderItems: [],
            payNoItems: false,
            preAuth: null,
            preAuthAmount: '50.00',
            preAuthChosen: false,
            preAuthName: '',
            promptPreAuth: false,
            responseFail: false,
            saveNoItems: false,
            showPaymentMethods: false,
            showSaleMethod: false,
            showSettings: false,
            showTipSuggestions: false,
            signatureEntryLocation: 'DEFAULT',
            sigThreshold: '0.00',
            subtotal : 0,
            swipeCardEntry : false,
            tax: 0,
            tipAmount: '0.00',
            tipMode: 'DEFAULT',
            total: 0
        };

        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.closeStatus = this.props.closeStatus;
        this.displayOrder = new clover.sdk.order.DisplayOrder();
        this.formatter = new CurrencyFormatter;
        this.imageHelper = new ImageHelper();
        this.saleMethod = null;
        this.setStatus = this.props.setStatus;
        this.store = this.props.store;

        this.addDiscount = this.addDiscount.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.authChosen = this.authChosen.bind(this);
        this.cardChosen = this.cardChosen.bind(this);
        this.choosePaymentMethod = this.choosePaymentMethod.bind(this);
        this.changePreAuthAmount = this.changePreAuthAmount.bind(this);
        this.changePreAuthName = this.changePreAuthName.bind(this);
        this.changeSignatureThreshold = this.changeSignatureThreshold.bind(this);
        this.changeTipAmount = this.changeTipAmount.bind(this);
        this.chooseSaleMethod = this.chooseSaleMethod.bind(this);
        this.closePreAuth = this.closePreAuth.bind(this);
        this.closeSaleMethod = this.closeSaleMethod.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
        this.closePaymentMethods = this.closePaymentMethods.bind(this);
        this.doPreAuth = this.doPreAuth.bind(this);
        this.exitPreAuth = this.exitPreAuth.bind(this);
        this.handleAcceptOfflineChange = this.handleAcceptOfflineChange.bind(this);
        this.handleAllowOfflineChange = this.handleAllowOfflineChange.bind(this);
        this.handleForceOfflineChange = this.handleForceOfflineChange.bind(this);
        this.handleSignatureEntryChange = this.handleSignatureEntryChange.bind(this);
        this.handleTipModeChange = this.handleTipModeChange.bind(this);
        this.initSettings = this.initSettings.bind(this);
        this.isTipNull = this.isTipNull.bind(this);
        this.makeSale = this.makeSale.bind(this);
        this.newOrder = this.newOrder.bind(this);
        this.preAuth = this.preAuth.bind(this);
        this.preAuthContinue = this.preAuthContinue.bind(this);
        this.promptPreAuth = this.promptPreAuth.bind(this);
        this.saleChosen = this.saleChosen.bind(this);
        this.save = this.save.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.saveTipSuggestions = this.saveTipSuggestions.bind(this);
        this.setTipSuggestions = this.setTipSuggestions.bind(this);
        this.showTipSuggestions = this.showTipSuggestions.bind(this);
        this.vaultedCardChosen = this.vaultedCardChosen.bind(this);
        this.toggleChip = this.toggleChip.bind(this);
        this.toggleConfirmChallenges = this.toggleConfirmChallenges.bind(this);
        this.toggleConfirmSignature = this.toggleConfirmSignature.bind(this);
        this.toggleContactless = this.toggleContactless.bind(this);
        this.toggleDisableDuplicate = this.toggleDisableDuplicate.bind(this);
        this.toggleDisablePrinting = this.toggleDisablePrinting.bind(this);
        this.toggleDisableReceipt = this.toggleDisableReceipt.bind(this);
        this.toggleManual = this.toggleManual.bind(this);
        this.toggleSwipe = this.toggleSwipe.bind(this);

        if(this.store.getCurrentOrder() === null || this.store.getCurrentOrder().getStatus() !== 'OPEN') {
            let lastOrder = this.store.getLastOpenOrder();
            if(lastOrder === null) {
                this.order = new Order(this.store.getNextOrderId());
                this.store.addOrder(this.order);
            }
            else{
                this.order = lastOrder;
            }
        }
        else{
            this.order = this.store.getCurrentOrder();
        }
        this.store.setCurrentOrder(this.order);
        if(this.props.location.state != null){
            this.saleMethod = this.props.location.state.saleType;
            if(this.saleMethod === 'Vaulted' || this.saleMethod === 'Vaulted PreAuth'){
                this.card = this.props.location.state.card;
                if(this.saleMethod === 'Vaulted PreAuth'){
                    this.saleMethod = 'PreAuth';
                }
            }
        }
    }

    initSettings(){     // initializes transaction settings
        let manual = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL) === clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL);
        let swipe = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE) === clover.CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE);
        let chip = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT) === clover.CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT);
        let contactless = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS) === clover.CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS);
        let forceOffline = this.getOfflineValueForState(this.store.getForceOfflinePayments());
        let allowOffline = this.getOfflineValueForState(this.store.getAllowOfflinePayments());
        let acceptOffline = this.getOfflineValueForState(this.store.getApproveOfflinePaymentWithoutPrompt());
        let signatureEntry = this.getSignatureValueForState(this.store.getSignatureEntryLocation());
        let tipMode = this.getTipValueForState(this.store.getTipMode());
        let tipAmount = this.formatter.convertToFloat(this.store.getTipAmount());
        let sigThreshold = this.formatter.convertToFloat(this.store.getSignatureThreshold());
        this.setState({
            manualCardEntry: manual,
            swipeCardEntry: swipe,
            chipCardEntry: chip,
            contactlessCardEntry: contactless,
            forceOfflinePaymentSelection: forceOffline,
            allowOfflinePaymentsSelection: allowOffline,
            acceptOfflineSelection: acceptOffline,
            signatureEntryLocation: signatureEntry,
            tipMode: tipMode,
            tipAmount: tipAmount,
            sigThreshold: sigThreshold,
            disableDuplicate: this.store.getDisableDuplicateChecking(),
            disableReceipt: this.store.getDisableReceiptOptions(),
            disablePrinting: this.store.getDisablePrinting(),
            confirmSignature: this.store.getAutomaticSignatureConfirmation(),
            confirmChallenges: this.store.getAutomaticPaymentConfirmation(),
        });
    }

    saveSettings(){     // saves transaction settings
        let val = 0;
        val |= this.state.manualCardEntry ? clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL: 0;
        val |= this.state.swipeCardEntry ? clover.CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE : 0;
        val |= this.state.chipCardEntry ? clover.CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT : 0;
        val |= this.state.contactlessCardEntry ? clover.CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS : 0;
        this.store.setCardEntryMethods(val);
        //offline settings
        this.store.setForceOfflinePayments(this.getOfflineValueForStore(this.state.forceOfflinePaymentSelection));
        this.store.setAllowOfflinePayments(this.getOfflineValueForStore(this.state.allowOfflinePaymentsSelection));
        this.store.setApproveOfflinePaymentWithoutPrompt(this.getOfflineValueForStore(this.state.acceptOfflineSelection));
        //signature
        this.store.setSignatureEntryLocation(this.getSignatureValueForStore(this.state.signatureEntryLocation));
        //tipMode
        this.store.setTipMode(this.getTipValueForStore(this.state.tipMode));
        this.store.setTipAmount(this.formatter.convertFromFloat((this.state.tipAmount)));
        this.store.setSignatureThreshold(this.formatter.convertFromFloat(parseFloat(this.state.sigThreshold).toFixed(2)));
        this.store.setDisableDuplicateChecking(this.state.disableDuplicate);
        this.store.setDisableReceiptOptions(this.state.disableReceipt);
        this.store.setDisablePrinting(this.state.disablePrinting);
        this.store.setAutomaticSignatureConfirmation(this.state.confirmSignature);
        this.store.setAutomaticPaymentConfirmation(this.state.confirmChallenges);
    }

    getOfflineValueForStore(input){  // gets offline value formatted for store
        if(input === 'true'){
            return true;
        }
        if (input === 'false'){
            return false;
        }
        if (input === 'default'){
            return undefined;
        }
    }

    getOfflineValueForState(input){     // gets offline value formatted for state
        if(input === true){
            return 'true';
        }
        if (input === false){
            return 'false';
        }
        if (input === undefined){
            return 'default';
        }
    }

    getSignatureValueForStore(input){       // gets signature value formatter for store
        if(input === 'DEFAULT'){
            return undefined;
        }
        if(input === 'ON_SCREEN'){
            return clover.sdk.payments.DataEntryLocation.ON_SCREEN;
        }
        if(input === 'ON_PAPER'){
            this.setState({sigThreshold: '0.00'});
            return clover.sdk.payments.DataEntryLocation.ON_PAPER;
        }
        if(input === 'NONE'){
            this.setState({sigThreshold: '0.00'});
            return clover.sdk.payments.DataEntryLocation.NONE;
        }
    }

    getSignatureValueForState(input){   // gets signature value formatted for state
        if(input === undefined){
            return 'DEFAULT';
        }
        if(input === clover.sdk.payments.DataEntryLocation.ON_SCREEN){
            return 'ON_SCREEN';
        }
        if(input === clover.sdk.payments.DataEntryLocation.ON_PAPER){
            return 'ON_PAPER';
        }
        if(input === clover.sdk.payments.DataEntryLocation.NONE){
            return 'NONE';
        }
    }

    getTipValueForStore(input){     // gets tip value formatted for store
        if(input === 'DEFAULT'){
            this.setState({tipAmount: '0.00'});
            return undefined;
        }
        if(input === 'NO_TIP'){
            this.setState({tipAmount: '0.00'});
            return clover.sdk.payments.TipMode.NO_TIP;
        }
        if(input === 'ON_SCREEN_BEFORE_PAYMENT'){
            this.setState({tipAmount: '0.00'});
            return clover.sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT;
        }
        if(input === 'TIP_PROVIDED'){
            return clover.sdk.payments.TipMode.TIP_PROVIDED;
        }
    }

    getTipValueForState(input){     // gets tip value formatted for state
        if(input === undefined){
            return 'DEFAULT';
        }
        if(input === clover.sdk.payments.TipMode.NO_TIP){
            return 'NO_TIP';
        }
        if(input === clover.sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT){
            return 'ON_SCREEN_BEFORE_PAYMENT';
        }
        if(input === clover.sdk.payments.TipMode.TIP_PROVIDED){
            return 'TIP_PROVIDED';
        }
    }


    toggleManual(){     // toggles manual card entry
        this.setState({ manualCardEntry : !this.state.manualCardEntry });
    }

    toggleSwipe(){     // toggles swipe card entry
        this.setState({ swipeCardEntry : !this.state.swipeCardEntry });
    }

    toggleChip(){     // toggles chip card entry
        this.setState({ chipCardEntry : !this.state.chipCardEntry });
    }

    toggleContactless(){     // toggles contactless card entry
        this.setState({ contactlessCardEntry : !this.state.contactlessCardEntry });
    }

    toggleDisableDuplicate(){      // toggles disable duplicates setting
        this.setState({ disableDuplicate : !this.state.disableDuplicate });
    }

    toggleDisableReceipt(){      // toggles disable receipt selection setting
        this.setState({ disableReceipt : !this.state.disableReceipt });
    }

    toggleDisablePrinting(){      // toggles disable printing setting
        this.setState({ disablePrinting : !this.state.disablePrinting });
    }

    toggleConfirmSignature(){      // toggles confrim signature setting
        this.setState({ confirmSignature : !this.state.confirmSignature });
    }

    toggleConfirmChallenges(){       // toggles confirm challenges setting
        this.setState({ confirmChallenges : !this.state.confirmChallenges });
    }

    handleForceOfflineChange(changeEvent){       // handles force offline change
        this.setState({ forceOfflinePaymentSelection: changeEvent.target.value });
    }

    handleAllowOfflineChange(changeEvent){       // handles allow offline change
        this.setState({ allowOfflinePaymentsSelection: changeEvent.target.value });
    }

    handleAcceptOfflineChange(changeEvent){       // handles accept offline change
        this.setState({ acceptOfflineSelection: changeEvent.target.value });
    }

    handleSignatureEntryChange(e){       // handles signature entry change
        this.setState({ signatureEntryLocation: e.target.value });
    }

    handleTipModeChange(e){     // handles tip mode change
        this.setState({ tipMode: e.target.value });
    }

    changeTipAmount(e){     // handles tip amount change for tip provided
        this.setState( {tipAmount: e.target.value });
    }

    changeSignatureThreshold(e){    // handles signature threshold change
        this.setState({ sigThreshold: e.target.value });
    }

    closePreAuth(){     // closes pre auth popup
        this.setState({ preAuthChosen : false });
    }

    saveTipSuggestions(tipSuggestion1, tipSuggestion2, tipSuggestion3, tipSuggestion4){       // saves tip suggestions to the store
        this.unfadeBackgroundSettings();
        this.setState({ showTipSuggestions: false });
        this.store.tipSuggestion1 = tipSuggestion1;
        this.store.tipSuggestion2 = tipSuggestion2;
        this.store.tipSuggestion3 = tipSuggestion3;
        this.store.tipSuggestion4 = tipSuggestion4;
    }

    showTipSuggestions(){
        this.fadeBackgroundSettings();
        this.setState({ showTipSuggestions: true });
    }

    addToOrder(id, title, price, tippable, taxable) {       // adds available item to order
        this.order.addItem(id, title, price, tippable, taxable);
        this.setState({
            orderItems:this.order.getDisplayItems(),
            subtotal:this.order.getPreTaxSubTotal(),
            tax: this.order.getTaxAmount(),
            total: this.order.getTotal(),
            payNoItems: false,
            saveNoItems: false,
        });
        if(this.saleMethod === 'PreAuth') {
            if(parseFloat(this.order.getTotal()) > parseFloat(this.state.preAuthAmount)){
                this.setState({ amountExceeded: true });
            }
        }
        this.updateDisplayOrder();
    }

    updateDisplayOrder(){       // updates display order on Clover device
        this.displayOrder.setLineItems(this.order.getDisplayItems());
        this.displayOrder.setSubtotal(`$${parseFloat(this.order.getPreTaxSubTotal()).toFixed(2)}`);
        this.displayOrder.setTax(`$${parseFloat(this.order.getTaxAmount()).toFixed(2)}`);
        this.displayOrder.setTotal(`$${parseFloat(this.order.getTotal()).toFixed(2)}`);
        this.cloverConnector.showDisplayOrder(this.displayOrder);
    }

    addDiscount(discount){      // adds discount to current order
        if(this.order.getDiscount() !== discount) {
            this.order.addDiscount(discount);
            this.setState({
                discount: discount,
                subtotal: this.order.getPreTaxSubTotal(),
                tax: this.order.getTaxAmount(),
                total: this.order.getTotal(),
                payNoItems: false,
                saveNoItems: false
            });
        }
        else{
            this.order.addDiscount(null);
            this.setState({
                discount: '',
                subtotal: this.order.getPreTaxSubTotal(),
                tax: this.order.getTaxAmount(),
                total: this.order.getTotal(),
                payNoItems: false,
                saveNoItems: false
            });
        }
        this.updateDisplayOrder()
    }

    newOrder(){     // start new order
        if(this.state.orderItems.length > 0 && !this.state.showSaleMethod && !this.state.showPaymentMethods && !this.state.showSettings) {
            let lastOrder = this.store.getLastOpenOrder();
            if(lastOrder === null) {
                this.order = new Order(this.store.getNextOrderId());
                this.store.addOrder(this.order);
                this.saleMethod = null;
                this.setState({ orderItems: this.order.getItems(), subtotal: 0.00, tax: 0.00, total: 0.00, makingSale: false, preAuth: null });
            }
            else{
                this.order = lastOrder;
                this.saleMethod = null;
                this.setState({ orderItems:this.order.getDisplayItems(), subtotal:this.order.getPreTaxSubTotal(), tax: this.order.getTaxAmount(), total: this.order.getTotal(), payNoItems: false, saveNoItems: false });
            }
            this.unfadeBackground();
            this.cloverConnector.showWelcomeScreen();
            this.store.setCurrentOrder(this.order);
        }
    }

    save(){     // saves current order
        this.setState({ payNoItems : false });
        if(this.state.orderItems.length > 0){
            this.newOrder();
        }
        else{
            this.setState({ saveNoItems : true });
        };
    }


    choosePaymentMethod(){     // displays popup to choose payment method
        this.setState({ showPaymentMethods: true, showSettings: false });
    }

    closePaymentMethods(){      // closes popup to choose payment method
        this.setState({ showPaymentMethods: false });
    }

    chooseSaleMethod(){     // display popup to choose a sale method
        //console.log(this.order);
        this.initSettings();
        if(this.state.orderItems.length > 0) {
            if(this.saleMethod === 'PreAuth'){
                this.setState({ makingSale: true, showSettings: true });
            }
            else{
                this.setState({ showSaleMethod: true, makingSale: true });
            }
            this.fadeBackground();
        }
        else{
            this.setState({ payNoItems : true, saveNoItems : false });
        }
    }

    closeSaleMethod(){      // closes popup to choose a sale method
        this.setState({ showSaleMethod: false, makingSale: false, fadeBackground: false });
    }

    closeSettings(){        // closes transaction settings popup
        this.setState({ showSettings: false, makingSale: false, fadeBackground: false });
    }

    exitPreAuth(){      // exits pre auth transaction
        this.setState({ promptPreAuth: false, fadeBackground: false });
        this.saleMethod = null;
    }

    saleChosen(){     // choose sale as sale method
        this.saleMethod = 'Sale';
        this.setState({ showSettings: true, showSaleMethod: false });
    }

    authChosen(){       // choose auth as sale method
        this.saleMethod = 'Auth';
        this.setState({ showSettings: true, showSaleMethod: false });
    }

    makeSale(){     // make sake
        this.saveSettings();
        if(this.saleMethod === 'Sale' || this.saleMethod === 'Auth'){
            this.cardChosen();
        }
        else if(this.saleMethod === 'Vaulted'){
            this.vaultedCardChosen();
        }
        else if(this.saleMethod === 'PreAuth'){
            this.setState({ showSettings: false });
            this.preAuth();
        }
        this.unfadeBackground();
    }

    preAuthContinue(){      // show transaction settings for preauth
        this.initSettings();
        this.setState({promptPreAuth: false });
        this.doPreAuth();
    }

    promptPreAuth(){       // show popup for preauth
        this.setState({ promptPreAuth: true });
        this.fadeBackground();
    }

    changePreAuthName(e){      // handle pre auth name change
        this.setState( {preAuthName : e.target.value });
    }

    changePreAuthAmount(e){     // handle pre auth amount change
        this.setState({ preAuthAmount : e.target.value });
    }

    isTipNull(tipSuggestion){
        if(tipSuggestion == null || !tipSuggestion.isEnabled || tipSuggestion.percentage.length < 1){
            return null;
        }
        return tipSuggestion;
    }

    setTipSuggestions(request){
        let tipSuggestion1 = this.isTipNull(this.store.tipSuggestion1);
        let tipSuggestion2 = this.isTipNull(this.store.tipSuggestion2);
        let tipSuggestion3 = this.isTipNull(this.store.tipSuggestion3);
        let tipSuggestion4 = this.isTipNull(this.store.tipSuggestion4);
        if(tipSuggestion1 == null & tipSuggestion2 == null & tipSuggestion3 == null & tipSuggestion4 == null){
            return;
        }
        else {
            request.setTipSuggestions([tipSuggestion1, tipSuggestion2, tipSuggestion3, tipSuggestion4]);
        }
    }


    doPreAuth(){        // make preauth transaction
        this.unfadeBackground();
        this.setState({promptPreAuth : false});
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new clover.sdk.remotepay.PreAuthRequest();
        request.setAmount(this.formatter.convertFromFloat(parseFloat(this.state.preAuthAmount).toFixed(2)));
        request.setExternalId(externalPaymentID);
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        request.setDisablePrinting(this.store.getDisablePrinting());
        request.setDisableReceiptSelection(this.store.getDisableReceiptOptions());
        request.setDisableDuplicateChecking(this.store.getDisableDuplicateChecking());
        if(this.card != null){
            request.setVaultedCard(this.card.card);
        }
        console.log('PreAuthRequest', request);
        this.cloverConnector.preAuth(request);
    }


    preAuth(){  // capture pre auth
        this.setState({showSettings: false, showPaymentMethods : false});
        let car = new clover.sdk.remotepay.CapturePreAuthRequest();
        car.paymentId = this.store.getPreAuthPaymentId();
        car.amount = this.formatter.convertFromFloat(this.order.getTotal());
        car.tipAmount = this.store.getTipAmount() == null ? 0 : this.store.getTipAmount();
        car.disablePrinting = this.store.getDisablePrinting();
        car.signatureEntryLocation = this.store.getSignatureEntryLocation();
        car.signatureThreshold = this.store.getSignatureThreshold();
        car.disableReceiptSelection = this.store.getDisableReceiptOptions();
        car.disableDuplicateChecking = this.store.getDisableDuplicateChecking();
        car.autoAcceptPaymentConfirmations = this.store.getAutomaticPaymentConfirmation();
        car.autoAcceptSignature = this.store.getAutomaticSignatureConfirmation();
        console.log('CapturePreAuthRequest', car);
        this.cloverConnector.capturePreAuth(car);
        this.saleMethod = null;
    }

    makeSaleRequest(){      //  returns transaction request for sale
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new clover.sdk.remotepay.SaleRequest();
        request.setExternalId(externalPaymentID);
        request.setAmount(this.formatter.convertFromFloat(this.order.getTotal()));
        request.setTippableAmount(this.formatter.convertFromFloat(this.order.getTippableAmount()));
        request.setTaxAmount(this.formatter.convertFromFloat(this.order.getTaxAmount()));
        request.setAllowOfflinePayment(this.store.getAllowOfflinePayments());
        request.setForceOfflinePayment(this.store.getForceOfflinePayments());
        request.setApproveOfflinePaymentWithoutPrompt(this.store.getApproveOfflinePaymentWithoutPrompt());
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        request.setSignatureEntryLocation(this.store.getSignatureEntryLocation());
        request.setSignatureThreshold(this.store.getSignatureThreshold());
        request.setTipMode(this.store.getTipMode());
        request.setTipAmount(this.store.getTipAmount());
        request.setDisablePrinting(this.store.getDisablePrinting());
        request.setDisableReceiptSelection(this.store.getDisableReceiptOptions());
        request.setDisableDuplicateChecking(this.store.getDisableDuplicateChecking());
        request.setAutoAcceptPaymentConfirmations(this.store.getAutomaticPaymentConfirmation());
        request.setAutoAcceptSignature(this.store.getAutomaticSignatureConfirmation());
        this.setTipSuggestions(request);
        if(this.card != null){
            request.setVaultedCard(this.card.card);
        }
        return request;
    }

    makeAuthRequest(){ //  returns transaction request for auth
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new clover.sdk.remotepay.AuthRequest();
        request.setAmount(this.formatter.convertFromFloat(this.order.getTotal()));
        request.setTippableAmount(this.formatter.convertFromFloat(this.order.getTippableAmount()));
        request.setTaxAmount(this.formatter.convertFromFloat(this.order.getTaxAmount()));
        request.setExternalId(externalPaymentID);
        request.setAllowOfflinePayment(this.store.getAllowOfflinePayments());
        request.setForceOfflinePayment(this.store.getForceOfflinePayments());
        request.setApproveOfflinePaymentWithoutPrompt(this.store.getApproveOfflinePaymentWithoutPrompt());
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        request.setSignatureEntryLocation(this.store.getSignatureEntryLocation());
        request.setSignatureThreshold(this.store.getSignatureThreshold());
        request.setDisablePrinting(this.store.getDisablePrinting());
        request.setDisableReceiptSelection(this.store.getDisableReceiptOptions());
        request.setDisableDuplicateChecking(this.store.getDisableDuplicateChecking());
        request.setAutoAcceptPaymentConfirmations(this.store.getAutomaticPaymentConfirmation());
        request.setAutoAcceptSignature(this.store.getAutomaticSignatureConfirmation());

        if(this.card != null){
            request.setVaultedCard(this.card.card);
        }
        return request;
    }

    cardChosen(){       // tells Clover device to make transaction
        this.setState({ showSettings: false, showPaymentMethods : false });
        if(this.saleMethod === 'Sale') {
            let request = this.makeSaleRequest();
            console.log('SaleRequest', request);
            this.cloverConnector.sale(request);
        }
        else if(this.saleMethod === 'Auth'){
            let request = this.makeAuthRequest();
            console.log('AuthRequest', request);
            this.cloverConnector.auth(request);
        }
        this.saleMethod = null;
    }

    vaultedCardChosen(){        // make sale with vaulted card
        this.setState({ showSettings: false, showPaymentMethods : false });
        this.store.setCurrentOrder(this.order);
        let request = this.makeSaleRequest();
        request.setVaultedCard(this.card.card);
        console.log('SaleRequest w/ Vaulted', request);
        this.cloverConnector.sale(request);
        this.saleMethod = null;
    }

    fadeBackground(){       // fade background for popups
        this.setState({ fadeBackground: true });
    }

    fadeBackgroundSettings(){
        this.setState({ fadeSettingsBackground: true});
    }

    unfadeBackground(){    // unfade background
        this.setState({ fadeBackground: false });
    }

    unfadeBackgroundSettings(){    // unfade background
        this.setState({ fadeSettingsBackground: false });
    }

    componentWillReceiveProps(newProps) {
        if(newProps.responseFail){
            this.setState({makingSale: false});
        }
        else if(newProps.saleFinished){
            if(this.state.makingSale) {
                this.setState({makingSale: false});
                this.newOrder();
            }
        }
        else if(newProps.preAuth === true){
            let preAuth = this.store.getPreAuth();
            preAuth.setName(this.state.preAuthName);
            this.setState({preAuth: this.store.getPreAuth(), makingSale: false});

        }
    }

    componentDidMount(){
        if(this.saleMethod === 'PreAuth'){
            this.promptPreAuth();
        }
        this.setState({
            orderItems:this.order.getDisplayItems(),
            subtotal: this.order.getPreTaxSubTotal(),
            tax: this.order.getTaxAmount(),
            total: this.order.getTotal(),
            payNoItems: false,
            saveNoItems: false,
        });
        this.updateDisplayOrder();
    }

    render(){
        let cardText = 'Card';
        const discount = this.state.discount.name;
        let fadeBackground = this.state.fadeBackground;
        let fadeSettingsBackground = this.state.fadeSettingsBackground;
        let isSale = false;
        let newOrder = 'New Order';
        let notPreAuth = true;
        let settingType = 'Sale';
        const showPayMethods = this.state.showPaymentMethods;
        let showPreAuth = false;
        let showPreAuthHeader = false;
        const preAuthAmount =  this.state.preAuthAmount !== undefined ? this.formatter.convertToFloatDisplay(this.state.preAuthAmount) : '';
        const tipAmount = this.state.tipAmount !== undefined ? this.formatter.convertToFloatDisplay(this.state.tipAmount) : '';
        const showSaleMethods = this.state.showSaleMethod;
        let showTipSuggestions = this.state.showTipSuggestions;
        let showVaultedCard = this.state.areVaultedCards;
        let vaultedCard = false;

        if(this.saleMethod !== null){
            if(this.saleMethod === 'Sale'){
                newOrder = 'New Sale';
                isSale = true;
            }
            else if(this.saleMethod === 'Auth'){
                newOrder = 'New Authorization';
                settingType = 'Auth';
            }
            else if(this.saleMethod === 'Vaulted'){
                newOrder = 'New Customer (Vaulted Card)';
                isSale = true;
                vaultedCard = true;
            }
            else if(this.saleMethod === 'PreAuth'){
                newOrder = 'New Tab (PreAuth)';
                notPreAuth = false;
                settingType = 'PreAuth';
            }
        }
        let orderItems = this.state.orderItems;
        const promptPreAuth = this.state.promptPreAuth;
        const subtotal = this.formatter.convertToFloatDisplay(this.state.subtotal);
        const tax = this.formatter.convertToFloatDisplay(this.state.tax);
        const total = this.formatter.convertToFloatDisplay(this.state.total);
        const preAuthPopup = this.state.preAuthChosen;
        let tipProvided = (this.state.tipMode === 'TIP_PROVIDED');
        let sigThreshold = (this.state.signatureEntryLocation !== 'NONE' && this.state.signatureEntryLocation !== 'ON_PAPER');
        let image = 'images/tender_default.png';
        if(this.state.preAuth !== null) {
            showPreAuthHeader = true;
            image = this.imageHelper.getCardTypeImage(this.state.preAuth.preAuth.payment.cardTransaction.cardType);
        }
        let amountExceeded = this.state.amountExceeded;
        let amountSpan = amountExceeded ? 'red_text' : '';

        return(
            <div className="register">
                {fadeBackground &&
                <div className="popup_opaque"></div>
                }
                {fadeSettingsBackground &&
                <div className="popup_opaque_settings"></div>
                }
                {promptPreAuth &&
                <div className="popup popup_container">
                    <div className="close_popup" onClick={this.exitPreAuth}>X</div>
                    <div className="preauth_prompt">
                        <div className="row center row_padding">
                            <div className="input_title">Enter Name for PreAuth:</div>
                            <input className="input_input" type="text" value={this.state.preAuthName} onChange={this.changePreAuthName}/>
                        </div>
                        <div className="row center row_padding">
                            <div className="input_title">Enter Amount for PreAuth:</div>
                            <input className="input_input" type="text" value={preAuthAmount} onChange={this.changePreAuthAmount}/>
                        </div>
                        <div className="row center margin_top">
                            <ButtonNormal title="Continue" extra="preauth_button" color="white" onClick={this.preAuthContinue} />
                        </div>
                    </div>
                </div>
                }
                {showTipSuggestions &&
                <TipSuggestions tipSuggestion1={this.store.tipSuggestion1} tipSuggestion2={this.store.tipSuggestion2} tipSuggestion3={this.store.tipSuggestion3} tipSuggestion4={this.store.tipSuggestion4} onClick={this.saveTipSuggestions}/>
                }
                {this.state.showSettings &&
                <div className="settings">
                    <div className="close_popup" onClick={this.closeSettings}>X</div>
                    <h2 className="left_margin">{settingType} Settings</h2>
                    <div className="transaction_settings">
                        <div className="settings_left settings_side">
                            {notPreAuth &&
                            <div className="settings_section">
                                <h3>Card Options</h3>
                                <div className="settings_row">
                                    <div className="setting_title">Manual</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="manual_entry" checked={this.state.manualCardEntry}
                                               onChange={this.toggleManual}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Swipe</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="swipe_entry" checked={this.state.swipeCardEntry}
                                               onChange={this.toggleSwipe}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Chip</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="chip_entry" checked={this.state.chipCardEntry}
                                               onChange={this.toggleChip}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Contactless</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="contactless_entry"
                                               checked={this.state.contactlessCardEntry}
                                               onChange={this.toggleContactless}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                            </div>
                            }
                            {notPreAuth &&
                            <div className="settings_section">
                                <h3>Offline Payments</h3>
                                <div className="settings_row">
                                    <div>Force Offline Payment</div>
                                    <form className="row">
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="default" checked={this.state.forceOfflinePaymentSelection === 'default'} onChange={this.handleForceOfflineChange}/>
                                            <div>Default</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="true" checked={this.state.forceOfflinePaymentSelection === 'true'} onChange={this.handleForceOfflineChange}/>
                                            <div>Yes</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="false" checked={this.state.forceOfflinePaymentSelection === 'false'} onChange={this.handleForceOfflineChange}/>
                                            <div>No</div>
                                        </div>
                                    </form>
                                </div>
                                <div className="settings_row">
                                    <div>Allow Offline Payments</div>
                                    <form className="row">
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="default" checked={this.state.allowOfflinePaymentsSelection === 'default'} onChange={this.handleAllowOfflineChange}/>
                                            <div className="row">Default</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="true" checked={this.state.allowOfflinePaymentsSelection === 'true'} onChange={this.handleAllowOfflineChange}/>
                                            <div className="row">Yes</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="false" checked={this.state.allowOfflinePaymentsSelection === 'false'} onChange={this.handleAllowOfflineChange}/>
                                            <div className="row">No</div>
                                        </div>
                                    </form>
                                </div>

                                <div className="settings_row">
                                    <div>Accept Offline w/o Prompt</div>
                                    <form className="row">
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="default" checked={this.state.acceptOfflineSelection === 'default'} onChange={this.handleAcceptOfflineChange}/>
                                            <div className="row">Default</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="true" checked={this.state.acceptOfflineSelection === 'true'} onChange={this.handleAcceptOfflineChange}/>
                                            <div>Yes</div>
                                        </div>
                                        <div className="row">
                                            <input className="radio_button" type="radio" value="false" checked={this.state.acceptOfflineSelection === 'false'} onChange={this.handleAcceptOfflineChange}/>
                                            <div>No</div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            }
                            {!notPreAuth &&
                            <div className="settings_section">
                                <h3>Signatures</h3>
                                <div className="settings_row">
                                    <div>Signature Entry Location</div>
                                    <select className="setting_select" value={this.state.signatureEntryLocation} onChange={this.handleSignatureEntryChange}>
                                        <option value="DEFAULT">Default</option>
                                        <option value="ON_SCREEN">On Screen</option>
                                        <option value="ON_PAPER">On Paper</option>
                                        <option value="NONE">None</option>
                                    </select>
                                </div>
                                {sigThreshold &&
                                <div className="settings_row">
                                    <div>Signature Threshold</div>
                                    <div>
                                        <span className="setting_span">$</span>
                                        <input className="setting_input" type="text" value={this.state.sigThreshold} onChange={this.changeSignatureThreshold}/>
                                    </div>
                                </div>
                                }
                            </div>
                            }

                            {isSale &&
                            <div className="settings_section">
                                <h3>Tips</h3>
                                <div className="settings_row">
                                    <div>Tip Mode</div>
                                    <select className="setting_select" value={this.state.tipMode} onChange={this.handleTipModeChange}>
                                        <option value="DEFAULT">Default</option>
                                        <option value="TIP_PROVIDED">Tip Provided</option>
                                        <option value="ON_SCREEN_BEFORE_PAYMENT">On Screen Before Payment</option>
                                        <option value="NO_TIP">No Tip</option>
                                    </select>
                                </div>
                                {tipProvided &&
                                <div className="settings_row">
                                    <div>Tip Amount</div>
                                    <input className="setting_input" type="text" value={tipAmount} onChange={this.changeTipAmount}/>

                                </div>
                                }
                                <ButtonNormal title="Tip Suggestions" color="white"  extra="refund_button" onClick={this.showTipSuggestions}/>
                            </div>
                            }

                        </div>
                        <div className="settings_right settings_side">
                            {notPreAuth &&
                            <div className="settings_section">
                                <h3>Signatures</h3>
                                <div className="settings_row">
                                    <div>Signature Entry Location</div>
                                    <select className="setting_select" value={this.state.signatureEntryLocation} onChange={this.handleSignatureEntryChange}>
                                        <option value="DEFAULT">Default</option>
                                        <option value="ON_SCREEN">On Screen</option>
                                        <option value="ON_PAPER">On Paper</option>
                                        <option value="NONE">None</option>
                                    </select>
                                </div>

                                {sigThreshold &&
                                <div className="settings_row">
                                    <div>Signature Threshold</div>
                                    <div>
                                        <span className="setting_span">$</span>
                                        <input className="setting_input" type="text" value={this.state.sigThreshold} onChange={this.changeSignatureThreshold}/>
                                    </div>
                                </div>
                                }
                            </div>
                            }
                            <div className="settings_section">
                                <h3>Payment Acceptance</h3>
                                <div className="settings_row">
                                    <div className="setting_title">Disable Duplicate Payment Checking</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={this.state.disableDuplicate} onChange={this.toggleDisableDuplicate}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>

                                <div className="settings_row">
                                    <div className="setting_title">Disable Device Receipt Options Screen</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={this.state.disableReceipt} onChange={this.toggleDisableReceipt}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>

                                <div className="settings_row">
                                    <div className="setting_title">Disable Device Printing</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={this.state.disablePrinting} onChange={this.toggleDisablePrinting}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>

                                <div className="settings_row">
                                    <div className="setting_title">Automatically Confirm Signature</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={this.state.confirmSignature} onChange={this.toggleConfirmSignature}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>

                                <div className="settings_row">
                                    <div className="setting_title">Automatically Confirm Payment Challenges</div>
                                    <label className="switch">
                                        <input type="checkbox" checked={this.state.confirmChallenges} onChange={this.toggleConfirmChallenges}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="settings_actions">
                        <ButtonNormal extra="refund_button" title="Continue" color="white" onClick={this.makeSale}/>
                    </div>
                </div>
                }
                {preAuthPopup &&
                <div className="preauth_popup popup">
                    Please swipe your card
                    <div className="preauth_button_row">
                        <ButtonNormal title="Cancel" color="red" onClick={this.closePreAuth} extra="preauth_button"/>
                        <ButtonNormal title="Card Swiped" color="white" onClick={this.openPreAuth} extra="preauth_button"/>
                    </div>
                </div>}
                {showSaleMethods &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closeSaleMethod}>X</div>
                    <div className="payment_methods">
                        <ButtonNormal title="Sale" onClick={this.saleChosen} extra="button_large" color="white"/>
                        <ButtonNormal title="Auth" onClick={this.authChosen} extra="button_large" color="white"/>
                    </div>
                </div>}
                {showPayMethods &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closePaymentMethods}>X</div>
                    <div className="payment_methods">
                        <ButtonNormal title={cardText} onClick={this.cardChosen} extra="button_large" color="white"/>
                        {showVaultedCard && <ButtonNormal title="Vaulted Card" onClick={this.vaultedCardChosen} extra="button_large" color="white"/>}
                        {showPreAuth && <ButtonNormal title="Existing PreAuth" onClick={this.preAuthChosen} extra="button_large" color="white"/>}
                    </div>
                </div>}
                <div className="register_left">
                    <h3>{newOrder}</h3>
                    {vaultedCard &&
                    <div className="row sale_header">
                        <User/>
                        <div className="order_detail_column">
                            <div>Name: {this.card.name}</div>
                            <div>Card: {this.card.card.first6}xxxxxx{this.card.card.last4}</div>
                        </div>
                    </div>
                    }
                    {showPreAuthHeader &&
                    <div className="row sale_header">
                        <img className="order_detail_icon" src={image}/>
                        <div className="order_detail_column">
                            <div>Name: {this.state.preAuth.name}</div>
                            <div className="preAuth_amount"><span className={amountSpan}> Amount: ${this.state.preAuthAmount}</span>
                                {amountExceeded && <span className="amount_tooltip">The total exceeds the PreAuth amount, payment may not go through</span>}
                            </div>
                            <div>Card: {this.state.preAuth.preAuth.payment.cardTransaction.cardType} {this.state.preAuth.preAuth.payment.cardTransaction.last4}</div>
                        </div>
                    </div>
                    }
                    <div className="register_sale_items">
                        <h3>Current Order: </h3>
                        <div className="order_items">
                            {orderItems.map(function (orderItem, i) {
                                return <RegisterLineItem key={'orderItem-'+i} quantity={orderItem.quantity}  title={orderItem.name} price={orderItem.price}/>
                            }, this)}
                        </div>
                        {this.state.payNoItems && <div>You cannot make a sale with no items</div>}
                        {this.state.saveNoItems && <div>You cannot save an order with no items</div>}
                    </div>
                    <div className="register_actions">

                        <RegisterLine left="Discounts:" right={discount}/>
                        <RegisterLine left="Subtotal:" right={subtotal}/>
                        <RegisterLine left="Tax:" right={tax}/>
                        <RegisterLine left="Total:" right={total} extraLeft="total"/>
                        <div className="register_buttons">
                            <ButtonNormal title="Save" color="green" extra="register_button left" onClick={this.save}/>
                            <ButtonNormal title="Pay" color="green" extra="register_button right" onClick={this.chooseSaleMethod}/>
                        </div>
                    </div>
                </div>
                <div className="register_right">
                    {!this.state.makingSale &&
                    <div className="column_plain full_height">
                        <div className="register_items">
                            {data.map((item, i) => {
                                return <AvailableItem key={'item-' + i} item={item} onClick={this.addToOrder}/>
                            })}
                        </div>
                        <div className="filler_space"></div>
                        <div className="discount_items">
                            <div className="discount_title"><strong>Discounts:</strong></div>
                            {this.store.discounts.map((discount, i) => {
                                return <AvailableDiscount key={'discount-'+i} discount={discount} onClick={this.addDiscount}/>;
                            })}
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

