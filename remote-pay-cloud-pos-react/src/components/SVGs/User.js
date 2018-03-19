import React from 'react';

export default class User extends React.Component {

    constructor() {
        super();
    }

    render(){
        let className = 'order_detail_icon';
        if(this.props.class !== undefined){
            className = this.props.class;
        }

        return (
            <svg className={className} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 80 80">
                <path d="M16.7,16.7C23.1,10.2,30.9,7,40,7c9.1,0,16.9,3.2,23.3,9.7C69.8,23.1,73,30.9,73,40c0,9.1-3.2,16.9-9.7,23.3
		C56.9,69.8,49.1,73,40,73c-9.1,0-16.9-3.2-23.3-9.7C10.2,56.9,7,49.1,7,40C7,30.9,10.2,23.1,16.7,16.7z M40,63.9
		c8.4,0,15-3.6,19.8-10.7c-0.1-2.9-2.4-5.3-7-7.3c-4.5-2-8.8-2.9-12.9-2.9s-8.3,1-12.9,2.9c-4.5,1.9-6.9,4.4-7,7.4
		C25,60.3,31.6,63.9,40,63.9z M47,19.9c-2-2-4.3-2.9-7-2.9c-2.7,0-5,1-7,2.9c-2,2-2.9,4.3-2.9,7c0,2.7,1,5,2.9,7c2,2,4.3,2.9,7,2.9
		c2.7,0,5-1,7-2.9c2-2,2.9-4.3,2.9-7C49.9,24.1,48.9,21.8,47,19.9z"/>
            </svg>
        )
    }
}