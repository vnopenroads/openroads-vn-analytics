import React from 'react';
import { connect } from 'react-redux';
import { t, setLanguage } from '../utils/i18n';

const MapOptions = React.createClass({
  displayName: 'MapOptions',

  propTypes: {
    layer: React.PropTypes.string,
    handleLayerChange: React.PropTypes.func,
    handleShowNoVpromms: React.PropTypes.func,
    language: React.PropTypes.string
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.language !== nextProps.language) {
      setLanguage(nextProps.language);
    }
  },

  render: function () {
    return (
      <div className='panel options-panel'>
        <form className='form'>
          <div className='form__group'>
            <label className='form__label'>{t('Visualized variable')}</label>
            <select className='form__control' onChange={ e => this.props.handleLayerChange(e) }>
              <option value='iri'>{t('IRI')}</option>
              <option value='or_width'>{t('Width')}</option>
              <option value='or_condition'>{t('Condition')}</option>
              <option value='or_surface'>{t('Surface')}</option>
            </select>
          </div>

          <div className='form__group'>
            <label className='form__label'>{t('Options')}</label>
            <label for='switch3' className='form__option form__option--switch option fos-io' htmlFor='show-no-vpromms' data-title={`${t('These will have no properties')}.`}>
              <input type='checkbox' name='show-no-vpromms' id='show-no-vpromms' value='show-no-vpromms' onChange={ e => this.props.handleShowNoVpromms(e) } />
              <span className='form__option__ui'></span>
              <span className='form__option__text'>{t('Road without vPromMMS ID')}</span>
            </label>
          </div>
        </form>
      </div>
    );
  }
});

function selector (state) {
  return {
    language: state.language.current
  };
}

module.exports = connect(selector)(MapOptions);
