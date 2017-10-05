import React from 'react';
import { t } from '../utils/i18n';

const MapOptions = React.createClass({
  displayName: 'MapOptions',

  propTypes: {
    layer: React.PropTypes.string,
    handleLayerChange: React.PropTypes.func,
    handleShowNoVpromms: React.PropTypes.func
  },

  render: function () {
    return (
      <div className='map-options map-panel'>
        <div className='form-group'>
          <label className='form__option form__option--custom-checkbox' htmlFor='show-no-vpromms'>
            <input type='checkbox' name='show-no-vpromms' id='show-no-vpromms' value='show-no-vpromms' onChange={ e => this.props.handleShowNoVpromms(e) } />
            <span className='form__option__text' data-title='These will have no properties.'>{t('Show road without vPromMMS ID')}</span>
            <span className='form__option__ui'></span>
          </label>
        </div>

        <div className='form-group'>
          <label className='map-options-label'>{t('Select visualized variable')}</label>
          <select onChange={ e => this.props.handleLayerChange(e) }>
            <option value='iri'>{t('IRI')}</option>
            <option value='or_width'>{t('Width')}</option>
            <option value='or_condition'>{t('Condition')}</option>
            <option value='or_surface'>{t('Surface')}</option>
          </select>
        </div>
      </div>
    );
  }
});

module.exports = MapOptions;
