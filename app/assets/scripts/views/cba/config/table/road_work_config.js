import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';

export default class RoadWork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            road_works: [7],
            modified: false
        };
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/road_works`
        console.log("Setting up road_works config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            //  .then((res) => this.setState({ road_works: res.road_works }));
            .then((res) => this.setState({ road_works: [] }));
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
        const body = { road_works: this.state.road_works };
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
        // const columns = [
        //     { dataField: 'volume', text: "Volume", sort: true },
        //     { dataField: 'motor-cycle', text: "Motor Cycle", sort: true },
        //     { dataField: 'small-car', text: "Small Car", sort: true },
        //     { dataField: 'medium-car', text: "Medium Car", sort: true },
        //     { dataField: 'delivery', text: "Delivery Vehicle", sort: true },
        //     { dataField: '4-wheel', text: "4 Wheel Drive", sort: true },
        //     { dataField: 'light-truck', text: "Light Truck", sort: true },
        //     { dataField: 'medium-truck', text: "Medium Truck", sort: true },
        //     { dataField: 'heavy-truck', text: "Heavy Truck", sort: true },
        //     { dataField: 'small-bus', text: "Small Bus", sort: true },
        //     { dataField: 'medium-bus', text: "Medium Bus", sort: true },
        //     { dataField: 'large-bus', text: "Large Bus", sort: true }
        // ]
        // <TableHeaderColumn row='0' colSpan='5'>Road Work </TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='3'>Road Work Unit Cost ($/m2)</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='4'>After Road Works Condition</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='3'>Bituminous Works Characteristics</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='1'>Future Periodic Maintenace</TableHeaderColumn>
        // <TableHeaderColumn row='1' dataField='number' isKey>Work Number</TableHeaderColumn>
        // <TableHeaderColumn row='1' width='150' dataField='name'>Work Name</TableHeaderColumn>
        const columns = [
            { dataField: 'code', text: "Work Code", sort: true },
            { dataField: 'class', text: "Work Class ", sort: true },
            { dataField: 'roughness', text: "Roughness (IRI) ", sort: true },
            { dataField: 'flat', text: "Flat Terrain", sort: true },
            { dataField: 'hilly', text: "Hilly Terrain", sort: true },
            { dataField: 'mountainous', text: "Mountainous Terrain", sort: true },
            { dataField: 'lanes-class', text: "Lanes Class(#)", sort: true },
            { dataField: 'width', text: "Width (m)", sort: true },
            { dataField: 'surface', text: "Surface (1 to 7)", sort: true },
            { dataField: 'thickness', text: "Periodic M.Thickness (mm)", sort: true },
            { dataField: 'strength', text: "Periodic M.Strength (#)", sort: true },
            { dataField: 'structural-no', text: "Rehab/Upgra Structural No (#)", sort: true },
            { dataField: 'RW-num', text: "Road Work Number", sort: true },
            { dataField: 'interval', text: "Interval (years)", sort: true }
        ];


        console.log(this.state);
        return <BootstrapTable
            keyField='volume'
            data={this.state.road_works}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}