'use strict';
import React from 'react';
import { Button, Form, OverlayTrigger, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { Check, Trash } from 'react-bootstrap-icons';


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
            configId: -1,
            configName: "Loading",
            showAlert: false
        }
        this.selectConfig = this.selectConfig.bind(this);
        this.duplicate = this.duplicate.bind(this);
        this.rename = this.rename.bind(this);
        this.delete = this.delete.bind(this);
        this.renameRef = React.createRef();
    }

    componentDidMount() {
        this.pull_from_db();
    }

    pull_from_db() {
        var user_config_url = `${config.api}/cba/user_configs`;
        fetch(user_config_url)
            .then((res) => res.json())
            .then((res) => {
                var availableConfigs = Object.fromEntries(res.map(e => [e.id, e]));
                // console.log(`availableConfigs: ${JSON.stringify(availableConfigs)}`);
                var newState = { availableConfigs: availableConfigs };
                if (res.length > 0) {
                    var firstConfig = availableConfigs[Object.keys(availableConfigs)[0]];
                    //console.log(`firstConfig: ${JSON.stringify(firstConfig)}`);
                    newState = { ...newState, ...{ configId: firstConfig.id, configName: firstConfig.name } };
                }
                this.setState(newState);
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
                <div className='config-name'> {this.renderConfigSelector()} </div>
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
    renderConfigSelector() {
        let { configName, configId } = this.state
        // <button type="button" class="btn-close" onClick={alertOff} data-bs-dismiss="alert" aria-label="Close"></button>
        var renameDiv = <Popover id="popover-basic">
            <Popover.Body>
                <div className='d-flex'>
                    <Form.Control sm="10" ref={this.renameRef} />
                    <Button variant='light' className='ms-1' onClick={this.rename} > <Check /> </Button>
                </div>
            </Popover.Body>
        </Popover>
        return <div>
            <FormDropdown options={Object.values(this.state.availableConfigs)} onChange={this.selectConfig} />
            <OverlayTrigger trigger="click" placement="right" overlay={renameDiv} rootClose={true}>
                <Button variant="outline-secondary" onClick={this.rename} className='ms-1' disabled={configId == 1} >Rename</Button>
            </OverlayTrigger>
            <Button variant="outline-secondary" onClick={this.duplicate} className='ms-1' >Copy</Button>
            <Button className='sm-trash ms-1' variant='danger' type='button' disabled={configId == 1} onClick={this.delete} ><Trash /></Button>
        </div>
    }

    rename() {
        console.log("renaming");
        const body = { config_id: this.state.configId, new_name: this.renameRef.current.value };
        var url = `${config.api}/cba/user_configs/rename`
        this.post_to(body, url)
    }

    duplicate() {
        const body = { config_id: this.state.configId, new_name: `Copy of ${this.state.configName}` };
        var url = `${config.api}/cba/user_configs/duplicate`
        this.post_to(body, url)
    }

    delete() {
        console.log("deleting");
        const body = { config_id: this.state.configId };
        var url = `${config.api}/cba/user_configs/delete`
        this.post_to(body, url)
    }

    post_to(body, url) {
        const request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
        fetch(url, request)
            .then(res => res.json())
            .then(res => { console.log(res); this.pull_from_db(); });
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

        var configProps = { config_name: configName, config_id: configId, key: `${configId}` };
        //console.log(`configProps: ${JSON.stringify(configProps)}`)
        var configContainer = React.createElement(classLookup[title], configProps);

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