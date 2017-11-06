import ConversationQuestionMessage from '../messages/ConversationQuestionMessage';
import React from 'react';
import sdk from 'remote-pay-cloud-api';

export default class CustomActivities extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityPayload: '{name:Bob}',
            selectedValue : 'BasicExample',
            showMessageButton : false
        };

        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.CUSTOM_ACTIVITY_PACKAGE = 'com.clover.cfp.examples.';
        this.store = this.props.store;

        this.handleChange = this.handleChange.bind(this);
        this.payloadChange = this.payloadChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.startCustomActivity = this.startCustomActivity.bind(this);
    }

    startCustomActivity(){      // starts custom activity
        this.store.setCustomActivity(this.state.selectedValue);

        let activityId = this.CUSTOM_ACTIVITY_PACKAGE + this.state.selectedValue;
        let nonBlocking = this.refs.non_blocking.checked;
        let payload = this.state.activityPayload;

        let car = new sdk.remotepay.CustomActivityRequest();
        car.setAction(activityId);
        car.setPayload(payload);
        car.setNonBlocking(nonBlocking);

        this.setState({ showMessageButton: (activityId == 'com.clover.cfp.examples.BasicConversationalExample') });
        this.cloverConnector.startCustomActivity(car);
    }

    sendMessage(){      // sends message to activity
        let activityId = this.CUSTOM_ACTIVITY_PACKAGE + this.state.selectedValue;
        let message = new ConversationQuestionMessage('Why did the Storm Trooper buy an iPhone?');
        let payload = JSON.stringify(message.getPayload());

        let messageRequest = new sdk.remotepay.MessageToActivity();
        messageRequest.setAction(activityId);
        messageRequest.setPayload(payload);

        this.cloverConnector.sendMessageToActivity(messageRequest);
        this.setState({ showMessageButton : false });
    }

    handleChange(e){    // handles change on custom activity type
        this.setState({ selectedValue: e.target.value });
    }

    payloadChange(e){       // handles change on payload
        this.setState({ activityPayload: e.target.value });
    }

    render(){
        const showMessage = this.state.showMessageButton;

        return(
            <div className="custom_activities">
                <h2>Custom Activities</h2>
                <div className="custom_options">
                    <div className="misc_row">
                        <div>Non-Blocking</div>
                        <label className="switch">
                            <input type="checkbox" ref="non_blocking" defaultChecked/>
                            <span className="slider round"/>
                        </label>
                    </div>
                    <select className="custom_item_select" value={this.state.selectedValue} onChange={this.handleChange}>
                        <option value="BasicExample">Basic Example</option>
                        <option value="BasicConversationalExample">Basic Conversational Example</option>
                        <option value="WebViewExample">Web View Example</option>
                        <option value="CarouselExample">Carousel Example</option>
                        <option value="RatingsExample">Ratings Example</option>
                        <option value="NFCExample">NFC Example</option>
                    </select>
                    <input className="custom_item" type="text" value={this.state.activityPayload} onChange={this.payloadChange}/>
                        <div className="misc_row">
                            <input className="normal_button button_white custom_activity_button left" type="submit" value="Start" onClick={this.startCustomActivity}/>
                            {showMessage && <input className="normal_button button_white custom_activity_button max_width_half right" type="submit" value="Send Message" onClick={this.sendMessage}/>}
                        </div>
                </div>
            </div>
        );
    }
}