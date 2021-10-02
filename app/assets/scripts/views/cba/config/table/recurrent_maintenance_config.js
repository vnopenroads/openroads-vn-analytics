import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';
import { floatifyEntries } from '../config_utils'
import _ from 'lodash';

export default class RecurrentMaintenanceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = { recurrent_maintenance: {} };
        this.data_array = [];
    }

    update_data(new_data) {
        this.data_array.splice(0, Infinity, ...this.jsonToArray(new_data))
        this.setState({ recurrent_maintenance: new_data })
    }

    jsonToArray(json_blob) {
        return Object.keys(json_blob).map((surface_type) => {
            return { surface_type: surface_type, ...json_blob[surface_type] }
        });
    }

    arrayToJson(arr) {
        return Object.fromEntries(arr.map((e) => {
            return [e.surface_type, floatifyEntries(_.omit(e, 'surface_type'))];
        }));
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/sub_config/recurrent_maintenance`
        console.log("Setting up recurr maint config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => this.update_data(res.recurrent_maintenance));
    }

    componentDidMount() {
        this.pull_data_from_db()
    }

    componentWillUnmount() {
        this.push_data_to_db();
    }

    push_data_to_db() {
        console.log("PUSHING");

        const body = { recurrent_maintenance: this.arrayToJson(this.data_array) };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

        var url = `${config.api}/cba/user_configs/${this.props.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }

    render() {


        const toTitleCase = (str) => str.split('_').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ');
        const round = (a) => {
            return `${parseFloat(a).toFixed(0)}`
        }
        const columns = [
            { dataField: 'surface_type', text: "Surface Type", sort: true, formatter: toTitleCase },
            { dataField: 'one_lane', text: "One Lane", sort: true, formatter: round },
            { dataField: 'two_lanes_narrow', text: "Narrow Two Lanes", sort: true, formatter: round },
            { dataField: 'two_lanes', text: "Two Lanes", sort: true, formatter: round },
            { dataField: 'two_lanes_wide', text: "Wide Two Lanes", sort: true, formatter: round },
            { dataField: 'four_lanes', text: "Four Lanes", sort: true, formatter: round },
            { dataField: 'six_lanes', text: "Six Lanes", sort: true, formatter: round },
            { dataField: 'eight_lanes', text: "Eight Lanes", sort: true, formatter: round },
        ]


        console.log(this.state);
        return <BootstrapTable
            keyField='surface_type'
            data={this.data_array}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}
