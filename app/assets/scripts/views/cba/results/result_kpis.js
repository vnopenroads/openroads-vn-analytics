'use strict';
import React from 'react';
import { Card, Spinner } from 'react-bootstrap';
import HelpOverlay from '../../help_overlay';
import config from '../../../config';

function KpiTitle(props) {
    return <Card.Header><div>
        {props.title}
        <HelpOverlay helpText={props.helpText} placement={props.placement} />
    </div>
    </Card.Header>
}

function KpiCard(props) {
    return <Card border="dark" style={{ width: '18rem' }} className="text-center">
        <KpiTitle title={props.title} helpText={props.helpText} placement={props.placement} />
        <Card.Body> <Card.Title>{props.value}</Card.Title> </Card.Body>
    </Card>
}
export default class ResultKpis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.pull_from_db()
    }

    pull_from_db() {
        fetch(`${config.api}/cba/results/kpis?snapshot_id=${this.props.snapshotId}&config_id=${this.props.configId}`)
            .then((res) => res.json())
            .then((r) => { this.setState({ ...r, loaded: true }); });
    }

    render() {
        var totalCost3HelpText = `The total Capital costs of the recommended maintenance schedule across a 3 year horizon.`;
        var totalCost5HelpText = `The total Capital costs of the recommended maintenance schedule across a 5 year horizon.`;
        var totalNPVHelpText = `The total Net Present Value (NPV) across all assets in the recommended maintenance
                                schedule (where the NPV > 0)`;

        if (this.state.loaded) {
            // <KpiCard title="Budget Required (Year 1)" value={`${this.state.cost1yr.toFixed(2)}M USD`} helpText={totalCostHelpText} />
            return <div className="d-flex justify-content-around mb-4">
                <KpiCard title="Assets Evaluated" value={`${this.state.assetBreakdown.num_assets} Road Sections`} helpText={totalCost5HelpText} />
                <KpiCard title="3 Year Capital Budget" value={`${this.state.cost3yr.toFixed(2)}M USD`} helpText={totalCost3HelpText} />
                <KpiCard title="5 Year Capital Budget" value={`${this.state.cost5yr.toFixed(2)}M USD`} helpText={totalCost5HelpText} placement='left' />


            </div>;
        } else {
            return <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
    }

}

