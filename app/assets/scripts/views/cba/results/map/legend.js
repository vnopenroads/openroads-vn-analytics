'use strict';
import React from 'react';
import interpolate from 'color-interpolate';

export default class Legend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: undefined,
            startColor: props.startColor || '#ae017e',  /// '#023858',
            endColor: props.endColor || '#fcc5c0',
        };
    }

    render() {
        console.log('legend');

        if (!this.state.labels) return <div />

        let colormap = interpolate([this.state.startColor, this.state.endColor]);
        var numLabels = this.state.labels.length
        var spans = this.state.labels.map((e, i) => <span key={`span-${i}`} style={{ backgroundColor: colormap((i + 1) / numLabels) }} />);
        var labels = this.state.labels.map((e, i) => <label key={`label-${i}`}>{e}</label>);

        return <div className='legend' id='legend'>
            <strong>{this.state.title}</strong>
            <nav>
                {spans}
                {labels}
            </nav>
        </div>
    }
}
