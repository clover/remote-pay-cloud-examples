import React from 'react';

export default class PayloadMessage extends React.Component {

    render(){
        const content = this.props.payload;
        const isSentToCustomActivity = this.props.isSentToCustomActivity;

        let messageClass = "from_custom_activity";
        if(isSentToCustomActivity){
            messageClass = "to_custom_activity"
        }

        return (
            <div>
                {isSentToCustomActivity  ? (
                    <div className="payload_message"><div className={messageClass}><strong>Payload: </strong>{content}</div><div className="flex_grow"/></div>
                ):(
                    <div className="payload_message"><div className="flex_grow"/><div className={messageClass}><strong>Payload: </strong>{content}</div></div>
                )}
            </div>
        )
    }
}
