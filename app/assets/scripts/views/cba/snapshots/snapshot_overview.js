'use strict';
import React from 'react';
import { PieChart, Cell, Pie, Sector, ResponsiveContainer } from 'recharts';
import { CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Table, ListGroup, Badge } from 'react-bootstrap';
import config from '../../../config';
import { renderActiveShape } from '../chart_utils'

function renameCol(obj, colName, colNameLu) {
    obj[colName] = colNameLu[obj[colName]] || obj[colName];
    return obj
}


export default class SnapshotOverview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            stats: {
                name: "",
                invalid_reasons: { "reasons": [], "way_ids": [] },
                num_records: 0,
                valid_records: 0
            },
            surfaceTypeBreakdown: [],
            snapshotId: this.props.snapshotId
        };
        this.onPieEnter = (_, index) => {
            this.setState({ activeIndex: index, });
        };
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    pull_data_from_db() {

        var lookup = { 1: "Cement Concrete", 2: "Asphalt Mix", 3: "Surface Treatment", 4: "Gravel", 5: "Earth", 6: "Macadam", 7: "Cobblestone" };
        if (this.state.snapshotId > 0) {
            var url = `${config.api}/cba/roads/snapshot/${this.state.snapshotId}/stats`;
            fetch(url)
                .then((res) => res.json())
                .then((res) => this.setState({ stats: res }));

            var url = `${config.api}/cba/roads/snapshot/${this.state.snapshotId}/stats/surface_type`;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    var surfaceType = res.map(x => renameCol(x, 'surface_type', lookup));
                    // console.log(surfaceType);
                    this.setState({ surfaceTypeBreakdown: surfaceType })
                });
        }
    }

    render() {
        return <div>
            {this.renderText()}
            {this.renderPie()}
            {this.renderErrorTable()}
        </div>
    }

    renderText() {
        var totalKm = this.state.surfaceTypeBreakdown.map((e) => e.length).reduce((a, b) => a + b, 0);
        return <div className="snapshot_stats_table">
            {this.renderPair("Name", this.state.stats.name)}
            {this.renderPair("Province", this.state.stats.province_name)}
            {this.renderPair("Num Assets", this.state.stats.num_records)}
            {this.renderPair("Created", this.state.stats.created_at)}
            {this.renderPair("Total KM", `${totalKm.toFixed(0)} km`)}
        </div>
    }

    renderPair(a, b) {
        return <div className="d-flex">
            <div className='w-25 snapshot_stats_label'>{a}</div>
            <div className='w-50 snapshot_stats_value'>{b}</div>
        </div>
    }

    renderPie() {

        var colours = {
            "Cobblestone": "#fef0d9",
            "Macadam": "#fdd49e",
            "Earth": "#fdbb84",
            "Gravel": "#fc8d59",
            "Surface Treatment": "#ef6548",
            "Asphalt Mix": "#d7301f",
            "Cement Concrete": "#990000"
        }
        // console.log(this.state.surfaceTypeBreakdown);
        var data = this.state.surfaceTypeBreakdown.map((e) => {
            return {
                valueStr: `${(e.length || 0.0).toFixed(1)} km`,
                fill: colours[e.surface_type] || '#dddddd',
                ...e
            }
        });

        return (
            <div className='mt-4' style={{ width: '600px', height: '350px' }}>
                <div className='text-muted fs-3'>Road Assets by Surface Type</div>
                <ResponsiveContainer>
                    <PieChart width={400} height={400}>
                        <Pie
                            activeIndex={this.state.activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#da251d88"
                            nameKey="surface_type"
                            dataKey="length"
                            onMouseEnter={this.onPieEnter}
                        >
                            {data.map((e, i) => (
                                <Cell key={`cell-${i}`} fill={e.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    renderErrorTable() {
        var li_reason = (e) => { return (<tr><td>{e[1]}</td><td>{e[0]}</td></tr>) };
        var li_way_id = (e) => { return (<tr><td>{e}</td></tr>) };
        if (Object.keys(this.state.stats.invalid_reasons.reasons).length == 0) { return; }
        console.log(">|" + JSON.stringify(this.state.stats.invalid_reasons));
        console.log("||" + JSON.stringify(this.state.stats.invalid_reasons.reasons));
        var table = <div className='mt-3'>
            <div className='text-muted fs-3'>Summary of Data Errors</div>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th># of Assets</th>
                        <th>Data Problem</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(this.state.stats.invalid_reasons.reasons).map(li_reason)}
                </tbody>
            </Table>
        </div>

        var ids = <div className='mt-3'>
            <div className='text-muted fs-3'>List of Invalid Way IDs</div>
            <Table striped size="sm">
                <thead>
                    <tr> <th># of Assets</th> </tr>
                </thead>
                <tbody>
                    {this.state.stats.invalid_reasons.way_ids.map(li_way_id)}
                </tbody>
            </Table>
        </div>

        return [table, ids]
    };




}
