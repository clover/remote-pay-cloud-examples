import React from 'react';

export default class ButtonPrinterDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDropDown: false
        };
        this.showDropDown = this.showDropDown.bind(this);
        this.dropdownSelect = this.dropdownSelect.bind(this)
        this.printers = this.props.printers;
    }

    showDropDown(){
        this.setState({showDropDown : !this.state.showDropDown});
    }

    dropdownSelect(printer){
        this.setState({showDropDown : false});
        this.props.dropDownClick(printer, this.props.printType);
    }


    render(){
        const title = this.props.title;
        //const color = this.props.color;
        //const extraClassNames = this.props.extra;
        const onClick = this.props.onClick;
        let disabled = false;
        if(this.props.disabled !== undefined){
            disabled = this.props.disabled;
        }
        const showDropDown = this.state.showDropDown;

        return (
            <div className="button_device">
                <div className="button_dropdown">
                    <button className="dropdown_button" onClick={onClick} disabled={disabled}>{ title }</button>
                    <button onClick={this.showDropDown} className="dropdown_dropdown">V</button>
                </div>
                {showDropDown &&
                <div className="dropdown">
                    {this.printers.map((printer, i) => {
                        return (
                            <div key={'printer-' + i} className="printer_row"
                                 onClick={() =>{this.dropdownSelect(printer)}}>
                                <div className="row">
                                    <div>ID:</div>
                                    <div>{printer.id}</div>
                                </div>
                                <div className="row">
                                    <div>Name:</div>
                                    <div>{printer.name}</div>
                                </div>
                                <div className="row">
                                    <div>Type:</div>
                                    <div>{printer.type}</div>
                                </div>

                            </div>
                        )})}
                </div>
                }
            </div>
        )
    }
}