import HomeMenu from './HomeMenu';
import React from 'react';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <HomeMenu cloverConnection={this.props.cloverConnection} store={this.props.store} setStatus={this.props.setStatus}/>
        );
    }
}