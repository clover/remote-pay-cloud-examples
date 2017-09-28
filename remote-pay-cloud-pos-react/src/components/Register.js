import React from 'react';
import ButtonNormal from "./ButtonNormal";
import RegisterLine from "./RegisterLine";
import AvailableItem from "./AvailableItem";
import AvailableDiscount from "./AvailableDiscount";
const data = require ("../../src/items.js");
import Order from '../models/Order';
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import OrderPayment from "../models/OrderPayment";
import RegisterLineItem from "./RegisterLineItem";
import sdk from 'remote-pay-cloud-api';
import clover from 'remote-pay-cloud';
import ImageHelper from "../utils/ImageHelper";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderItems: [],
            discount: "",
            showSaleMethod: false,
            areVaultedCards: false,
            makingSale: false,
            subtotal : 0,
            preAuthChosen: false,
            payNoItems: false,
            saveNoItems: false,
            showSettings: false,
            showPaymentMethods: false,
            tax: 0,
            total: 0,
            manualCardEntry : false,
            swipeCardEntry : false,
            chipCardEntry : false,
            contactlessCardEntry : false,
            forceOfflinePaymentSelection: 'default',
            allowOfflinePaymentsSelection: 'default',
            acceptOfflineSelection: 'default',
            signatureEntryLocation: 'DEFAULT',
            tipMode: 'DEFAULT',
            tipAmount: '0.00',
            sigThreshold: '0.00',
            disableDuplicate: false,
            disableReceipt: false,
            disablePrinting: false,
            confirmSignature: true,
            confirmChallenges: false,
            promptPreAuth: false,
            preAuthName: '',
            preAuthAmount: "50.00",
            preAuth: null,
            responseFail: false,
            fadeBackground: false,
            amountExceeded: false
        };
        this.imageHelper = new ImageHelper();
        this.setStatus = this.props.setStatus;
        this.closeStatus = this.props.closeStatus;
        this.promptPreAuth = this.promptPreAuth.bind(this);
        this.doPreAuth = this.doPreAuth.bind(this);
        this.changePreAuthName = this.changePreAuthName.bind(this);
        this.changePreAuthAmount = this.changePreAuthAmount.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.addDiscount = this.addDiscount.bind(this);
        this.newOrder = this.newOrder.bind(this);
        this.chooseSaleMethod = this.chooseSaleMethod.bind(this);
        this.saleChosen = this.saleChosen.bind(this);
        this.authChosen = this.authChosen.bind(this);
        this.cardChosen = this.cardChosen.bind(this);
        this.vaultedCardChosen = this.vaultedCardChosen.bind(this);
        this.closePreAuth = this.closePreAuth.bind(this);
        this.exitPreAuth = this.exitPreAuth.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
        this.choosePaymentMethod = this.choosePaymentMethod.bind(this);
        this.closePaymentMethods = this.closePaymentMethods.bind(this);
        this.closeSaleMethod = this.closeSaleMethod.bind(this);
        this.makeSale = this.makeSale.bind(this);
        this.save = this.save.bind(this);
        this.preAuth = this.preAuth.bind(this);
        this.initSettings = this.initSettings.bind(this);
        this.toggleManual = this.toggleManual.bind(this);
        this.toggleSwipe = this.toggleSwipe.bind(this);
        this.toggleChip = this.toggleChip.bind(this);
        this.toggleDisableDuplicate = this.toggleDisableDuplicate.bind(this);
        this.toggleDisableReceipt = this.toggleDisableReceipt.bind(this);
        this.toggleDisablePrinting = this.toggleDisablePrinting.bind(this);
        this.toggleConfirmChallenges = this.toggleConfirmChallenges.bind(this);
        this.toggleConfirmSignature = this.toggleConfirmSignature.bind(this);
        this.toggleContactless = this.toggleContactless.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.handleForceOfflineChange = this.handleForceOfflineChange.bind(this);
        this.handleAllowOfflineChange = this.handleAllowOfflineChange.bind(this);
        this.handleAcceptOfflineChange = this.handleAcceptOfflineChange.bind(this);
        this.handleSignatureEntryChange = this.handleSignatureEntryChange.bind(this);
        this.handleTipModeChange = this.handleTipModeChange.bind(this);
        this.changeTipAmount = this.changeTipAmount.bind(this);
        this.changeSignatureThreshold = this.changeSignatureThreshold.bind(this);
        this.preAuthContinue = this.preAuthContinue.bind(this);
        this.store = this.props.store;
        this.saleMethod = null;
        this.formatter = new CurrencyFormatter;
        this.displayOrder = new sdk.order.DisplayOrder();
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        if(this.store.getCurrentOrder() === null || this.store.getCurrentOrder().getStatus() !== "OPEN") {
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
            if(this.saleMethod === 'Vaulted'){
                this.card = this.props.location.state.card;
            }
        }
    }

    initSettings(){
        let manual = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL) == clover.CardEntryMethods.CARD_ENTRY_METHOD_MANUAL);
        let swipe = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE) == clover.CardEntryMethods.CARD_ENTRY_METHOD_MAG_STRIPE);
        let chip = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT) == clover.CardEntryMethods.CARD_ENTRY_METHOD_ICC_CONTACT);
        let contactless = ((this.store.cardEntryMethods & clover.CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS) == clover.CardEntryMethods.CARD_ENTRY_METHOD_NFC_CONTACTLESS);
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

    saveSettings(){
        //card entry
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
        this.store.setTipAmount(this.formatter.convertFromFloat(parseFloat(this.state.tipAmount).toFixed(2)));
        this.store.setSignatureThreshold(this.formatter.convertFromFloat(parseFloat(this.state.sigThreshold).toFixed(2)));
        this.store.setDisableDuplicateChecking(this.state.disableDuplicate);
        this.store.setDisableReceiptOptions(this.state.disableReceipt);
        this.store.setDisablePrinting(this.state.disablePrinting);
        this.store.setAutomaticSignatureConfirmation(this.state.confirmSignature);
        this.store.setAutomaticPaymentConfirmation(this.state.confirmChallenges);

    }

    getOfflineValueForStore(input){
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

    getOfflineValueForState(input){
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

    getSignatureValueForStore(input){
        if(input === 'DEFAULT'){
            return undefined;
        }
        if(input === 'ON_SCREEN'){
            return sdk.payments.DataEntryLocation.ON_SCREEN;
        }
        if(input === 'ON_PAPER'){
            this.setState({sigThreshold: '0.00'});
            return sdk.payments.DataEntryLocation.ON_PAPER;
        }
        if(input === 'NONE'){
            this.setState({sigThreshold: '0.00'});
            return sdk.payments.DataEntryLocation.NONE;
        }
    }

    getSignatureValueForState(input){
        if(input === undefined){
            return 'DEFAULT';
        }
        if(input === sdk.payments.DataEntryLocation.ON_SCREEN){
            return 'ON_SCREEN';
        }
        if(input === sdk.payments.DataEntryLocation.ON_PAPER){
            return 'ON_PAPER';
        }
        if(input === sdk.payments.DataEntryLocation.NONE){
            return 'NONE';
        }
    }

    getTipValueForStore(input){
        if(input === 'DEFAULT'){
            this.setState({tipAmount: '0.00'});
            return undefined;
        }
        if(input === 'NO_TIP'){
            this.setState({tipAmount: '0.00'});
            return sdk.payments.TipMode.NO_TIP;
        }
        if(input === 'ON_SCREEN_BEFORE_PAYMENT'){
            this.setState({tipAmount: '0.00'});
            return sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT;
        }
        if(input === 'TIP_PROVIDED'){
            return sdk.payments.TipMode.TIP_PROVIDED;
        }
    }

    getTipValueForState(input){
        if(input === undefined){
            return 'DEFAULT';
        }
        if(input === sdk.payments.TipMode.NO_TIP){
            return 'NO_TIP';
        }
        if(input === sdk.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT){
            return 'ON_SCREEN_BEFORE_PAYMENT';
        }
        if(input === sdk.payments.TipMode.TIP_PROVIDED){
            return 'TIP_PROVIDED';
        }
    }


    toggleManual(){
        this.setState({manualCardEntry : !this.state.manualCardEntry});
    }

    toggleSwipe(){
        this.setState({swipeCardEntry : !this.state.swipeCardEntry});
    }

    toggleChip(){
        this.setState({chipCardEntry : !this.state.chipCardEntry});
    }

    toggleContactless(){
        this.setState({contactlessCardEntry : !this.state.contactlessCardEntry});
    }

    toggleDisableDuplicate(){
        this.setState({disableDuplicate : !this.state.disableDuplicate});
    }

    toggleDisableReceipt(){
        this.setState({disableReceipt : !this.state.disableReceipt});
    }

    toggleDisablePrinting(){
        this.setState({disablePrinting : !this.state.disablePrinting});
    }

    toggleConfirmSignature(){
        this.setState({confirmSignature : !this.state.confirmSignature});
    }

    toggleConfirmChallenges(){
        this.setState({confirmChallenges : !this.state.confirmChallenges});
    }

    handleForceOfflineChange(changeEvent){
        this.setState({
            forceOfflinePaymentSelection: changeEvent.target.value
        });
    }

    handleAllowOfflineChange(changeEvent){
        this.setState({
            allowOfflinePaymentsSelection: changeEvent.target.value
        });
    }

    handleAcceptOfflineChange(changeEvent){
        this.setState({
            acceptOfflineSelection: changeEvent.target.value
        });
    }

    handleSignatureEntryChange(e){
        this.setState({signatureEntryLocation: e.target.value});
    }

    handleTipModeChange(e){
        this.setState({tipMode: e.target.value});
    }

    changeTipAmount(e){
        this.setState({tipAmount: e.target.value});
    }

    changeSignatureThreshold(e){
        this.setState({sigThreshold: e.target.value});
    }

    closePreAuth(){
        this.setState({ preAuthChosen : false});
    }

    addToOrder(id, title, price, tippable, taxable) {
        this.order.addItem(id, title, price, tippable, taxable);
        this.setState({
            orderItems:this.order.getDisplayItems(),
            subtotal:this.order.getPreTaxSubTotal(),
            tax: this.order.getTaxAmount(),
            total: this.order.getTotal(),
            payNoItems: false,
            saveNoItems: false,
        });
        if(this.saleMethod === "PreAuth") {
            if(parseFloat(this.order.getTotal()) > parseFloat(this.state.preAuthAmount)){
                this.setState({amountExceeded: true});
            }
        }
        this.updateDisplayOrder();
    }

    updateDisplayOrder(){
        this.displayOrder.setLineItems(this.order.getDisplayItems());
        this.displayOrder.setSubtotal("$"+parseFloat(this.order.getPreTaxSubTotal()).toFixed(2));
        this.displayOrder.setTax("$"+parseFloat(this.order.getTaxAmount()).toFixed(2));
        this.displayOrder.setTotal("$"+parseFloat(this.order.getTotal()).toFixed(2));
        this.cloverConnector.showDisplayOrder(this.displayOrder);
    }

    addDiscount(discount){
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
                discount: "",
                subtotal: this.order.getPreTaxSubTotal(),
                tax: this.order.getTaxAmount(),
                total: this.order.getTotal(),
                payNoItems: false,
                saveNoItems: false
            });
        }
        this.updateDisplayOrder()
    }

    newOrder(){
        if(this.state.orderItems.length > 0 && !this.state.showSaleMethod && !this.state.showPaymentMethods && !this.state.showSettings) {
            let lastOrder = this.store.getLastOpenOrder();
            if(lastOrder === null) {
                this.order = new Order(this.store.getNextOrderId());
                this.store.addOrder(this.order);
                this.saleMethod = null;
                this.setState({
                    orderItems: this.order.getItems(),
                    subtotal: 0.00,
                    tax: 0.00,
                    total: 0.00,
                    makingSale: false,
                    preAuth: null
                });
            }
            else{
                this.order = lastOrder;
                this.saleMethod = null;
                this.setState({
                    orderItems:this.order.getDisplayItems(),
                    subtotal:this.order.getPreTaxSubTotal(),
                    tax: this.order.getTaxAmount(),
                    total: this.order.getTotal(),
                    payNoItems: false,
                    saveNoItems: false,
                });
            }
            this.unfadeBackground();
            this.store.setCurrentOrder(this.order);
        }
    }

    save(){
        this.setState({payNoItems : false});
        if(this.state.orderItems.length > 0){
            this.newOrder();
        }
        else{
            this.setState({saveNoItems : true});
        };
    }


    choosePaymentMethod(){
        this.setState({showPaymentMethods: true, showSettings: false});
    }

    closePaymentMethods(){
        this.setState({showPaymentMethods: false});
    }

    chooseSaleMethod(){
        //console.log(this.order);
        this.initSettings();
        if(this.state.orderItems.length > 0) {
            if(this.saleMethod === "Vaulted") {
                this.setState({showSettings: true, makingSale: true});
            }
            else if(this.saleMethod === "PreAuth"){
                this.setState({makingSale: true});
                console.log("PREAUTH");
                this.preAuth();
            }
            else{
                this.setState({showSaleMethod: true, makingSale: true});
            }
            this.fadeBackground();
        }
        else{
            this.setState({payNoItems : true, saveNoItems : false});
        }
    }

    closeSaleMethod(){
        this.setState({showSaleMethod: false, makingSale: false, fadeBackground: false});
    }

    closeSettings(){
        this.setState({showSettings: false, makingSale: false, fadeBackground: false});
    }

    exitPreAuth(){
        this.setState({promptPreAuth: false, fadeBackground: false});
        this.saleMethod = null;
    }

    saleChosen(){
        this.saleMethod = 'Sale';
        this.setState({showSettings: true, showSaleMethod: false});
    }

    authChosen(){
        this.saleMethod = "Auth";
        this.setState({showSettings: true, showSaleMethod: false});
    }

    makeSale(){
        this.saveSettings();
        if(this.saleMethod === 'Sale' || this.saleMethod === 'Auth'){
            this.cardChosen();
        }
        else if(this.saleMethod === 'Vaulted'){
            this.vaultedCardChosen();
        }
        else if(this.saleMethod === 'PreAuth'){
            this.setState({showSettings: false});
            this.doPreAuth();
        }
        this.unfadeBackground();
    }

    preAuthContinue(){
        this.initSettings();
        this.setState({showSettings: true, promptPreAuth: false});
    }

    promptPreAuth(){
        this.setState({promptPreAuth: true});
        this.fadeBackground();
    }

    changePreAuthName(e){
        this.setState({preAuthName : e.target.value});
    }

    changePreAuthAmount(e){
        this.setState({preAuthAmount : e.target.value});
    }


    doPreAuth(){
        this.unfadeBackground();
        this.setState({promptPreAuth : false});
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new sdk.remotepay.PreAuthRequest();
        request.setAmount(this.formatter.convertFromFloat(parseFloat(this.state.preAuthAmount).toFixed(2)));
        request.setExternalId(externalPaymentID);
        request.setCardEntryMethods(this.store.getCardEntryMethods());
        request.setDisablePrinting(this.store.getDisablePrinting());
        request.setSignatureEntryLocation(this.store.getSignatureEntryLocation());
        request.setSignatureThreshold(this.store.getSignatureThreshold());
        request.setDisableReceiptSelection(this.store.getDisableReceiptOptions());
        request.setDisableDuplicateChecking(this.store.getDisableDuplicateChecking());
        console.log(request);
        this.cloverConnector.preAuth(request);
    }


    preAuth(){
        this.setState({showSettings: false, showPaymentMethods : false});
        let car = new sdk.remotepay.CapturePreAuthRequest();
        let preAuth = this.store.getPreAuth();
        car.paymentId = this.store.getPreAuthPaymentId();
        car.amount = this.formatter.convertFromFloat(this.order.getTotal());
        this.cloverConnector.capturePreAuth(car);
        this.saleMethod = null;
    }

    makeSaleRequest(){
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new sdk.remotepay.SaleRequest();
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
        return request;
    }

    makeAuthRequest(){
        let externalPaymentID = clover.CloverID.getNewId();
        this.store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new sdk.remotepay.AuthRequest();
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
        return request;
    }

    cardChosen(){
        this.setState({showSettings: false, showPaymentMethods : false});
        if(this.saleMethod === 'Sale') {
            let request = this.makeSaleRequest();
            console.log(request);
            this.cloverConnector.sale(request);
        }
        else if(this.saleMethod === 'Auth'){
            let request = this.makeAuthRequest();
            console.log(request);
            this.cloverConnector.auth(request);
        }
        this.saleMethod = null;
    }

    vaultedCardChosen(){
        this.setState({showSettings: false, showPaymentMethods : false});
        this.store.setCurrentOrder(this.order);
        let request = this.makeSaleRequest();
        request.setVaultedCard(this.card.card);
        this.cloverConnector.sale(request);
        this.saleMethod = null;
    }

    fadeBackground(){
        this.setState({fadeBackground: true});
    }

    unfadeBackground(){
        this.setState({fadeBackground: false});
    }

    componentWillReceiveProps(newProps) {
        if(newProps.responseFail){
            this.setState({makingSale: false});
        }
        else if(newProps.saleFinished){
            //console.log('received newProps: ',newProps, this.state);
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
            subtotal:this.order.getPreTaxSubTotal(),
            tax: this.order.getTaxAmount(),
            total: this.order.getTotal(),
            payNoItems: false,
            saveNoItems: false,
        });
        this.updateDisplayOrder();
    }

    render(){
        let fadeBackground = this.state.fadeBackground;
        const showSaleMethods = this.state.showSaleMethod;
        const showPayMethods = this.state.showPaymentMethods;
        const discount = this.state.discount.name;
        let newOrder = 'New Order';
        let cardText = "Card";
        let showVaultedCard = this.state.areVaultedCards;
        let showPreAuth = false;
        let notPreAuth = true;
        let showPreAuthHeader = false;
        let isSale = false;
        let settingType = "Sale";
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
                newOrder = "New Tab (PreAuth)";
                notPreAuth = false;
                settingType = "PreAuth";
            }
        }
        let orderItems = this.state.orderItems;
        const promptPreAuth = this.state.promptPreAuth;
        const subtotal = "$"+parseFloat(this.state.subtotal).toFixed(2);
        const tax = "$"+parseFloat(this.state.tax).toFixed(2);
        const total = "$"+parseFloat(this.state.total).toFixed(2);
        const preAuthPopup = this.state.preAuthChosen;
        let tipProvided = (this.state.tipMode === "TIP_PROVIDED");
        let sigThreshold = (this.state.signatureEntryLocation !== 'NONE' && this.state.signatureEntryLocation !== 'ON_PAPER');
        let preAuth = null;
        let image = "images/tender_default.png";
        if(this.state.preAuth !== null) {
            showPreAuthHeader = true;
            image = this.imageHelper.getCardTypeImage(this.state.preAuth.preAuth.payment.cardTransaction.cardType);
        }
        let amountSpan = "";
        let amountExceeded = this.state.amountExceeded;
        if(amountExceeded){
            amountSpan = "red_text";
        }

        return(
            <div className="register">
                {fadeBackground &&
                <div className="popup_opaque"></div>
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
                            <div className="span_container">
                                <span className="input_span">$</span>
                                <input className="input_dollar_sign" type="text" value={this.state.preAuthAmount} onChange={this.changePreAuthAmount}/>
                            </div>
                        </div>
                        <div className="row center margin_top">
                            <ButtonNormal title="Continue" extra="preauth_button" color="white" onClick={this.preAuthContinue} />
                        </div>
                    </div>
                </div>
                }
                {this.state.showSettings &&
                <div className="settings">
                    <div className="close_popup" onClick={this.closeSettings}>X</div>
                    <h2 className="left_margin">{settingType} Settings</h2>
                    <div className="transaction_settings">
                        <div className="settings_left settings_side">
                            <div className="settings_section">
                                <h3>Card Options</h3>
                                <div className="settings_row">
                                    <div className="setting_title">Manual</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="manual_entry" checked={this.state.manualCardEntry} onChange={this.toggleManual}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Swipe</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="swipe_entry" checked={this.state.swipeCardEntry} onChange={this.toggleSwipe}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Chip</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="chip_entry" checked={this.state.chipCardEntry} onChange={this.toggleChip}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                                <div className="settings_row">
                                    <div className="setting_title">Contactless</div>
                                    <label className="switch">
                                        <input type="checkbox" ref="contactless_entry" checked={this.state.contactlessCardEntry} onChange={this.toggleContactless}/>
                                        <span className="slider round"/>
                                    </label>
                                </div>
                            </div>
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
                                    <div>
                                        <span className="setting_span">$</span>
                                        <input className="setting_input" type="text" value={this.state.tipAmount} onChange={this.changeTipAmount}/>
                                    </div>
                                </div>
                                }
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
                        <img className="order_detail_icon" src="images/user.png"/>
                        <div className="order_detail_column">
                            <div>{this.card.name}</div>
                            <div>{this.card.card.first6}xxxxxx{this.card.card.last4}</div>
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
                        <div className="filler_space"/>
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

