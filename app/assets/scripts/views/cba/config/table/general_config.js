import React from 'react';
import config from '../../../../config';

export default class GeneralConfig extends React.Component {

    constructor(props) {
        super(props);
        console.log('this.state: ' + props.config_id)
        this.state = {
            config_id: props.config_id,
            discount_rate: this.props.discount_rate,
            economic_factor: this.props.economic_factor,
            modified: false
        };
        this.handleDiscountChange = this.handleDiscountChange.bind(this);
        this.handleEconFactorChange = this.handleEconFactorChange.bind(this);
    }

    handleDiscountChange(event) {
        this.setState({ discount_rate: event.target.value, modified: true });
    }
    handleEconFactorChange(event) {
        this.setState({ economic_factor: event.target.value, modified: true });
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}`
        console.log("Setting up general config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => this.setState({ discount_rate: res.discount_rate, economic_factor: res.economic_factor }));
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    componentWillUnmount() {
        if (this.state.modified) {
            const body = { discount_rate: this.state.discount_rate, economic_factor: this.state.economic_factor };
            const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

            var url = `${config.api}/cba/user_configs/${this.state.config_id}/update`
            fetch(url, request)
                .then(res => res.json())
                .then(res => { console.log(res); });
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.config_id !== prevProps.config_id) {
            this.setState({ config_id: this.props.config_id, config_name: this.props.config_name });
            this.pull_data_from_db()
        }
    }

    render() {
        // this.pull_data_from_db();

        console.log("Render() in general_config");
        return (
            <div className='menu-con'>
                <div className='title-con'> General Configuration </div>
                <div className='config-con'>
                    <ul>
                        <li key="discount_rate">
                            <div className='config-label'>Discount Rate</div>
                            <div>
                                <input type="text" className='float_input' value={this.state.discount_rate} onChange={this.handleDiscountChange} />
                            </div>
                        </li>
                        <li key="economic_factor">
                            <div className='config-label'>Economic Factor</div>
                            <div>
                                <input type="text" className='float_input' value={this.state.economic_factor} onChange={this.handleEconFactorChange} />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}