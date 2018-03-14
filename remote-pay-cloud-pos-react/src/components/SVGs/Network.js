
import React from 'react';

export default class Network extends React.Component {

    constructor() {
        super();
    }

    render(){
        let className = 'network';
        if(this.props.class !== undefined){
            className = this.props.class;
        }

        return (
            <svg className={className} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                 viewBox="0 0 80 80">
                <path d="M8.2,30.7c8.8-8.7,19.5-13.1,31.9-13.1c12.4,0,23,4.4,31.7,13.1L66,36.5c-7.2-7.1-15.9-10.7-26-10.7
			c-10.1,0-18.8,3.6-26,10.7L8.2,30.7z M19.8,42.2c5.6-5.5,12.3-8.3,20.2-8.3c7.9,0,14.6,2.8,20.1,8.3L54.5,48c-4-4-8.8-6-14.5-6
			c-5.7,0-10.5,2-14.5,6L19.8,42.2z M31.3,53.8c2.3-2.3,5.2-3.5,8.7-3.5c3.4,0,6.3,1.2,8.7,3.5L40,62.5L31.3,53.8z"/>
            </svg>
        )
    }
}