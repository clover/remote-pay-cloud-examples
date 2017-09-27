import React from 'react';

export default class RegisterLine extends React.Component {

    render(){
        const left = this.props.left;
        const right = this.props.right;
        var extraLeft = this.props.extraLeft;
        var extraRight = this.props.extraRight;

        var leftClassName = "register_line_left " + extraLeft;
        var rightClassName = "register_line_right " + extraRight;



        return (
            <div className="register_line">
                <div className={ leftClassName }>{ left }</div>
                <div className={ rightClassName }>{ right }</div>
            </div>
        )
    }
}

RegisterLine.defaulProps = {
    extraLeft: "",
    extraRight: "",
    right: "",
};