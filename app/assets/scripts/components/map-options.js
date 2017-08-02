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
          <label className='form__option form__option--custom-checkbox' htmlFor='show-no-vpromms'>
            <input type='checkbox' name='show-no-vpromms' id='show-no-vpromms' value='show-no-vpromms' onChange={ e => this.props.handleShowNoVpromms(e) } />
            <span className='form__option__text' data-title='These will have no properties.'>Show roads without VPRoMMS ID</span>
            <span className='form__option__ui'></span>
          </label>
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
