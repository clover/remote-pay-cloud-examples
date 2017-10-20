import React from 'react';

export default class ButtonNormal extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const color = this.props.color;
        const extraClassNames = this.props.extra;
        const onClick = this.props.onClick;
        const title = this.props.title;

        let disabled = false;
        if(this.props.disabled !== undefined){
            disabled = this.props.disabled;
        }

        let className = 'normal_button button_white';
        if(color == 'green'){
            className = 'normal_button button_green';
        }
        else if(color == 'red'){
            className = 'normal_button button_red';
        }
        className += ' ' + extraClassNames;

        return (
            <button className={className} onClick={onClick} disabled={disabled}>{title}</button>
        )
    }
}