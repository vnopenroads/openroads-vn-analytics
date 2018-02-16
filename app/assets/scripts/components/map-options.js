import React from 'react';
import {
  getContext
} from 'recompose';
import T, {
  translate
} from './t';


const MapOptions = ({ language, handleLayerChange, handleShowNoVpromms }) => (
  <div className='panel options-panel'>
    <div className='panel__body'>
      <form className='form'>
        <div className='form__group'>
          <label className='form__label'><T>Visualized variable</T></label>
          <select className='form__control' onChange={ e => handleLayerChange(e) }>
            <option value='iri'>{translate(language, 'IRI')}</option>
          </select>
        </div>

        <div className='form__group'>
          <label className='form__label'>{translate(language, 'Options')}</label>
          <label
            className='form__option form__option--switch option fos-io'
            htmlFor='show-no-vpromms'
          >
            <input type='checkbox' defaultChecked={true} name='show-no-vpromms' id='show-no-vpromms' value='show-no-vpromms' onChange={ e => handleShowNoVpromms(e) } />
            <span className='form__option__ui'></span>
            <span className='form__option__text'><T>Road without VPRoMMS ID</T> <b>----</b></span>
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
