import React from 'react';

export default class Checkmark extends React.Component {

    constructor() {
        super();
    }

    render(){
        let className = 'checkmark';
        if(this.props.class !== undefined){
            className = this.props.class;
        }

        return (
            <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
        )
    }
}