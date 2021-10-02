import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import config from '../../../../config';
import { floatifyEntries } from '../config_utils'

export default class RoadWorks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            road_works: [],
            modified: false
        };
    }

    pull_data_from_db() {
        var user_config_url = `${config.api}/cba/user_configs/${this.props.config_id}/sub_config/road_works`
        console.log("Setting up road_works config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => { console.log(res); this.setState({ road_works: res.road_works.alternatives }) });
    }

    push_data_to_db() {
        // Construct a map from index to { 'aadt': 25.0, ....}
        var uploadData = this.state.road_works.map((e) => floatifyEntries(e));
        const body = { road_works: { alternatives: uploadData } };
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


    componentDidMount() {
        this.pull_data_from_db();
    }



    componentWillUnmount() {
        this.push_data_to_db();
    }



    render() {
        // <TableHeaderColumn row='0' colSpan='4'>After Road Works Condition</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='3'>Bituminous Works Characteristics</TableHeaderColumn>
        // <TableHeaderColumn row='0' colSpan='1'>Future Periodic Maintenace</TableHeaderColumn>
        // <TableHeaderColumn row='1' dataField='number' isKey>Work Number</TableHeaderColumn>
        // <TableHeaderColumn row='1' width='150' dataField='name'>Work Name</TableHeaderColumn>
        const columns = [
            { dataField: 'code', text: "Work Code", sort: true },
            { dataField: 'work_class', text: "Work Class ", sort: true },
            { dataField: 'iri', text: "Roughness (IRI) ", sort: true },
            { dataField: 'cost_flat', text: "Flat", sort: true },
            { dataField: 'cost_hilly', text: "Hilly", sort: true },
            { dataField: 'cost_mountainous', text: "Mountainous", sort: true },
            { dataField: 'lanes_class', text: "Lanes Class(#)", sort: true },
            { dataField: 'width', text: "Width (m)", sort: true },
            { dataField: 'surface', text: "Surface (1 to 7)", sort: true },
            { dataField: 'thickness', text: "Periodic M.Thickness (mm)", sort: true },
            { dataField: 'strength', text: "Periodic M.Strength (#)", sort: true },
            { dataField: 'snc', text: "Rehab/Upgra Structural No (#)", sort: true },
            { dataField: 'repair', text: "Road Work Number", sort: true },
            { dataField: 'repair_period', text: "Interval (years)", sort: true }
        ];


        return <BootstrapTable
            keyField='code'
            data={this.state.road_works}
            columns={columns}
            bordered={false}
            cellEdit={cellEditFactory({ mode: 'click' })}
            striped hover
        />;
    }
}