'use strict';
import React from 'react';
import { getContext } from 'recompose';
import PropTypes from 'prop-types';
import { StatsTableHeader, StatsTableRow, StatsBar, StatsBlock } from '../../components/admin-stats-tables';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { translate } from '../../components/t';

class SnapshotStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var valid_perc = (this.props.total > 0) ? Math.round(100.0 * this.props.valid / this.props.total) : '-';
        var invalid_perc = (this.props.total > 0) ? 100 - valid_perc : '-';
        var total_label, valid_label, invalid_label;
        [total_label, valid_label, invalid_label] = ['Total', 'Valid', 'Invalid'].map((e) => translate(this.props.language, e));
        var total_value = this.props.total
        var valid_value = `${this.props.valid} (${valid_perc}%)`;
        var invalid_value = `${this.props.total - this.props.valid} (${invalid_perc}%)`;

        const clickHandler = () => { this.props.onClick(this.props.snapshot_id); };

        return <div className='snapshot-stats' onClick={clickHandler} >
            <h3>{this.props.name}</h3>
            <figure>
                <StatsBar total={this.props.total} completed={this.props.valid} />
                <figcaption>
                    <ul className='stats-list'>
                        <li key={total_label} className='stats-list__item'><span className='value'>{total_value}</span><small>{total_label}</small></li>
                        <li key={valid_label} className='stats-list__item'><span className='value'>{valid_value}</span><small>{valid_label}</small></li>
                        <li key={invalid_label} className='stats-list__item'><span className='value'>{invalid_value}</span><small>{invalid_label}</small></li>
                    </ul>
                </figcaption>
            </figure>
        </div>
    }
}

export default getContext({ language: PropTypes.string })(SnapshotStats);
