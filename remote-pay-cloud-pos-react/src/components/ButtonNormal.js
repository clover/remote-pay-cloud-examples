import React from 'react';

export default class ButtonNormal extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        const title = this.props.title;
        const color = this.props.color;
        const extraClassNames = this.props.extra;
        const onClick = this.props.onClick;
        let disabled = false;
        if(this.props.disabled !== undefined){
            disabled = this.props.disabled;
        }


        var className;
        if(color == "green"){
            className = "normal_button button_green";
        }
        else if(color == "white"){
            className = "normal_button button_white";
        }
        else if(color == "red"){
            className = "normal_button button_red";
        }
        className += " " + extraClassNames;

        return (
            <button className={ className } onClick={onClick} disabled={disabled}>{ title }</button>
        )
    }
}