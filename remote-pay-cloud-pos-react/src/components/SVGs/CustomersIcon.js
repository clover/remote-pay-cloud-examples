import React from 'react';

export default class CustomersIcon extends React.Component {

    constructor() {
        super();
    }

    render(){
        let className = 'home_icon';
        if(this.props.class !== undefined){
            className = this.props.class;
        }

        return (
            <svg className={className} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 80 80">
                <path d="M69.6,16.9H10.4c-2.3,0-4.1,1.8-4.1,4.1v37.9c0,2.3,1.8,4.1,4.1,4.1h59.2c2.3,0,4.1-1.8,4.1-4.1V21.1
			C73.7,18.8,71.9,16.9,69.6,16.9z M69.5,21.2v7.9h-59v-7.9H69.5z M10.5,58.8V37.5h59v21.3H10.5z"/>
                <path d="M20.8,50.2h-4.7c-1.2,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1h4.7c1.2,0,2.1-0.9,2.1-2.1S22,50.2,20.8,50.2z"/>
                <path d="M46.2,50.2H29c-1.2,0-2.1,0.9-2.1,2.1s0.9,2.1,2.1,2.1h17.1c1.2,0,2.1-0.9,2.1-2.1S47.3,50.2,46.2,50.2z"/>
            </svg>

        )
    }
}