'use strict';
import React from 'react';
import { Card, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';


import config from '../../../config';

function InfoIcon(props) {
    var overlay = <Popover > <Popover.Body> {props.explanation} </Popover.Body> </Popover>;

    return <div>
        {props.text}
        <OverlayTrigger trigger="hover" placement="top" overlay={overlay}>
            <InfoCircle className='float-right' />
        </OverlayTrigger>
    </div>
}
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
            .then((r) => { this.setState({ cost: r.cost, npv: r.npv, loaded: true }); });
    }

    render() {
        console.log(this.state.cost);
        console.log(this.state.npv);
        var totalCostHelpText = `The total cost of the recommended maintenance schedule for road assets with
                                 a positive Net Present Value (i.e. those where the benefits exceed the costs).`;
        var totalNPVHelpText = `The total Net Present Value (NPV) across all assets in the recommended maintenance
                                schedule (where the NPV > 0)`;

        if (this.state.loaded) {
            // <Card border="dark" style={{ width: '18rem' }} className="text-center">
            //     <Card.Header>Assets Processed <InfoCircle className='float-right' /></Card.Header>
            //     <Card.Body> <Card.Title>42.7%</Card.Title> </Card.Body>
            // </Card>
            return <div className="d-flex justify-content-around mb-4">
                <Card border="dark" style={{ width: '18rem' }} className="text-center">
                    <Card.Header> <InfoIcon text="Total Cost" explanation={totalCostHelpText} />
                    </Card.Header>
                    <Card.Body> <Card.Title>${this.state.cost.toFixed(2)}M USD</Card.Title> </Card.Body>
                </Card>
                <Card border="dark" style={{ width: '18rem' }} className="text-center">
                    <Card.Header><InfoIcon text="Total NPV" explanation={totalNPVHelpText} /></Card.Header>
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

