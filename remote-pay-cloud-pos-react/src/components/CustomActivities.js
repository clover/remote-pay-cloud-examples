import CustomPayloadMessage from '../messages/CustomPayloadMessage';
import ButtonNormal from './ButtonNormal';
import PayloadMessage from './PayloadMessage';
import React from 'react';
import clover from 'remote-pay-cloud';

export default class CustomActivities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityPayload: '',
            customActivityAction: 'com.clover.loyalty.example.BurgerBucksCFPActivity',
            finalPayload: '',
            initialPayload: '',
            messages: [],
            nonBlocking: true,
            payloadToSend: '',
            selectedValue : 'BasicExample',
            sendPayloadDisabled: true,
            startActivityDisabled: false,
            showMessageButton : false
        };

        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.CUSTOM_ACTIVITY_PACKAGE = 'com.clover.cfp.examples.';
        this.store = this.props.store;

        this.changeCustomActionName = this.changeCustomActionName.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.initialPayloadChange = this.initialPayloadChange.bind(this);
        this.payloadChange = this.payloadChange.bind(this);
        this.toggleNonBlocking = this.toggleNonBlocking.bind(this);
        this.startActivity = this.startActivity.bind(this);
        this.sendMessageToActivity = this.sendMessageToActivity.bind(this);
    }

    startActivity(){
        let car = new clover.sdk.remotepay.CustomActivityRequest();
        car.setAction(this.state.customActivityAction);
        car.setPayload(this.state.activityPayload);
        car.setNonBlocking(this.state.nonBlocking);
        console.log('CustomActivityRequest', car);
        this.cloverConnector.startCustomActivity(car);
    }

    sendMessageToActivity() {
        let messageRequest = new clover.sdk.remotepay.MessageToActivity();
        messageRequest.setAction(this.state.customActivityAction);
        messageRequest.setPayload(this.state.payloadToSend);
        console.log('MessageToActivity', messageRequest);
        this.cloverConnector.sendMessageToActivity(messageRequest);
        this.setState({ payloadToSend : '', messages :  this.state.messages.concat([new CustomPayloadMessage(this.state.payloadToSend, true)])});
    }

    finalPayload(finalMessageFromCustomActivity){
        this.setState({finalPayload: finalMessageFromCustomActivity, startActivityDisabled: false, sendPayloadDisabled: true});
    }

    changeCustomActionName(e){      // handle custom activity action name change
        this.setState( {customActivityAction : e.target.value });
    }

    handleChange(e){    // handles change on custom activity type
        this.setState({ selectedValue: e.target.value });
    }

    initialPayloadChange(e){       // handles change on payload
        this.setState({ activityPayload: e.target.value });
    }

    payloadChange(e){       // handles change on payload
        this.setState({ payloadToSend: e.target.value });
    }

    toggleNonBlocking(){     // toggles non-blocking
        this.setState({ nonBlocking : !this.state.nonBlocking });
    }

    componentWillReceiveProps(newProps) {
        if(newProps.customSuccess){
            this.setState({ initialPayload: this.state.activityPayload});
            this.setState({ startActivityDisabled: true, sendPayloadDisabled: false, messages: [], activityPayload: '', finalPayload: ''});
        }
        if(newProps.newCustomMessage){
            let message = newProps.messageFromCustomActivity;
            this.setState({messages :  this.state.messages.concat([new CustomPayloadMessage(message, false)])})
        }
        if(newProps.finalCustomMessage){
            this.finalPayload(newProps.finalMessageFromCustomActivity);
        }
    }

    render(){
        const initialPayload = this.state.initialPayload;
        const finalPayload = this.state.finalPayload;
        let customPayloadClasses = "custom_payload_send";
        let messageContainerClasses = "flex_grow custom_messages_container";
        if (this.state.sendPayloadDisabled){
            customPayloadClasses = "custom_payload_send disabled";
            messageContainerClasses = "flex_grow custom_messages_container disabled";
        }
        let customLeftClasses = "custom_left";
        if(this.state.startActivityDisabled){
            customLeftClasses = "custom_left disabled";
        }
        let messages = this.state.messages;

        return(
            <div className="custom_container">
                <h2>Test Custom Activity</h2>
                <div className="row border_top grow">
                    <div className={customLeftClasses}>
                        <div className="custom_section">
                            <div>Action Name of Custom Activity:</div>
                            <input className="custom_item" type="text" value={this.state.customActivityAction} onChange={this.changeCustomActionName} disabled={this.state.startActivityDisabled}/>
                        </div>
                        <div className="custom_section_row misc_row">
                            <div>Non-Blocking</div>
                            <label className="switch">
                                <input type="checkbox" ref="non_blocking" checked={this.state.nonBlocking} onChange={this.toggleNonBlocking} disabled={this.state.startActivityDisabled}/>
                                <span className="slider round"/>
                            </label>
                        </div>
                        <div className="column_plain padding">
                            <div>Send Initial Payload to Activity:</div>
                            <input className="custom_item" type="text" value={this.state.activityPayload} onChange={this.initialPayloadChange} placeholder="{Message: Start Activity Payload}" disabled={this.state.startActivityDisabled}/>
                            <input className="normal_button button_white custom_activity_button margin_top" type="submit" value="Start Activity" onClick={this.startActivity} disabled={this.state.startActivityDisabled}/>
                        </div>
                    </div>
                    <div className="custom_right">
                        <div className="custom_section_row">
                            <h3 className="no_margin padding_right_15">Initial Payload:</h3>
                            <div>{initialPayload}</div>
                        </div>
                        <div className={messageContainerClasses}>
                            {messages.map(function (message, i) {
                                return <PayloadMessage key={'message-'+i} payload={message.getPayload()}  isSentToCustomActivity={message.isSentToCustomActivity()}/>
                            }, this)}
                        </div>
                        <div className={customPayloadClasses}>
                            <div>Payload to be sent to Custom Activity:</div>
                            <div className="row align_center">
                                <input className="custom_item flex_grow" type="text" value={this.state.payloadToSend} onChange={this.payloadChange} placeholder="{Message: I am a message!}" disabled={this.state.sendPayloadDisabled}/>
                                <ButtonNormal extra="custom_button" title="Send Payload" color="white" disabled={this.state.sendPayloadDisabled} onClick={this.sendMessageToActivity}/>
                            </div>
                        </div>
                        <div className="custom_final">
                            <h3 className="no_margin padding_right_15">Final Payload:</h3>
                            <div>{finalPayload}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}