import React from 'react';
import {
  getContext
} from 'recompose';
import T, {
  translate
} from './T';


const MapOptions = ({ language, handleLayerChange, handleShowNoVpromms }) => (
  <div className='panel options-panel'>
    <div className='panel__body'>
      <form className='form'>
        <div className='form__group'>
          <label className='form__label'><T>Visualized variable</T></label>
          <select className='form__control' onChange={ e => handleLayerChange(e) }>
            <option value='iri'>{translate(language, 'IRI')}</option>
            <option value='or_width'>{translate(language, 'Width')}</option>
            <option value='or_condition'>{translate(language, 'Condition')}</option>
            <option value='or_surface'>{translate(language, 'Surface')}</option>
          </select>
        </div>

        <div className='form__group'>
          <label className='form__label'>{translate(language, 'Options')}</label>
          <label
            className='form__option form__option--switch option fos-io'
            htmlFor='show-no-vpromms'
            data-title={translate(language, 'These will have no properties')}
          >
            <input type='checkbox' name='show-no-vpromms' id='show-no-vpromms' value='show-no-vpromms' onChange={ e => handleShowNoVpromms(e) } />
            <span className='form__option__ui'></span>
            <span className='form__option__text'><T>Road without VPRoMMS ID</T></span>
          </label>
        </div>
      </form>
    </div>
  </div>
);


MapOptions.propTypes = {
  layer: React.PropTypes.string,
  handleLayerChange: React.PropTypes.func,
  handleShowNoVpromms: React.PropTypes.func,
  language: React.PropTypes.string
};


export default getContext({ language: React.PropTypes.string })(MapOptions);
