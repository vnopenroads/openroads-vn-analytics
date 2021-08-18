'use strict';
import React from 'react';
import SitePage from '../../components/site-page';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';
import { getContext } from 'recompose';


import GeneralConfig from './config/table/general_config';
import GrowthRateConfig from './config/table/growth_rate_config';
import TrafficLevelConfig from './config/table/traffic_level_config';
import RoadWorksConfig from './config/table/road_work_config';
import RecurrentMaintenanceConfig from './config/table/recurrent_maintenance_config';
import { config } from 'chai';

class CbaConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'general',
            general: { config_id: 1, config_name: "jamie", discount_rate: 0.12, economic_factor: 1.2 },
            "traffic-levels": { discount_rate: 0.12, economic_factor: 1.2 },
            available_configs: {},
            config_id: 1,
            config_name: "Loading"
        }
        this.selectConfig = this.selectConfig.bind(this);
    }

    componentDidMount() {
        var user_config_url = 'http://localhost:4000/cba/user_configs';
        console.log("Setting up general config: " + user_config_url);
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => {
                var configs = {};
                for (var e of res) {
                    configs[e.id] = e;
                }
                this.setState({ available_configs: configs })
                this.selectConfig(1);
            });
    }

    selectConfig(e) {
        this.setState({ config_name: this.state.available_configs[e].name, config_id: e })
    }

    navElement(title, tag) {
        var className = (this.state.title === tag) ? 'nav-con-active' : 'nav-con-default'
        return (
            <div key={tag} className={className} onClick={() => { this.setState({ title: tag }) }}>
                {title}
            </div>
        )
    }

    renderNavBox() {
        var configName = this.state.config_name;
        return (
            <div className='menu-con'>
                <div className='title-con'>Configuration</div>
                <div className='config-name'> {this.renderConfigSelector(configName)} </div>
                <div className='nav-con'>
                    {this.navElement('General', 'general')}
                    {this.navElement('Growth Rate', 'growth-rates')}
                    {this.navElement('Traffic Levels', 'traffic-levels')}
                    {this.navElement('Road Works', 'road-works')}
                    {this.navElement('Recurrent Maintenance', 'recurrent-maintenance')}
                </div>
            </div>
        )

    }

    renderConfigSelector(name) {
        var configItems = Object.entries(this.state.available_configs).map((entry) => {
            const [id, e] = entry;
            return (<Dropdown.Item key={id} eventKey={id} onSelect={this.selectConfig}> {e.name} </Dropdown.Item>)
        }
        );

        return (
            <Dropdown title="Choose a saved Config">
                <Dropdown.Toggle id="dropdown-basic" variant='outline-secondary' >
                    {name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {configItems}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    renderInnerPage() {
        let { title, config_name, config_id } = this.state

        // var configContainer = 
        var classLookup = {
            "general": GeneralConfig,
            "traffic-levels": TrafficLevelConfig,
            "growth-rates": GrowthRateConfig,
            "road-works": RoadWorksConfig,
            "recurrent-maintenance": RecurrentMaintenanceConfig,
        };

        var configState = { config_name: config_name, config_id: config_id };
        console.log("Creating a new " + title + ": " + configState['config_id']);
        var configContainer = React.createElement(classLookup[title], configState);
        console.log("DONE: Creating a new " + configContainer);

        return (
            <div className='content-con'>
                <div className='content-con-left'>
                    {this.renderNavBox()}
                </div>
                <div className='content-con-right'> {configContainer} </div>
            </div>
        )
    }

    render() {
        console.log("Rendering stuff: " + this.state.config_id);
        var subPageNav = ["Results", "Config"];
        var { language } = this.props;
        return (<SitePage pageName="CBA" innerPage={this.renderInnerPage()} noMargins={true} subPageNav={subPageNav} language={language} />);
    }
};

export default getContext({ language: PropTypes.string })(CbaConfig);