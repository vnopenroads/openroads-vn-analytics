import React from 'react';
import {
  compose,
  lifecycle,
  withContext
} from 'recompose';
import { withRouter } from 'react-router';


export default compose(
  withRouter,
  lifecycle({
    componentWillReceiveProps: function (nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.setState({ lastLocation: this.props.location.pathname });
      }
    }
  }),
  withContext(
    { lastLocation: React.PropTypes.string },
    ({ lastLocation }) => ({ lastLocation })
  )
);
