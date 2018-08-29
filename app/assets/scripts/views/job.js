import React from 'react';
import {
  compose,
  getContext,
  lifecycle
} from 'recompose';
import {
  Link,
  withRouter
} from 'react-router';
import {
  fetchJob
} from '../redux/modules/jobs';
import { connect } from 'react-redux';
import T, { translate } from '../components/t';

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
  copyToClipboard () {
    const textarea = document.getElementById('api-response');
    textarea.select();
    document.execCommand('copy');
  },
  getMessage: function(value) {
    if (typeof(value) === 'string') {
      return value;
    }
    if (value.changeset) {
      const numRoads = Object.keys(value.created.way).length;
      return `Created ${numRoads} new road geometries.`;
    }
    if (value.message) {
      return value.message;
    }
    return '';
  },
  getStatusType: function(value) {
    if (value.changeset) {
      return 'success';
    } else if (value.type) {
      return value.type;
    } else {
      return 'error';
    }
  },
  render: function () {
    const STATUS_MESSAGES = {
      'success': translate(language, 'Success'),
      'error': translate(language, 'Failed'),
      'inprocess': translate(language, 'Processing')
    };
    const { params, language } = this.props;
    const { job } = this.state;
    const id = params.id;
    let statusType;
    let msg = '';
    if (job && job.returnvalue) {
      statusType = this.getStatusType(job.returnvalue);
      msg = this.getMessage(job.returnvalue);

    } else {
      statusType = 'inprocess';
    }
    const status = STATUS_MESSAGES[statusType];
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><T>Upload status</T></h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            <div className='incontainer'>
              <div className='incontainer__header'>
                <div className='incontainer__headline'>
                  <h2 className='incontainer__title'><T>Job</T> #{ id }</h2>
                </div>
                <div className='incontainer__hactions'>
                  <Link to={`/${language}/upload`} className='ica-upload ica-main' title='Upload'><span><T>New upload</T></span></Link>
                </div>
              </div>

              <div className='incontainer__body'>

                { statusType === 'success' &&
                <div className='status-card status-card--success'>
                  <h3>Success</h3>
                  { msg && <p> { msg } </p> }
                </div>
                }

                { statusType === 'error' &&
                <div className='status-card status-card--error'>
                  <h3>Failed</h3>
                  { msg && <p> { msg } </p> }
                </div>
                }

                { statusType === 'inprocess' &&
                <div className='status-card status-card--pending'>
                  <h3>Processing</h3>
                  { msg && <p> { msg } </p> }
                </div>
                }

                <form className='form'>
                  <div className='form__group'>
                    <div className='form__inner-header'>
                      <div className='form__inner-headline'>
                        <label className='form__label' htmlFor='api-response'><T>API response</T></label>
                      </div>
                      <div className='form__inner-actions'>
                        <button type='button' className='fia-clipboard' onClick={ this.copyToClipboard } title='Copy to clipboard'><span><T>Copy</T></span></button>
                      </div>
                    </div>
                    <textarea className='form__control' id='api-response' rows='8' readOnly value={ JSON.stringify(job, null, '  ') } />
                    <p className='form__help'><T>Details of upload job</T></p>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
});

export default compose(
  getContext({ language: React.PropTypes.string }),
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
