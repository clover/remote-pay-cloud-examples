import React from 'react';

export default class RegisterLine extends React.Component {

    render(){
        const extraLeft = this.props.extraLeft;
        const extraRight = this.props.extraRight;
        const left = this.props.left;
        const right = this.props.right;

        let leftClassName = 'register_line_left ' + extraLeft;
        let rightClassName = 'register_line_right ' + extraRight;

        return (
            <div className="register_line">
                <div className={leftClassName}>{left}</div>
                <div className={rightClassName}>{right}</div>
            </div>
        )
    }
}
