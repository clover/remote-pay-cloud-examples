import React from 'react';

export default class TitleBar extends React.Component {
    render(){
        var title = this.props.title;
        return ( <div className="title_bar">
                <span>{title}</span>
            </div>
        )
    }
}