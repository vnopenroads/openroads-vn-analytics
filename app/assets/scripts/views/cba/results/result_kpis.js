'use strict';
import React from 'react';
import { Card, Spinner, Table } from 'react-bootstrap';
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
        <Card.Body> <Card.Title>{props.value}</Card.Title> <Card.Text>{props.text}</Card.Text></Card.Body>
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
        console.log(this.state.assetBreakdown);
        if (!this.state.loaded) {
            return <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }

        var assetCountText = `The total number of assets evaluated by the model. An additional ${this.state.assetBreakdown.invalid_assets} were not evaluated due to insufficient data.`
        var totalCost1HelpText = `The total Capital costs of the recommended maintenance schedule across a 1 year horizon.`;
        var totalCost3HelpText = `The total Capital costs of the recommended maintenance schedule across a 3 year horizon.`;
        var totalCost5HelpText = `The total Capital costs of the recommended maintenance schedule across a 5 year horizon.`;
        var totalNPVHelpText = `The total Net Present Value (NPV) across all assets in the recommended maintenance
                                schedule (where the NPV > 0)`;
        return <div className="d-flex justify-content-around mb-4">
            <KpiCard title="Assets Evaluated" value={`${this.state.assetBreakdown.valid_assets} Road Sections`} helpText={assetCountText} />
            <KpiCard
                title="1 Year Maintenance Budget"
                value={`${this.state.cost1yr.toFixed(2)}M USD`}
                text={`${this.state.count1yr} assets`}
                helpText={totalCost1HelpText}
            />
            <KpiCard title="3 Year Maintenance Budget"
                text={`${this.state.count3yr} assets`}
                value={`${this.state.cost3yr.toFixed(2)}M USD`} helpText={totalCost3HelpText} />
            <KpiCard title="5 Year Maintenance Budget"
                text={`${this.state.count5yr} assets`}
                value={`${this.state.cost5yr.toFixed(2)}M USD`} helpText={totalCost5HelpText} placement='left' />


        </div>;
    }

}

