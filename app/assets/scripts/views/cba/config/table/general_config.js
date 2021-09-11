import React from 'react';
import { Form, Row } from 'react-bootstrap';
import config from '../../../../config';

export default class GeneralConfig extends React.Component {

    constructor(props) {
        super(props);
        console.log('this.props.config_id: ' + props.config_id)
        this.state = {
            config_id: props.config_id,
            discount_rate: "",
            economic_factor: "",
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
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => this.setState({ discount_rate: res.discount_rate, economic_factor: res.economic_factor, modified: false }));
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    componentWillUnmount() {
        this.push_data_to_db();
    }

    push_data_to_db() {
        if (this.state.modified) {
            const body = { discount_rate: this.state.discount_rate, economic_factor: this.state.economic_factor };
            const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

            var url = `${config.api}/cba/user_configs/${this.state.config_id}/update`
            fetch(url, request)
                .then(res => res.json())
                .then(res => console.log("Successfully updated config in db: " + JSON.stringify(res)));
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.config_id !== prevProps.config_id) {
            this.push_data_to_db()
            this.setState({ config_id: this.props.config_id });
            this.pull_data_from_db()
        }
    }

    render() {
        return (
            <div className='menu-con'>
                <div className='title-con'>General Configuration </div>
                <Form.Group as={Row} className="mb-3" controlId="discountRate">
                    <Form.Label column sm="2">Discount Rate</Form.Label>
                    <Form.Control sm="10" value={this.state.discount_rate} onChange={this.handleDiscountChange} />
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="economicFactor">
                    <Form.Label column>Economic Factor</Form.Label>
                    <Form.Control sm="10" value={this.state.economic_factor} onChange={this.handleEconFactorChange} />
                </Form.Group>
            </div>
        )
    }
}