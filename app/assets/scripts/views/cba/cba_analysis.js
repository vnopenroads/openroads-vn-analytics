'use strict';
import React from 'react';
import SitePage from '../../components/site-page';
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { StatsTableHeader, StatsTableRow, StatsBar, StatsBlock } from '../../components/admin-stats-tables';
import T, { translate } from '../../components/t';
import TakeSnapshotModal from './take_snapshot_modal';

import config from '../../config';
import { Button } from 'react-bootstrap';

class SnapshotStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className='snapshot-stats'>
            <h3>{this.props.name}</h3>
            <figure>
                <StatsBar total={this.props.total} completed={this.props.valid} />
                <figcaption>
                    <ul className='stats-list'>
                        {this.props.list.map(({ label, value }) => (
                            <li key={label} className='stats-list__item'><span className='value'>{value}</span><small>{label}</small></li>
                        ))}
                    </ul>
                </figcaption>
            </figure>
        </div>

    }

}

class CbaAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            takeSnapshotModalOpen: false,
            snapshots: -1
        }
        this.snapshotModalElement = React.createRef();
        this.handleTakeSnapshot = this.handleTakeSnapshot.bind(this);
        this.handleSnapshotTaken = this.handleSnapshotTaken.bind(this);
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    pull_data_from_db() {
        var url = `${config.api}/cba/roads/snapshots`;
        fetch(url)
            .then((res) => res.json())
            .then((res) => { this.setState({ snapshots: res }) });
    }

    // selectConfig(e) {
    //     this.setState({ config_name: this.state.available_configs[e].name, config_id: e })
    // }

    navElement(title, tag) {
        // var className = (this.state.title === tag) ? 'nav-con-active' : 'nav-con-default'
        // return (
        //     <div key={tag} className={className} onClick={() => { this.setState({ title: tag }) }}>
        //         {title}
        //     </div>
        // )
    }

    renderSnapshot(e) {
        var language = "en";

        var perc = Math.round(100.0 * e.valid_records / e.num_records);
        const progressIndicators = [
            { label: translate(language, 'Total'), value: e.num_records },
            { label: translate(language, 'Valid'), value: `${e.valid_records} (${perc}%)` }
        ];
        return (<div className='snapshot-el'>
            <SnapshotStats
                snapshot_id={e.id}
                name={e.name}
                total={e.num_records}
                valid={e.valid_records}
                list={progressIndicators} />
        </div>)
    }

    getSnapshotItems() {
        if (this.state.snapshots === -1) {
            return <div className="snapshot-loading"><div /></div>
        } else {
            return this.state.snapshots.map(this.renderSnapshot);
        }
    }

    handleTakeSnapshot(e) {
        this.snapshotModalElement.current.setState({ show: true });
    }

    handleSnapshotTaken() {
        this.pull_data_from_db();
    }

    takeSnapshot() {
        return (
            <div className='snapshot-controls-con'>
                <Button variant="primary" onClick={this.handleTakeSnapshot}>
                    Take Snapshot Now
                </Button>

                <TakeSnapshotModal
                    show={this.state.takeSnapshotModalOpen}
                    ref={this.snapshotModalElement}
                    onSnapshotTaken={this.handleSnapshotTaken}
                />
            </div>
        );
    }

    renderSnapshotSelector() {
        return (
            <div className='snapshot-con'>
                <div className='title-con'>Road Asset Snapshots</div>
                {this.getSnapshotItems()}
                {this.takeSnapshot()}
            </div>
        )
        //         <div className='title-con'>Configuration</div>
        //         <div className='config-name'> {this.renderConfigSelector(configName)} </div>
        //         <div className='nav-con'>
        //             {this.navElement('General', 'general')}
        //             {this.navElement('Growth Rate', 'growth-rates')}
        //             {this.navElement('Traffic Levels', 'traffic-levels')}
        //             {this.navElement('Road Works', 'road-works')}
        //             {this.navElement('Recurrent Maintenance', 'recurrent-maintenance')}
        //         </div>
        //     </div>
        //  )
    }

    renderAnalysisBox() {
        return (
            <div className='analysis-con'>
                <p>Select a snapshot from the left to get started</p>
                <p>This is where the content relating to results of the selected snapshot will be shown</p>
            </div>
        )
        // var configItems = Object.entries(this.state.available_configs).map((entry) => {
        //     const [id, e] = entry;
        //     return (<Dropdown.Item key={id} eventKey={id} onSelect={this.selectConfig}> {e.name} </Dropdown.Item>)
        // }
        // );

        // return (
        //     <Dropdown title="Choose a saved Config">
        //         <Dropdown.Toggle id="dropdown-basic" variant='outline-secondary' >
        //             {name}
        //         </Dropdown.Toggle>
        //         <Dropdown.Menu>
        //             {configItems}
        //         </Dropdown.Menu>
        //     </Dropdown>
        // )
    }

    renderInnerPage() {
        // let { title, config_name, config_id } = this.state

        // var configState = { config_name: config_name, config_id: config_id };
        // console.log("Creating a new " + title + ": " + configState['config_id']);
        // var configContainer = React.createElement(classLookup[title], configState);
        // console.log("DONE: Creating a new " + configContainer);

        return (
            <div className='content-con'>
                {this.renderSnapshotSelector()}
                {this.renderAnalysisBox()}
            </div>
        )
    }

    render() {
        var { language } = this.props;
        console.log("Rendering stuff: " + language);
        var subPageNav = ["Analysis", "Config"];
        return (<SitePage pageName="CBA" innerPage={this.renderInnerPage()} noMargins={true} subPageNav={subPageNav} language={language} />);
    }
};

export default getContext({ language: PropTypes.string })(CbaAnalysis);

