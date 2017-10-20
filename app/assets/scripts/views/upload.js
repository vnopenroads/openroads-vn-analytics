'use strict';
import React from 'react';
import config from '../config';

var Upload = React.createClass({
  render: function () {
    return (
      <section classNmae='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Upload</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            <h2>Upload RoadLabPro ZIP files</h2>
            <form className='form upload-form' method='post' encType='multipart/form-data' action={config.api + '/fielddata/properties/rlp'}>
              <div className='form__group'>
                <label className='form__label' htmlFor='rlp-zip-properties'>Road properties</label>
                <div className='form__input-group form__input-group--medium'>
                  <input type='file' className='form__control' id='rlp-zip-properties' name='rlp-zip-properties' accept='.zip' />
                  <button type='button' className='button button--secondary-raised-dark' title='Submit'><span>Upload</span></button>
                </div>
              </div>
            </form>

            <form className='form upload-form' method='post' encType='multipart/form-data' action={config.api + '/fielddata/geometries/rlp'}>
              <div className='form__group'>
                <label className='form__label' htmlFor='rlp-zip-geometries'>Road geometries</label>
                <div className='form__input-group form__input-group--medium'>
                  <input type='file' className='form__control' id='rlp-zip-geometries' name='rlp-zip-geometries' accept='.zip' />
                  <button type='button' className='button button--secondary-raised-dark' title='Submit'><span>Upload</span></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Upload;
