'use strict';
import React from 'react';
import interpolate from 'color-interpolate';

export default class Legend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            startColor: props.startColor || '#ae017e',
            endColor: props.endColor || '#fcc5c0',
            continuous: true,
            categories: undefined
        };
    }

    render() {
        if (this.state.continuous) {
            return this.renderContinuousLegend();
        } else {
            return this.renderCategoricalLegend();
        }
    }

    renderContinuousLegend() {
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

    renderCategoricalLegend() {
        var spans = Object.entries(this.state.categories).map(([k, c]) =>
            <div className='category-row'>
                <div className='circle' key={`circle-${c}`} style={{ backgroundColor: c }} />
                <div className='label' key={`label-${c}`} >{k}</div>
            </div>
        );
        return <div className='legend' id='legend'>
            <strong>{this.state.title}</strong>
            <nav>
                {spans}
            </nav>
        </div>
    }
}
