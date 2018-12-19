import React from 'react';
import ButtonNormal from "./ButtonNormal";

export default class TipSuggestions extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            tipSuggestion1Enabled: (this.props.tipSuggestion1 != null ? this.props.tipSuggestion1.isEnabled : false),
            tipSuggestion2Enabled: (this.props.tipSuggestion2 != null ? this.props.tipSuggestion2.isEnabled : false),
            tipSuggestion3Enabled: (this.props.tipSuggestion3 != null ? this.props.tipSuggestion3.isEnabled : false),
            tipSuggestion4Enabled: (this.props.tipSuggestion4 != null ? this.props.tipSuggestion4.isEnabled : false),
            tipSuggestion1Percentage: this.props.tipSuggestion1.percentage,
            tipSuggestion2Percentage: this.props.tipSuggestion2.percentage,
            tipSuggestion3Percentage: this.props.tipSuggestion3.percentage,
            tipSuggestion4Percentage: this.props.tipSuggestion4.percentage,
            tipSuggestion1Label: this.props.tipSuggestion1.name,
            tipSuggestion2Label: this.props.tipSuggestion2.name,
            tipSuggestion3Label: this.props.tipSuggestion3.name,
            tipSuggestion4Label: this.props.tipSuggestion4.name,

        }
        this.tipSuggestion1 = this.props.tipSuggestion1;
        this.tipSuggestion2 = this.props.tipSuggestion2;
        this.tipSuggestion3 = this.props.tipSuggestion3;
        this.tipSuggestion4 = this.props.tipSuggestion4;

        this.onTipSuggestion1EnabledChange = this.onTipSuggestion1EnabledChange.bind(this);
        this.onTipSuggestion2EnabledChange = this.onTipSuggestion2EnabledChange.bind(this);
        this.onTipSuggestion3EnabledChange = this.onTipSuggestion3EnabledChange.bind(this);
        this.onTipSuggestion4EnabledChange = this.onTipSuggestion4EnabledChange.bind(this);
        this.tipSuggestion1PercentageChange = this.tipSuggestion1PercentageChange.bind(this);
        this.tipSuggestion2PercentageChange = this.tipSuggestion2PercentageChange.bind(this);
        this.tipSuggestion3PercentageChange = this.tipSuggestion3PercentageChange.bind(this);
        this.tipSuggestion4PercentageChange = this.tipSuggestion4PercentageChange.bind(this);
        this.tipSuggestion1LabelChange = this.tipSuggestion1LabelChange.bind(this);
        this.tipSuggestion2LabelChange = this.tipSuggestion2LabelChange.bind(this);
        this.tipSuggestion3LabelChange = this.tipSuggestion3LabelChange.bind(this);
        this.tipSuggestion4LabelChange = this.tipSuggestion4LabelChange.bind(this);
    }


    onTipSuggestion1EnabledChange(){
        this.tipSuggestion1.isEnabled = !this.state.tipSuggestion1Enabled;
        this.setState({ tipSuggestion1Enabled : !this.state.tipSuggestion1Enabled });
    }

    onTipSuggestion2EnabledChange(){
        this.tipSuggestion2.isEnabled = !this.state.tipSuggestion2Enabled;
        this.setState({ tipSuggestion2Enabled : !this.state.tipSuggestion2Enabled });
    }

    onTipSuggestion3EnabledChange(){
        this.tipSuggestion3.isEnabled = !this.state.tipSuggestion3Enabled;
        this.setState({ tipSuggestion3Enabled : !this.state.tipSuggestion3Enabled });
    }

    onTipSuggestion4EnabledChange(){
        this.tipSuggestion4.isEnabled = !this.state.tipSuggestion4Enabled;
        this.setState({ tipSuggestion4Enabled : !this.state.tipSuggestion4Enabled });
    }

    tipSuggestion1PercentageChange (e){
        let percentage = e.target.value;
        if(percentage.length < 1){
            percentage = "";
        }
        else if(percentage < 0){
            percentage = 0;
        }
        else if (percentage > 100){
            percentage = 100;
        }
        this.setState({ tipSuggestion1Percentage:percentage});
        this.tipSuggestion1.percentage = percentage;
    }

    tipSuggestion2PercentageChange (e){
        let percentage = e.target.value;
        if(percentage.length < 1){
            percentage = "";
        }
        else if(percentage < 0){
            percentage = 0;
        }
        else if (percentage > 100){
            percentage = 100;
        }
        this.setState({ tipSuggestion2Percentage: percentage});
        this.tipSuggestion2.percentage = percentage;
    }

    tipSuggestion3PercentageChange (e){
        let percentage = e.target.value;
        if(percentage.length < 1){
            percentage = "";
        }
        else if(percentage < 0){
            percentage = 0;
        }
        else if (percentage > 100){
            percentage = 100;
        }
        this.setState({ tipSuggestion3Percentage: percentage});
        this.tipSuggestion3.percentage = percentage;
    }

    tipSuggestion4PercentageChange (e){
        let percentage = e.target.value;
        if(percentage.length < 1){
            percentage = "";
        }
        else if(percentage < 0){
            percentage = 0;
        }
        else if (percentage > 100){
            percentage = 100;
        }
        this.setState({ tipSuggestion4Percentage: percentage});
        this.tipSuggestion4.percentage = percentage;
    }

    tipSuggestion1LabelChange (e){
        this.setState({ tipSuggestion1Label: e.target.value});
        this.tipSuggestion1.name = e.target.value;
    }

    tipSuggestion2LabelChange (e){
        this.setState({ tipSuggestion2Label: e.target.value});
        this.tipSuggestion2.name = e.target.value;
    }


    tipSuggestion3LabelChange (e){
        this.setState({ tipSuggestion3Label: e.target.value});
        this.tipSuggestion3.name = e.target.value;
    }


    tipSuggestion4LabelChange (e){
        this.setState({ tipSuggestion4Label: e.target.value});
        this.tipSuggestion4.name = e.target.value;
    }



    render(){
        const onClick = this.props.onClick;
        return (
            <div className="tip_suggestions">
                <h3 className="tip_suggestions_header">Set Tip Suggestions</h3>
                <div className="tipSuggestion">
                    <input className="tip_suggestion_checkbox" type="checkbox" ref="manual_entry" checked={this.state.tipSuggestion1Enabled} onChange={this.onTipSuggestion1EnabledChange} />
                    <input className="tip_suggestion_percentage" type="number" min={1} max={100} maxLength={3} value={this.state.tipSuggestion1Percentage} onChange={this.tipSuggestion1PercentageChange} />
                    <input className="tip_suggestion_label" type="text" value={this.state.tipSuggestion1Label} onChange={this.tipSuggestion1LabelChange}/>
                </div>
                <div className="tipSuggestion">
                    <input className="tip_suggestion_checkbox" type="checkbox" ref="manual_entry" checked={this.state.tipSuggestion2Enabled} onChange={this.onTipSuggestion2EnabledChange}/>
                    <input className="tip_suggestion_percentage" type="number" min="1" max="100" value={this.state.tipSuggestion2Percentage} onChange={this.tipSuggestion2PercentageChange} />
                    <input className="tip_suggestion_label" type="text" value={this.state.tipSuggestion2Label} onChange={this.tipSuggestion2LabelChange}/>
                </div>
                <div className="tipSuggestion">
                    <input className="tip_suggestion_checkbox" type="checkbox" ref="manual_entry" checked={this.state.tipSuggestion3Enabled} onChange={this.onTipSuggestion3EnabledChange}/>
                    <input className="tip_suggestion_percentage" type="number" min="1" max="100" value={this.state.tipSuggestion3Percentage} onChange={this.tipSuggestion3PercentageChange} />
                    <input className="tip_suggestion_label" type="text" defaultValue={this.state.tipSuggestion3Label} onChange={this.tipSuggestion3LabelChange}/>
                </div>
                <div className="tipSuggestion">
                    <input className="tip_suggestion_checkbox" type="checkbox" ref="manual_entry" checked={this.state.tipSuggestion4Enabled} onChange={this.onTipSuggestion4EnabledChange}/>
                    <input className="tip_suggestion_percentage" type="number" min="1" max="100" defaultValue={this.state.tipSuggestion4Percentage} onChange={this.tipSuggestion4PercentageChange}  />
                    <input className="tip_suggestion_label" type="text" defaultValue={this.state.tipSuggestion4Label} onChange={this.tipSuggestion4LabelChange}/>
                </div>
                <div className="tip_suggestions_button_container">
                    <ButtonNormal title="Save" color="white" extra="tip_suggestions_button" onClick={() => {onClick(this.tipSuggestion1, this.tipSuggestion2, this.tipSuggestion3, this.tipSuggestion4)}}/>
                </div>
            </div>
        )
    }
}
