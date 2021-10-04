'use strict';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Tooltip, ResponsiveContainer } from 'recharts';

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
            return (<div>
                {this.renderChart()}
                {this.renderTable()}
            </div>);
        } else {
            return <p>Spinner</p>
        }
    }

    renderChart() {

        var npvCumSum = [], costCumSum = [];
        this.state.data.map((e) => e.npv).reduce(function (a, b, i) { return npvCumSum[i] = a + b; }, 0);
        this.state.data.map((e) => e.work_cost).reduce(function (a, b, i) { return costCumSum[i] = a + b; }, 0);
        const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]))

        var data = zip([npvCumSum, costCumSum]).map((e) => { return { npv: e[0], cost: e[1] }; });
        return (
            <LineChart
                width={1000}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 50, bottom: 50, }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cost" type='number' tickCount={10}>
                    <Label value="Work Cost ($M)" position='bottom' />
                </XAxis>

                <YAxis label={{ value: 'NPV ($M)', angle: -90, position: 'insideLeft' }} />
                <Line type="monotone" dataKey="npv" stroke="#8884d8" dot={false} />
            </LineChart >
        );
    }

    renderTable() {
        var round2 = (a) => { return `${a.toFixed(2)}` }
        var round1 = (a) => { return `${a.toFixed(1)}` }
        var perc = (a) => { return `${(100.0 * a).toFixed(1)}%` }



        const columns = [
            { dataField: 'way_id', text: "way_id", align: 'center', sort: true },
            { dataField: 'eirr', text: "eirr", sort: true, align: 'center', formatter: round2 },
            { dataField: 'esa_loading', text: "ESA Loading", sort: true, align: 'center', formatter: round2 },
            { dataField: 'npv', text: "NPV", sort: true, align: 'center', formatter: round2 },
            { dataField: 'npv_cost', text: "NPV Cost", sort: true, align: 'center', formatter: round2 },
            { dataField: 'npv_km', text: "NPV km", sort: true, align: 'center', formatter: round2 },
            { dataField: 'truck_percent', text: "Truck %", sort: true, align: 'center', formatter: perc },
            { dataField: 'vehicle_utilization', text: "Vehicle Utilization", sort: true, align: 'center', formatter: perc },
            { dataField: 'work_class', text: "Work Class", sort: true },
            { dataField: 'work_cost', text: "Work Cost", sort: true, align: 'center', formatter: round1 },
            { dataField: 'work_cost_km', text: "Work Cost / km", sort: true, align: 'center', formatter: round1 },
            { dataField: 'work_name', text: "Work Name", sort: true },
            { dataField: 'work_year', text: "Work Year", align: 'center', sort: true }
        ]

        return <BootstrapTable
            keyField='way_id'
            data={this.state.data}
            columns={columns}
            bordered={false}
            striped hover
        />;
    }

}
