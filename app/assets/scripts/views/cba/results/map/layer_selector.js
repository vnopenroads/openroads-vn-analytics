'use strict';
import React from 'react';

export default class LayerSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: undefined,
            startColor: props.startColor || '#ae017e',  /// '#023858',
            endColor: props.endColor || '#fcc5c0',
        };
    }

    render() {
        const colors = ['#ae017e', '#00441b', '#4d004b', '#41b6c4', '#023858', '#67001f', '#49006a',
            '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];

        const swatches = colors.map((c) => {
            return <button key={`swatch-${c}`} onClick={() => this.props.setColor(c)} style={{ backgroundColor: c }} />
        });

        const biColors = [['#165ca1', '#ffa3c6'], ['#ffa3c6', '#165ca1'], ['#1aa110', '#ffa3c6'], ['#1aa110', '#ffcbb5']];
        const biSwatches = biColors.map((c) => {
            return <button key={`swatch-${c[0]}-${c[1]}`} onClick={() => this.props.setColor(c)}>
                <div style={{ backgroundColor: c[0] }} />
                <div style={{ backgroundColor: c[1] }} />
            </button>
        });

        const attributes = ['priority', 'work_year', 'npv', 'work_name'].map((e) => {
            return <div key={e} onClick={() => this.props.setAttribute(e)} style={{ cursor: 'pointer' }}>
                {e}
            </div>

        });

        return <div className="map-overlay top">
            <div className="map-overlay-inner">
                <fieldset>
                    <label> Choose a color </label>
                    <div id="swatches">
                        {swatches}
                    </div>
                    <div id="biSwatches">
                        {biSwatches}
                    </div>
                </fieldset>
                <fieldset>
                    <label>Choose an attribute</label>
                    <div>
                        {attributes}
                    </div>
                </fieldset>
            </div>
        </div>


    }
}

