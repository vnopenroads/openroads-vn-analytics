import React from 'react';
import {
  compose,
  lifecycle
} from 'recompose';
import {
  fetchJob
} from '../redux/modules/jobs';
import { connect } from 'react-redux';
import {
  translate
} from '../components/t';

const STATUS_POLL_INTERVAL = 2000; // in ms

var Job = React.createClass({
  // propTypes: {
  //   fetchJob: React.PropTypes.func,
  //   language: React.PropTypes.string
  // },
  getInitialState: function () {
    return {
      job: null
    };
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.job !== nextProps.job) {
      this.setState({
        job: nextProps.job
      });
    }

    // if job does not have a return value yet, keep polling backend for status
    if (!nextProps.job.returnvalue) {
      setTimeout(() => {
        this.props.fetchJob(this.props.params.id);
      }, STATUS_POLL_INTERVAL);
    }
  },
  getMessage: function(value) {
    if (typeof(value) === 'string') {
      return value;
    }
    if (value.changeset) {
      const numRoads = Object.keys(value.created.way).length;
      return `Created ${numRoads} new road geometries.`;
    }
  },
  render: function () {
    const { params, language } = this.props;
    const { job } = this.state;
    const id = params.id;
    let status;
    let msg = '';
    if (job && job.returnvalue) {
      status = translate(language, 'Finished');
      msg = this.getMessage(job.returnvalue);
    } else {
      status = translate(language, 'Processing upload...');
    }
    return (
      <div className='inpage__body'>
        <div className='inner'>
          <h2>Job page - #{ id }</h2>
          <p>
            Status: { status }
          </p>
          { msg && <p> { msg } </p> }
        </div>
      </div>
    );
  }
});

export default compose(
  connect(
    state => ({
      job: state.jobs.data
    }),
    dispatch => ({
      fetchJob: jobId => dispatch(fetchJob(jobId))
    })
  ),
  lifecycle({
    componentDidMount: function () {
      this.props.fetchJob(this.props.params.id);
    }
  })
)(Job);
