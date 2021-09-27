'use strict';
import React from 'react';
import { Form, Row } from 'react-bootstrap';
import config from '../../../../config';

export default class GrowthRateConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config_id: props.config_id,
            growth_rates: [],
            modified: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, key) {
        var state = { modified: true };
        state[key] = event.target.value;
        this.setState(state);
    }

    componentDidMount() {
        var user_config_url = `${config.api}/cba/user_configs/${this.state.config_id}/growth_rates`
        console.log("Setting up growth_rates config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => { console.log(res); this.setState(res['growth_rates']) });
    }

    // floatifyEntries(e) {
    //     return Object.fromEntries(
    //         Object.entries(e).map(([key, val]) => [key, parseFloat(val)])
    //     );
    // };

    // floatifyArray(es) {
    //     return es.map((e) => this.floatifyEntries(e))
    // }

    componentWillUnmount() {

        // const body = { traffic_levels: this.floatifyArray(this.state.traffic_levels) };
        const { very_low, low, medium, high, very_high } = this.state;
        const body = { growth_rates: { very_low, low, medium, high, very_high } };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
        console.log(request);

        var url = `${config.api}/cba/user_configs/${this.state.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }


    render() {
        return (
            <div className='menu-con'>
                <div className='title-con'>Growth Rates</div>
                <Form.Group as={Row} className="mb-3" controlId="veryLow">
                    <Form.Label column sm="2">Very Low</Form.Label>
                    <Form.Control sm="10" value={this.state.very_low} onChange={(e) => this.handleChange(e, 'very_low')} />
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="low">
                    <Form.Label column sm="2">Low</Form.Label>
                    <Form.Control sm="10" value={this.state.low} onChange={(e) => this.handleChange(e, 'low')} />
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="medium">
                    <Form.Label column sm="2">Medium</Form.Label>
                    <Form.Control sm="10" value={this.state.medium} onChange={(e) => this.handleChange(e, 'medium')} />
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="high">
                    <Form.Label column sm="2">High</Form.Label>
                    <Form.Control sm="10" value={this.state.high} onChange={(e) => this.handleChange(e, 'high')} />
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="veryHigh">
                    <Form.Label column sm="2">Very High</Form.Label>
                    <Form.Control sm="10" value={this.state.very_high} onChange={(e) => this.handleChange(e, 'very_high')} />
                </Form.Group>
            </div>
        )
    }
}
