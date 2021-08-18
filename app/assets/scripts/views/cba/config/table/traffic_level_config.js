import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';

export default class TrafficLevels extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            traffic_levels: [],
            modified: false
        };
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/traffic_levels`
        console.log("Setting up traffic_level config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => this.setState({ traffic_levels: res.traffic_levels }));
    }

    floatifyEntries(e) {
        return Object.fromEntries(
            Object.entries(e).map(([key, val]) => [key, parseFloat(val)])
        );
    };

    floatifyArray(es) {
        return es.map((e) => this.floatifyEntries(e))
    }

    componentWillUnmount() {

        const body = { traffic_levels: this.floatifyArray(this.state.traffic_levels) };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

        var url = `${config.api}/cba/user_configs/${this.props.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps);
        console.log(this.props);
        // Typical usage (don't forget to compare props):
        if (this.props.config_id !== prevProps.config_id) {
            this.setState({ config_id: this.props.config_id, config_name: this.props.config_name });
            this.pull_data_from_db()
        }
    }

    render() {
        const columns = [
            { dataField: 'volume', text: "Volume", sort: true },
            { dataField: 'motor-cycle', text: "Motor Cycle", sort: true },
            { dataField: 'small-car', text: "Small Car", sort: true },
            { dataField: 'medium-car', text: "Medium Car", sort: true },
            { dataField: 'delivery', text: "Delivery Vehicle", sort: true },
            { dataField: '4-wheel', text: "4 Wheel Drive", sort: true },
            { dataField: 'light-truck', text: "Light Truck", sort: true },
            { dataField: 'medium-truck', text: "Medium Truck", sort: true },
            { dataField: 'heavy-truck', text: "Heavy Truck", sort: true },
            { dataField: 'small-bus', text: "Small Bus", sort: true },
            { dataField: 'medium-bus', text: "Medium Bus", sort: true },
            { dataField: 'large-bus', text: "Large Bus", sort: true }
        ]

        return <BootstrapTable
            keyField='volume'
            data={this.state.traffic_levels}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}