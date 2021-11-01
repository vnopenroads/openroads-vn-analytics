'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { Tab, Tabs } from 'react-bootstrap'
import SitePage from '../../components/site-page';
import SnapshotSelector from './snapshot_selector';
import ConfigSelector from './config_selector';
import CbaResults from './cba_results';
import { CbaVersion } from './cba_version'

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

    renderInnerPage() {
        // let { title, config_name, config_id } = this.state

        // var configState = { config_name: config_name, config_id: config_id };
        // console.log("Creating a new " + title + ": " + configState['config_id']);
        // var configContainer = React.createElement(classLookup[title], configState);
        // console.log("DONE: Creating a new " + configContainer);

        return (
            <Tabs defaultActiveKey="Configuration" id="uncontrolled-tab-example" className="">
                <Tab eventKey="RoadAssets" title="Road Assets" tabClassName='cba_tab_header'>
                    <SnapshotSelector />
                </Tab>
                <Tab eventKey="Configuration" title="Configuration" tabClassName='cba_tab_header'>
                    <ConfigSelector />
                </Tab>
                <Tab eventKey="Results" title="Results" tabClassName='cba_tab_header'>
                    <CbaResults />
                </Tab>
            </Tabs>
            // </div>
        )
    }

    render() {
        var tag = <h1 className="site__title ms-0"><strong>v{CbaVersion}</strong></h1>;
        return (<SitePage pageName="CBA" pageNameTag={tag} innerPage={this.renderInnerPage()} noMargins={false} subPageNav={[]} />);
    }
};

export default getContext({ language: PropTypes.string })(CbaMainPage);

