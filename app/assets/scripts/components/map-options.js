import React from 'react';

const MapOptions = React.createClass({
  displayName: 'MapOptions',

  propTypes: {
    layer: React.PropTypes.string,
    handleLayerChange: React.PropTypes.func,
    handleShowNoVpromms: React.PropTypes.func
  },

  render: function () {
    return (
      <div className='map-options'>
        <div className='form-group'>
          <input type='checkbox' id='show-no-vpromms' className='map-options-checkbox' onChange={ e => this.props.handleShowNoVpromms(e) }/>
          <label htmlFor='show-no-vpromms' className='map-options-label'>Show roads without VPRoMMS ID (these will have no properties)</label>
        </div>

        <div className='form-group'>
          <label className='map-options-label'>Select visualized variable</label>
          <select onChange={ e => this.props.handleLayerChange(e) }>
            <option value='iri'>IRI</option>
            <option value='or_width'>Width</option>
            <option value='or_condition'>Condition</option>
            <option value='or_surface'>Surface</option>
          </select>
        </div>
      </div>
    );
  }
});

module.exports = MapOptions;
