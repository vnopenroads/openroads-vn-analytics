'use strict';
import React from 'react';

export default class LayerSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: undefined,
            startColor: props.startColor || '#ae017e',  /// '#023858',
            endColor: props.endColor || '#fcc5c0',
            attribute: undefined
        };
    }

    render() {
        const colors = ['#ae017e', '#00441b', '#4d004b', '#41b6c4', '#023858', '#67001f', '#49006a',
            '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];

        const swatches = colors.map((c) => {
            return <div key={`swatch-${c}`} onClick={() => this.props.setColor(c)} style={{ backgroundColor: c }} />
        });

        const biColors = [['#165ca1', '#ffa3c6'], ['#ffa3c6', '#165ca1'], ['#1aa110', '#ffa3c6'], ['#1aa110', '#ffcbb5']];
        const biSwatches = biColors.map((c) => {
            return <div key={`swatch-${c[0]}-${c[1]}`} onClick={() => this.props.setColor(c)}>
                <div style={{ backgroundColor: c[0] }} />
                <div style={{ backgroundColor: c[1] }} />
            </div>
        });

        const pairs = [['priority', 'Priority'], ['work_year', 'Work Year'], ['work_name', 'Work Type'], ['npv', 'Net Present Value']];
        const attributes = pairs.map(([e, label]) => {
            const cName = e == this.state.attribute ? "active" : "";
            return <div key={e}
                className={cName}
                onClick={() => { this.props.setAttribute(e); this.setState({ attribute: e }) }}
                style={{ cursor: 'pointer' }}>
                {label}
            </div>

        });

        return <div className="map-overlay top">
            <div className="map-overlay-inner">
                <fieldset>
                    <label> Choose a color </label>
                    <div id="swatches" className='d-flex'>
                        {swatches}
                    </div>
                    <div id="biSwatches" className='d-flex mt-1'>
                        {biSwatches}
                    </div>
                </fieldset>
                <fieldset>
                    <label>Choose an attribute</label>
                    <div id='attributes' className='d-flex justify-content-start flex-wrap'>
                        {attributes}
                    </div>
                </fieldset>
            </div>
        </div>


    }
}

