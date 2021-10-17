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
        console.log('layer_selector');

        const colors = ['#00441b', '#4d004b', '#41b6c4', '#023858', '#67001f', '#49006a',
            '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];

        const swatches = colors.map((c) => {
            return <button key={`swatch-${c}`} onClick={() => this.props.setColor(c)} style={{ backgroundColor: c }} />
        });

        const attributes = ['priority', 'work_year', 'npv'].map((e) => {
            return <button key={e} onClick={() => this.props.setAttribute(e)}>
                {e}
            </button>

        });

        return <div className="map-overlay top">
            <div className="map-overlay-inner">
                <fieldset>
                    <label>Choose a color</label>
                    <div id="swatches">
                        {swatches}
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

