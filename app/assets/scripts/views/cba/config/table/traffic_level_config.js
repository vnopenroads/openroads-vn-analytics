import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';
import { floatifyEntries } from '../config_utils'

export default class TrafficLevels extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            traffic_levels: { by_level: [] },
            modified: false
        };

        this.data_array = [];
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    update_data(new_data) {
        this.data_array.splice(0, Infinity, ...this.jsonToArray(new_data))
        this.setState({ traffic_levels: new_data })
    }


    jsonToArray(json_blob) {
        return ('by_level' in json_blob) ? Object.values(json_blob['by_level']) : [];
    }

    arrayToJson(arr) {
        return Object.fromEntries(
            // Construct a map from index to { 'aadt': 25.0, ....}
            arr.map((e, i) => ["" + i, floatifyEntries(e)])
        );
    }

    componentWillUnmount() {
        this.push_data_to_db()
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/sub_config/traffic_levels`
        console.log("Setting up traffic_level config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => this.update_data(res.traffic_levels));
    }

    push_data_to_db() {
        const body = { traffic_levels: { by_level: this.arrayToJson(this.data_array) } };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

        var url = `${config.api}/cba/user_configs/${this.props.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.config_id !== prevProps.config_id) {
            this.push_data_to_db()
            this.setState({ config_id: this.props.config_id, config_name: this.props.config_name });
            this.pull_data_from_db()
        }
    }

    render() {
        const columns = [
            { dataField: 'aadt', text: "Volume", sort: true },
            { dataField: 'struct_no', text: "Struct. #", sort: true },
            { dataField: 'motorcycle', text: "Motor Cycle", sort: true },
            { dataField: 'small_car', text: "Small Car", sort: true },
            { dataField: 'medium_car', text: "Medium Car", sort: true },
            { dataField: 'delivery', text: "Delivery Vehicle", sort: true },
            { dataField: 'four_wheel_drive', text: "4-Wheel Drive", sort: true },
            { dataField: 'light_truck', text: "Light Truck", sort: true },
            { dataField: 'medium_truck', text: "Medium Truck", sort: true },
            { dataField: 'heavy_truck', text: "Heavy Truck", sort: true },
            { dataField: 'small_bus', text: "Small Bus", sort: true },
            { dataField: 'medium_bus', text: "Medium Bus", sort: true },
            { dataField: 'large_bus', text: "Large Bus", sort: true }
        ]

        return <BootstrapTable
            keyField='aadt'
            data={this.data_array}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}
