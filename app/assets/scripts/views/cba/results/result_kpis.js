'use strict';
import React from 'react';
import { Card, Spinner } from 'react-bootstrap';

import config from '../../../config';

export default class ResultKpis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cost: "",
            npv: "",
            loaded: false
        };
    }

    componentDidMount() {
        this.pull_from_db()
    }

    pull_from_db() {
        fetch(`${config.api}/cba/results/kpis?snapshot_id=${this.props.snapshotId}&config_id=${this.props.configId}`)
            .then((res) => res.json())
            .then((res) => { var r = res[0]; this.setState({ cost: r.cost, npv: r.npv, loaded: true }); });
    }

    render() {
        console.log(this.state.cost);
        console.log(this.state.npv);

        if (this.state.loaded) {
            return <div className="d-flex justify-content-around mb-4">
                <Card border="dark" style={{ width: '18rem' }} className="text-center">
                    <Card.Header>Total Cost</Card.Header>
                    <Card.Body> <Card.Title>${this.state.cost.toFixed(2)}M USD</Card.Title> </Card.Body>
                </Card>
                <Card border="dark" style={{ width: '18rem' }} className="text-center">
                    <Card.Header>Assets Processed</Card.Header>
                    <Card.Body> <Card.Title>42.7%</Card.Title> </Card.Body>
                </Card>
                <Card border="dark" style={{ width: '18rem' }} className="text-center">
                    <Card.Header>Total NPV</Card.Header>
                    <Card.Body> <Card.Title>${this.state.npv.toFixed(2)}M USD</Card.Title> </Card.Body>
                </Card>
            </div>;
        } else {
            return <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
    }

}

