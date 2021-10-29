'use strict';
import React from 'react';
import { Card, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';


import config from '../../../config';

function KpiTitle(props) {
    var helpIcon = "";
    if (props.helpText) {
        var helpOverlay = <Popover > <Popover.Body> {props.helpText} </Popover.Body> </Popover>;
        helpIcon = <OverlayTrigger trigger={["hover", "focus"]} placement="top" overlay={helpOverlay}>
            <InfoCircle className='float-right' />
        </OverlayTrigger>;
    }
    return <Card.Header><div>
        {props.title}
        {helpIcon}
    </div>
    </Card.Header>
}

function KpiCard(props) {
    return <Card border="dark" style={{ width: '18rem' }} className="text-center">
        <KpiTitle title={props.title} helpText={props.helpText} />
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
                <KpiCard title="5 Year Capital Budget" value={`${this.state.cost5yr.toFixed(2)}M USD`} helpText={totalCost5HelpText} />


            </div>;
        } else {
            return <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        }
    }

}

