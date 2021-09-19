'use strict';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';
import { getContext } from 'recompose';


import config from '../../config';
import GeneralConfig from './config/table/general_config';
import GrowthRateConfig from './config/table/growth_rate_config';
import TrafficLevelConfig from './config/table/traffic_level_config';
import RoadWorksConfig from './config/table/road_work_config';
import RecurrentMaintenanceConfig from './config/table/recurrent_maintenance_config';
import { FormDropdown } from './config/dropdown';

class ConfigSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'general',
            availableConfigs: {},
            configId: 1,
            configName: "Loading"
        }
        this.selectConfig = this.selectConfig.bind(this);
    }

    componentDidMount() {
        var user_config_url = `${config.api}/cba/user_configs`;
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => {
                this.setState({ availableConfigs: Object.fromEntries(res.map(e => [e.id, e])) });
                if (res.length > 0) { this.setState({ configId: res[0].id, configName: res[0].name }) }
            });
    }

    selectConfig(event) {
        const config = this.state.availableConfigs[event.target.value];
        this.setState({ configName: config.name, configId: config.id });
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
        var configName = this.state.configName;
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
        return <FormDropdown options={Object.values(this.state.availableConfigs)} onChange={this.selectConfig} />
    }

    renderConfigSelector_old(name) {
        var configItems = Object.entries(this.state.availableConfigs).map((entry) => {
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

    render() {
        let { title, configName, configId } = this.state

        var classLookup = {
            "general": GeneralConfig,
            "traffic-levels": TrafficLevelConfig,
            "growth-rates": GrowthRateConfig,
            "road-works": RoadWorksConfig,
            "recurrent-maintenance": RecurrentMaintenanceConfig,
        };

        var configState = { config_name: configName, config_id: configId };
        var configContainer = React.createElement(classLookup[title], configState);

        return (
            <div className='content-con'>
                <div className='content-con-left'>
                    {this.renderNavBox()}
                </div>
                <div className='content-con-right'> {configContainer} </div>
            </div>
        )
    }
};

export default getContext({ language: PropTypes.string })(ConfigSelector);