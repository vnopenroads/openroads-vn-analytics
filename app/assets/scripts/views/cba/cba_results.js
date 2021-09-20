'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { getContext } from 'recompose';

import { DropdownButton, Form, Button } from 'react-bootstrap';

import config from '../../config';
import { FormDropdown } from './config/dropdown';
import ResultsTable from './results/table';
import ResultKpis from './results/result_kpis';


class CbaResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSnapshotId: -1,
            selectedConfigId: -1,
            availableSnapshots: [],
            availableConfigs: [],
            availableResults: {},
            results: []
        };
        this.selectConfig = this.selectConfig.bind(this);
        this.selectSnapshot = this.selectSnapshot.bind(this);
        this.run = this.run.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        this.pull_from_db()
    }

    pull_from_db() {
        fetch(`${config.api}/cba/user_configs`).then((res) => res.json())
            .then((res) => {
                this.setState({ availableConfigs: res })
                if (res.length > 0) {
                    this.setState({ selectedConfigId: res[0].id })
                }
            });
        fetch(`${config.api}/cba/roads/snapshots`)
            .then((res) => res.json())
            .then((res) => {
                this.setState({ availableSnapshots: res })
                if (res.length > 0) {
                    this.setState({ selectedSnapshotId: res[0].id })
                }
            });

        fetch(`${config.api}/cba/results`)
            .then((res) => res.json())
            .then((res) => {
                this.setState({ availableResults: Object.fromEntries(res.map(e => [[e.snapshot_id, e.config_id], true])) });
            });
    }

    selectConfig(e) { this.setState({ selectedConfigId: e.target.value }); }

    selectSnapshot(e) { this.setState({ selectedSnapshotId: e.target.value }); }

    resultsAvailable() {
        return this.state.availableResults[[this.state.selectedSnapshotId, this.state.selectedConfigId]]
    }

    run() {
        console.log("RUNNING");
        fetch(`${config.api}/cba/run?snapshot_id=${this.state.selectedSnapshotId}&config_id=${this.state.selectedConfigId}`)
            .then((res) => res.json())
            .then((res) => this.pull_from_db());
    }
    clear() {
        console.log("DELETING");
        fetch(`${config.api}/cba/results/delete?snapshot_id=${this.state.selectedSnapshotId}&config_id=${this.state.selectedConfigId}`)
            .then((res) => res.json())
            .then((res) => this.pull_from_db());
    }

    render() {
        return (
            <div>
                {this.renderDropDowns()}
                <hr className="opacity-25" />
                {this.renderResultsCont()}
            </div>
        )
    }

    renderDropDowns() {
        const runText = this.resultsAvailable() ? "Re-Run" : "Run";
        const deleteDisabled = !this.resultsAvailable();
        return (<div className='d-flex flex-row justify-content-center'>
            <div className='flex-1'>
                <FormDropdown
                    options={this.state.availableSnapshots}
                    text="Select an asset snapshot"
                    label="Snapshot"
                    onChange={this.selectSnapshot} />
            </div>
            <div className='flex-1 mx-5'>
                <FormDropdown
                    options={this.state.availableConfigs}
                    text="Select a configuration set"
                    label="Config"
                    onChange={this.selectConfig} />
            </div>

            <div className="hstack flex-grow-0 align-self-end">
                <Button variant="outline-secondary" onClick={this.run}>{runText}</Button>
                <Button variant="outline-danger" onClick={this.clear} className='ms-1' disabled={deleteDisabled}>Delete</Button>
            </div>
        </div>)
    }

    renderResultsCont() {
        return <div className='mt-5'>{this.renderResults()}</div>
    }

    renderResults() {
        if (this.resultsAvailable()) {
            var key = `${this.state.selectedConfigId}-${this.state.selectedSnapshotId}`;
            return (<div>
                <ResultKpis key={`k-${key}`} configId={this.state.selectedConfigId} snapshotId={this.state.selectedSnapshotId} />
                <ResultsTable key={`t-${key}`} configId={this.state.selectedConfigId} snapshotId={this.state.selectedSnapshotId} />
            </div>);
        } else {
            return <figure className="text-center">
                <h1 className="mt-5 display-6 text-muted">No Results Available yet</h1>
            </figure>
        }

    }

};

export default getContext({ language: PropTypes.string })(CbaResults);