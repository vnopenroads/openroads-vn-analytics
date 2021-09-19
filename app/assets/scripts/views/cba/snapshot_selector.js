'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { getContext } from 'recompose';
import { Button } from 'react-bootstrap';

import TakeSnapshotModal from './take_snapshot_modal';
import SnapshotStats from './snapshot_stats';
import config from '../../config';
import SnapshotOverview from './snapshots/snapshot_overview'

class SnapshotSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            takeSnapshotModalOpen: false,
            snapshots: -1,
            selectedSnapshotId: -1
        }
        this.snapshotModalElement = React.createRef();
        this.handleTakeSnapshot = this.handleTakeSnapshot.bind(this);
        this.handleSnapshotTaken = this.handleSnapshotTaken.bind(this);
        this.renderSnapshot = this.renderSnapshot.bind(this);
        this.selectSnapshot = this.selectSnapshot.bind(this);
    }

    componentDidMount() {
        this.pull_data_from_db();
    }

    pull_data_from_db() {
        var url = `${config.api}/cba/roads/snapshots`;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (res.length > 0) {
                    this.setState({ snapshots: res, selectedSnapshotId: res[0].snapshotId })
                }
            });
    }

    selectSnapshot(e) {

        this.setState({ selectedSnapshotId: e });
        // this.props.selectSnapshotFn(e);
    }

    renderSnapshot(e) {
        var selected = e.id === this.state.selectedSnapshotId ? "selected" : ""
        return (<div key={e.id} className={'snapshot-el ' + selected}>
            <SnapshotStats
                onClick={this.selectSnapshot}
                snapshot_id={e.id}
                name={e.name}
                total={e.num_records}
                valid={e.valid_records}
                invalid_reasons={e.invalid_reasons} />
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

    renderSnapshotSelect() {
        return (
            <div className='snapshot-select-con' style={{ "max-width": "300px" }}>
                <div className='title-con'>Road Asset Snapshots</div>
                {this.getSnapshotItems()}
                {this.takeSnapshot()}
            </div>
        )
    }

    renderSnapshotOverview() {
        return <SnapshotOverview key={this.state.selectedSnapshotId} snapshotId={this.state.selectedSnapshotId} />
    }

    render() {
        return (<div className='flex-parent debug' >
            {this.renderSnapshotSelect()}
            {this.renderSnapshotOverview()}
        </div>)
    }
};

export default getContext({ language: PropTypes.string })(SnapshotSelector);

