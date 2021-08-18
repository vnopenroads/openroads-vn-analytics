import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';

export default class RecurrentMaintenanceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recurrent_maintenance: [],
            modified: false
        };
    }

    componentDidMount() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/recurrent_maintenance`
        console.log("Setting up recurrent_maintenance config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            //  .then((res) => this.setState({ road_works: res.road_works }));
            .then((res) => this.setState({ recurrent_maintenance: [] }));
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
        const body = { recurrent_maintenance: this.state.recurrent_maintenance };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

        var url = `${config.api}/cba/user_configs/${this.props.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }

    render() {

        // <TableHeaderColumn row='0' rowSpan='2' dataField='type' isKey>Surface Type</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='7'>Number of Lanes Class</TableHeaderColumn>
        const columns = [
            { dataField: 'OL', text: "1: One Lane", sort: true },
            { dataField: 'NTL', text: "2: Narrow Two Lanes", sort: true },
            { dataField: 'TL', text: "3: Two Lanes", sort: true },
            { dataField: 'WTL', text: "4: Wide Two Lanes", sort: true },
            { dataField: 'FL', text: "5: Four Lanes", sort: true },
            { dataField: 'SL', text: "6: Six Lanes", sort: true },
            { dataField: 'EL', text: "7: Eight Lanes", sort: true },
        ]


        console.log(this.state);
        return <BootstrapTable
            keyField='volume'
            data={this.state.recurrent_maintenance}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}
