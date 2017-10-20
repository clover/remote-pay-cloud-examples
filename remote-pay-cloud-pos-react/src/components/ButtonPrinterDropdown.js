import React from 'react';

export default class ButtonPrinterDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDropDown: false
        };
        this.printers = this.props.printers;

        this.dropdownSelect = this.dropdownSelect.bind(this)
        this.showDropDown = this.showDropDown.bind(this);
    }

    showDropDown(){     // shows dropdown
        this.setState({ showDropDown : !this.state.showDropDown });
    }

    dropdownSelect(printer){    // selects printer from dropdown
        this.setState({ showDropDown : false });
        this.props.dropDownClick(printer, this.props.printType);
    }

    render(){
        const title = this.props.title;
        const onClick = this.props.onClick;

        let disabled = false;
        if(this.props.disabled !== undefined){
            disabled = this.props.disabled;
        }
        const showDropDown = this.state.showDropDown;
        let className = showDropDown ? 'button_dropdown_open' : 'button_dropdown';

        return (
            <div className="dropdown_container">
                <div className={className}>
                    <div className="row button_device">
                        <button className="dropdown_button" onClick={onClick} disabled={disabled}>{title}</button>
                        <button onClick={this.showDropDown} className="dropdown_dropdown">
                            <i className="fa fa-caret-down" aria-hidden="true"/>
                        </button>
                    </div>
                </div>

                {showDropDown &&
                <div className="dropdown">
                    <div className="printer_row border_top"  onClick={() =>{this.dropdownSelect({id: null})}}>
                        <img className="printer_image" src="images/printer.png"/>
                        <div>DEFAULT</div>
                    </div>

                    {this.printers.map((printer, i) => {
                        return (
                            <div key={ "printer-" + i } className="printer_row"
                                 onClick={() =>{this.dropdownSelect(printer)}}>
                                <img className="printer_image" src="images/printer.png"/>
                                <div>
                                    <div className="row_wrap print_row_bold">
                                        <div>Name:</div>
                                        <div>{printer.name}</div>
                                    </div>
                                    <div className="row_wrap print_row_small">
                                        <div>ID:</div>
                                        <div>{printer.id}</div>
                                    </div>
                                    <div className="row_wrap print_row_small">
                                        <div>Type:</div>
                                        <div>{printer.type}</div>
                                    </div>
                                </div>
                            </div>
                        )})}
                </div>
                }

            </div>
        )
    }
}