'use strict';
import React from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Table, ListGroup, Badge } from 'react-bootstrap';
import config from '../../../config';

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
                invalid_reasons: [],
                num_records: 0,
                valid_records: 0

            },
            snapshotId: this.props.snapshotId
        };
        this.onPieEnter = (_, index) => {
            this.setState({ activeIndex: index, });
        };

        this.data = [
            { name: 'Group A', value: (200 * Math.random()) | 0 },
            { name: 'Group B', value: (200 * Math.random()) | 0 },
            { name: 'Group C', value: (200 * Math.random()) | 0 },
            { name: 'Group D', value: (200 * Math.random()) | 0 },
        ];
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
                    console.log(res);
                    var surfaceType = res.map(x => renameCol(x, 'surface_type', lookup));
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
        return <div className="snapshot_stats_table">
            {this.renderPair("Name", this.state.stats.name)}
            {this.renderPair("Province", this.state.stats.province_name)}
            {this.renderPair("Num Assets", this.state.stats.num_records)}
            {this.renderPair("Created", this.state.stats.created_at)}
        </div>
    }

    renderPair(a, b) {
        return <div className="d-flex">
            <div className='w-25 snapshot_stats_label'>{a}</div>
            <div className='w-50 snapshot_stats_value'>{b}</div>
        </div>
    }

    renderPie() {
        return (
            <div className='mt-4' style={{ width: '600px', height: '350px' }}>
                <div className='text-muted fs-3'>Road Assets by Surface Type</div>
                <ResponsiveContainer>
                    <PieChart width={400} height={400}>
                        <Pie
                            activeIndex={this.state.activeIndex}
                            activeShape={this.renderActiveShape}
                            data={this.state.surfaceTypeBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#da251d88"
                            nameKey="surface_type"
                            dataKey="length"
                            onMouseEnter={this.onPieEnter}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    renderErrorTable() {
        var li_reason = (e) => { return (<tr><td>{e[1]}</td><td>{e[0]}</td></tr>) };
        if (Object.keys(this.state.stats.invalid_reasons).length == 0) { return; }
        console.log("||" + JSON.stringify(this.state.stats.invalid_reasons));
        return <div className='mt-3'>
            <div className='text-muted fs-3'>Summary of Data Errors</div>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th># of Assets</th>
                        <th>Data Problem</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(this.state.stats.invalid_reasons).map(li_reason)}
                </tbody>
            </Table>
        </div>
    };


    renderActiveShape(props) {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        // console.log(JSON.stringify(payload));
        var surface_type = payload.surface_type || "Not Specified"

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {surface_type}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value.toFixed(1)} km`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };



}


// function blah {
//     import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
//     const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, ...];
// 
//     const renderLineChart = (
//         <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//             <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//         </LineChart>
//     );
// }
