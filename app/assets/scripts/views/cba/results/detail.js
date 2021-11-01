'use strict';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { CSVLink } from 'react-csv';
import { Spinner, Tab, Row, Col, Nav } from 'react-bootstrap';
import { AssetBreakdownChart, CostByYearChart, CumumlativeNPVChart, WorkByTypeChart } from './charts';
import RoadConditions from './road_condition';
import ResultsMap from './map';
import HelpOverlay from '../../help_overlay';
import config from '../../../config';


export default class ResultDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            assetBreakdown: {},
            provinceId: -1,
            districtId: -1,
            startingYear: 1990
        };
        this.csvRef = React.createRef();
    }

    componentDidMount() {
        this.pull_from_db()
    }

    pull_from_db() {
        fetch(`${config.api}/cba/results?snapshot_id=${this.props.snapshotId}&config_id=${this.props.configId}`)
            .then((res) => res.json())
            .then((res) => { this.setState({ data: res }); });

        fetch(`${config.api}/cba/results/kpis?snapshot_id=${this.props.snapshotId}&config_id=${this.props.configId}`)
            .then((res) => res.json())
            .then((r) => {
                this.setState({
                    provinceId: r.provinceId, districtId: r.districtId, startingYear: r.startingYear,
                    assetBreakdown: r.assetBreakdown
                });
            });
    }

    render() {

        // {this.renderTable()}
        if (this.state.data.length > 0) {
            return (<div>
                {this.renderHiddenDownloadButton()}
                {this.renderCharts()}
            </div>);
        } else {
            return <div className='mx-auto text-center'>
                <Spinner animation="border" role="status" variant='danger'>
                    <span className="visually-hidden">Results Loading...</span>
                </Spinner>
            </div>
        }
    }

    renderHiddenDownloadButton() {
        return <CSVLink
            className="btn hidden"
            target="_blank"
            ref={this.csvRef}
            filename={`CBA_results_config-${this.props.configId}_snapshot-${this.props.snapshotId}.csv`}
            data={this.state.data}
        />
    }

    renderCharts() {
        var assetHelpText = "An overview of the assets which were evaluated.";
        var workTypeHelpText = "Which types of work are recommended";
        var roadCondHelpText = "What are the implications of not following the work program";
        var cbyHelpText = "The program costs laid out by year.";
        var npvHelpText = "Visualisation of the benefits of the recommended program";
        return <Tab.Container id="left-tabs-example" defaultActiveKey="map">
            <Row>
                <Col sm={2}>
                    <Nav fill variant="pills" className="flex-column mt-5">
                        <Nav.Item>
                            <Nav.Link eventKey="assets" >
                                <HelpOverlay helpText={assetHelpText} children={<div>Asset Overview</div>} />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="work_type">
                                <HelpOverlay helpText={workTypeHelpText} children={<div>Program Overview </div>} />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="road_condition">
                                <HelpOverlay helpText={roadCondHelpText} children={<div>Road Condition</div>} />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cost_by_year">
                                <HelpOverlay helpText={cbyHelpText} children={<div>Cost by Year</div>} />
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cum_npv">
                                <HelpOverlay helpText={npvHelpText}><div>Cumulative NPV</div></HelpOverlay>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="map">
                                <HelpOverlay helpText="View asset information geographically." placement='right'><div>Map</div></HelpOverlay>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={10}>
                    <Tab.Content>
                        <Tab.Pane eventKey="assets">
                            <AssetBreakdownChart data={this.state.assetBreakdown} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="work_type">
                            <WorkByTypeChart data={this.state.data} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="road_condition">
                            <RoadConditions data={this.state.data} startingYear={this.state.startingYear} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="cost_by_year">
                            <CostByYearChart data={this.state.data} startingYear={this.state.startingYear} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="cum_npv">
                            <CumumlativeNPVChart data={this.state.data} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="map">
                            <ResultsMap data={this.state.data}
                                startingYear={this.state.startingYear}
                                configId={this.props.configId} snapshotId={this.props.snapshotId}
                                provinceId={this.state.provinceId} districtId={this.state.districtId}
                            />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    }

    renderTable() {
        var round2 = (a) => { return a ? `${a.toFixed(2)}` : 'NaN' }
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

        // nconsole.log(this.state.data[0]);
        return <BootstrapTable
            keyField='id'
            data={this.state.data}
            columns={columns}
            bordered={false}
            striped hover
        />;
    }

}
