import CustomPayloadMessage from '../messages/CustomPayloadMessage';
import ButtonNormal from './ButtonNormal';
import PayloadMessage from './PayloadMessage';
import React from 'react';
import sdk from 'remote-pay-cloud-api';

export default class CustomActivities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityPayload: '',
            customActivityAction: 'com.example.clover.customactivity',
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
        // this.sendMessage = this.sendMessage.bind(this);
        // this.startCustomActivity = this.startCustomActivity.bind(this);
        this.toggleNonBlocking = this.toggleNonBlocking.bind(this);
        this.startActivity = this.startActivity.bind(this);
        this.sendMessageToActivity = this.sendMessageToActivity.bind(this);
    }

    startActivity(){
        let car = new sdk.remotepay.CustomActivityRequest();
        car.setAction(this.state.customActivityAction);
        car.setPayload(this.state.activityPayload);
        car.setNonBlocking(this.state.nonBlocking);

        this.cloverConnector.startCustomActivity(car);

        // messages = new ArrayList<PayloadMessage>();
        // updateMessages();
        // initialPayloadContent.setText("");
        // finalPayload.setText("");
    }

    sendMessageToActivity() {

        let messageRequest = new sdk.remotepay.MessageToActivity();
            messageRequest.setAction(this.state.customActivityAction);
            messageRequest.setPayload(this.state.payloadToSend);
            this.cloverConnector.sendMessageToActivity(messageRequest);

            this.setState({ payloadToSend : '', messages :  this.state.messages.concat([new CustomPayloadMessage(this.state.payloadToSend, true)])});
    }

    finalPayload(finalMessageFromCustomActivity){
        this.setState({finalPayload: finalMessageFromCustomActivity, startActivityDisabled: false, sendPayloadDisabled: true});
    }

    // startCustomActivity(){      // starts custom activity
    //     this.store.setCustomActivity(this.state.selectedValue);
    //
    //     let activityId = this.CUSTOM_ACTIVITY_PACKAGE + this.state.selectedValue;
    //     let nonBlocking = this.refs.non_blocking.checked;
    //     let payload = this.state.activityPayload;
    //
    //     let car = new sdk.remotepay.CustomActivityRequest();
    //     car.setAction(activityId);
    //     car.setPayload(payload);
    //     car.setNonBlocking(nonBlocking);
    //
    //     this.setState({ showMessageButton: (activityId == 'com.clover.cfp.examples.BasicConversationalExample') });
    //     this.cloverConnector.startCustomActivity(car);
    // }
    //
    // sendMessage(){      // sends message to activity
    //     let activityId = this.CUSTOM_ACTIVITY_PACKAGE + this.state.selectedValue;
    //     let message = new ConversationQuestionMessage('Why did the Storm Trooper buy an iPhone?');
    //     let payload = JSON.stringify(message.getPayload());
    //
    //     let messageRequest = new sdk.remotepay.MessageToActivity();
    //     messageRequest.setAction(activityId);
    //     messageRequest.setPayload(payload);
    //
    //     this.cloverConnector.sendMessageToActivity(messageRequest);
    //     this.setState({ showMessageButton : false });
    // }

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
        // const showMessage = this.state.showMessageButton;
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

        // return(
        //     <div className="custom_activities">
        //         <h2>Custom Activities</h2>
        //         <div className="custom_options">
        //             <div className="misc_row">
        //                 <div>Non-Blocking</div>
        //                 <label className="switch">
        //                     <input type="checkbox" ref="non_blocking" defaultChecked/>
        //                     <span className="slider round"/>
        //                 </label>
        //             </div>
        //             <select className="custom_item_select" value={this.state.selectedValue} onChange={this.handleChange}>
        //                 <option value="BasicExample">Basic Example</option>
        //                 <option value="BasicConversationalExample">Basic Conversational Example</option>
        //                 <option value="WebViewExample">Web View Example</option>
        //                 <option value="CarouselExample">Carousel Example</option>
        //                 <option value="RatingsExample">Ratings Example</option>
        //                 <option value="NFCExample">NFC Example</option>
        //             </select>
        //             <input className="custom_item" type="text" value={this.state.activityPayload} onChange={this.payloadChange}/>
        //                 <div className="misc_row">
        //                     <input className="normal_button button_white custom_activity_button left" type="submit" value="Start" onClick={this.startCustomActivity}/>
        //                     {showMessage && <input className="normal_button button_white custom_activity_button max_width_half right" type="submit" value="Send Message" onClick={this.sendMessage}/>}
        //                 </div>
        //         </div>
        //     </div>
        // );
    }
}