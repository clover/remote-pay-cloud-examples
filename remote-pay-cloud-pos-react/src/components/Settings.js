import React from 'react';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        console.log("Settings: ", this.props);
    }

    render(){

        return(
            <div className="settings">
                <h2>Transaction Settings</h2>
                <div className="transaction_settings">
                    <div className="settings_left settings_side">
                        <h3>Card Options</h3>
                        <div className="settings_row">
                            <div>Manual</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>
                        <div className="settings_row">
                            <div>Swipe</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>
                        <div className="settings_row">
                            <div>Chip</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>
                        <div className="settings_row">
                            <div>Contactless</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>
                        <h3>Offline Payments</h3>
                        <div className="settings_row">
                            <div>Force Offline Payment</div>
                            <form action="">
                                <input className="radio_button" type="radio" name="" value="default" checked="true"/> Default
                                <input className="radio_button"type="radio" name="" value="yes"/> Yes
                                <input className="radio_button"type="radio" name="" value="no"/> No
                            </form>
                        </div>

                        <div className="settings_row">
                            <div>Allow Offline Payments</div>
                            <form action="">
                                <input className="radio_button" type="radio" name="" value="default" checked="true"/> Default
                                <input className="radio_button" type="radio" name="" value="yes"/> Yes
                                <input className="radio_button" type="radio" name="" value="no"/> No
                            </form>
                        </div>

                        <div className="settings_row">
                            <div>Accept Offline w/o Prompt</div>
                            <form action="">
                                <input className="radio_button" type="radio" name="" value="default" checked="true"/> Default
                                <input className="radio_button" type="radio" name="" value="yes"/> Yes
                                <input className="radio_button" type="radio" name="" value="no"/> No
                            </form>
                        </div>
                        <h3>Tips</h3>
                        <div className="settings_row">
                            <div>Tip Mode</div>
                            <select className="setting_select">
                                <option value="">Default</option>
                                <option value="">Tip Provided</option>
                                <option value="">On Screen Before Payment</option>
                                <option value="">No Tip</option>
                            </select>
                        </div>

                        <div className="settings_row">
                            <div>Tip Amount</div>
                            <input className="setting_input" type="text"/>
                        </div>
                    </div>
                    <div className="settings_right settings_side">
                        <h3>Signatures</h3>
                        <div className="settings_row">
                            <div>Signature Entry Location</div>
                            <select className="setting_select">
                                <option value="">Default</option>
                                <option value="">On Screen</option>
                                <option value="">On Paper</option>
                                <option value="">None</option>
                            </select>
                        </div>

                        <div className="settings_row">
                            <div>Signature Threshold</div>
                            <input className="setting_input" type="text"/>
                        </div>
                        <h3>Payment Acceptance</h3>
                        <div className="settings_row">
                            <div>Disable Duplicate Payment Checking</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>

                        <div className="settings_row">
                            <div>Disable Device Receipt Options Screen</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>

                        <div className="settings_row">
                            <div>Disable Device Printing</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>

                        <div className="settings_row">
                            <div>Automatically Confirm Signature</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>

                        <div className="settings_row">
                            <div>Automatically Confirm Payment Challenges</div>
                            <div className="onoffswitch">
                                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"/>
                                    <span className="onoffswitch-switch"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}