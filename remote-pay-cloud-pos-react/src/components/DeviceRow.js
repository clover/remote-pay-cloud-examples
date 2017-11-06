import ImageHelper from './../utils/ImageHelper';
import React from 'react';

export default class DeviceRow extends React.Component {
    constructor(props){
        super(props);
        this.device = this.props.device;
        this.imageHelper = new ImageHelper();
        this.onClick = this.props.onClick;
    }

    render(){
        let imageSrc = this.imageHelper.getDeviceImage(this.device.deviceTypeName);
        let name = '';
        if(this.device.name !== undefined && this.device.name !== null){
            name = this.device.name;
        }
        return(
            <div className="device_row">
                <div className="row align_center full_height" onClick={this.onClick}>
                    <div className="device_image_box"><img className="device_image" src={imageSrc}/></div>
                    {this.device.serial}
                </div>
            </div>
        )
    }

}