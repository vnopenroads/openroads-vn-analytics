'use strict';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import config from '../../../config';

export default class ResultsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.pull_from_db()
    }

    pull_from_db() {
        fetch(`${config.api}/cba/results?snapshot_id=${this.props.snapshotId}&config_id=${this.props.configId}`)
            .then((res) => res.json())
            .then((res) => { this.setState({ data: res }); });
    }

    render() {
        if (this.state.data.length > 0) {
            var round2 = (a) => { return `${a.toFixed(2)}` }
            var round1 = (a) => { return `${a.toFixed(1)}` }
            var perc = (a) => { return `${(100.0 * a).toFixed(1)}%` }

            const columns = [
                { dataField: 'way_id', text: "way_id", sort: true },
                { dataField: 'eirr', text: "eirr", sort: true, formatter: round2 },
                { dataField: 'esa_loading', text: "ESA Loading", sort: true, formatter: round2 },
                { dataField: 'npv', text: "NPV", sort: true, formatter: round2 },
                { dataField: 'npv_cost', text: "NPV Cost", sort: true, formatter: round2 },
                { dataField: 'npv_km', text: "NPV km", sort: true, formatter: round2 },
                { dataField: 'truck_percent', text: "Truck %", sort: true, formatter: perc },
                { dataField: 'vehicle_utilization', text: "Vehicle Utilization", sort: true, formatter: perc },
                { dataField: 'work_class', text: "Work Class", sort: true },
                { dataField: 'work_cost', text: "Work Cost", sort: true, formatter: round1 },
                { dataField: 'work_cost_km', text: "Work Cost / km", sort: true, formatter: round1 },
                { dataField: 'work_name', text: "Work Name", sort: true },
                { dataField: 'work_type', text: "Work Type", sort: true },
                { dataField: 'work_year', text: "Work Year", sort: true }
            ]

            return <BootstrapTable
                keyField='way_id'
                data={this.state.data}
                columns={columns}
                bordered={false}
                striped hover
            />;
        } else {
            return <p>Spinner</p>
        }
    }

}
