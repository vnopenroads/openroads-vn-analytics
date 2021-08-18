

import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';

export default class GrowthRateConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config_id: props.config_id,
            growth_rates: [],
            modified: false
        };
    }

    componentDidMount() {
        var user_config_url = `${config.api}/cba/user_configs/${this.state.config_id}/growth_rates`
        console.log("Setting up growth_rates config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            //  .then((res) => this.setState({ road_works: res.road_works }));
            .then((res) => this.setState({ growth_rates: [] }));
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
        const body = { growth_rates: this.state.growth_rates };
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };

        var url = `${config.api}/cba/user_configs/${this.state.config_id}/update`
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); });
    }

    render() {
        // <TableHeaderColumn row='0' rowSpan='2' dataField='growth-scenario' isKey>Traffic Annual Growth Scenario</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='11'>Annual Traffic Growth Rate (%/year)</TableHeaderColumn>
        const columns = [
            { dataField: 'motor-cycle', text: "Motor Cycle (veh/day)", sort: true },
            { dataField: 'small-car', text: "Small Car(veh/ day) ", sort: true },
            { dataField: 'medium-car', text: "Medium Car (veh/day)", sort: true },
            { dataField: 'delivery', text: "Delivery Vehicle (veh/day)", sort: true },
            { dataField: '4-whell', text: "4 Wheel Drive (veh/day)", sort: true },
            { dataField: 'light-truck', text: "Light Truck (veh/day)", sort: true },
            { dataField: 'medium-truck', text: "Medium Truck (veh/day)", sort: true },
            { dataField: 'heavy-truck', text: "Heavy Truck (veh/day)", sort: true },
            { dataField: 'small-bus', text: "Small Bus (veh/day)", sort: true },
            { dataField: 'medium-bus', text: "Medium Bus (veh/day)", sort: true },
            { dataField: 'large-bus', text: "Large Bus (veh/day", sort: true },
        ]

        return <BootstrapTable
            keyField='volume'
            data={this.state.growth_rates}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}
