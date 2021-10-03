'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { Tab, Tabs } from 'react-bootstrap'
import SitePage from '../../components/site-page';
import SnapshotSelector from './snapshot_selector';
import ConfigSelector from './config_selector';
import CbaResults from './cba_results';

class CbaMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSnapshotId: undefined,
            selectedConfigId: undefined
        }
    }

    componentDidMount() {
    }

    renderAnalysisBox() {
        return (
            <div className='analysis-con'>
                <p>Select a snapshot from the left to get started</p>
                <p>This is where the content relating to the results of the selected snapshot will be shown</p>
                <p> Selected: {this.state.selectedSnapshotId}</p>
            </div>
        )
    }

    renderInnerPage() {
        // let { title, config_name, config_id } = this.state

        // var configState = { config_name: config_name, config_id: config_id };
        // console.log("Creating a new " + title + ": " + configState['config_id']);
        // var configContainer = React.createElement(classLookup[title], configState);
        // console.log("DONE: Creating a new " + configContainer);

        return (
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="">
                <Tab eventKey="RoadAssets" title="Road Assets" tabClassName='cba_tab_header'>
                    <SnapshotSelector selectSnapshotFn={(id) => { this.setState({ selectedSnapshotId: id }) }} />
                </Tab>
                <Tab eventKey="Configuration" title="Configuration" tabClassName='cba_tab_header'>
                    <ConfigSelector selectConfigFn={(id) => { this.setState({ selectedConfigId: id }) }} />
                </Tab>
                <Tab eventKey="Results" title="Results" tabClassName='cba_tab_header'>
                    <CbaResults snapshotId={this.state.selectedSnapshotId} configId={this.state.selectedConfigId} />
                </Tab>
            </Tabs>
            // </div>
        )
    }

    render() {
        return (<SitePage pageName="CBA" innerPage={this.renderInnerPage()} noMargins={false} subPageNav={[]} />);
    }
};

export default getContext({ language: PropTypes.string })(CbaMainPage);

