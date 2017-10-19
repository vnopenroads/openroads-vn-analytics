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
            <div className='upload__header'>Upload RoadLabPro ZIP files</div>
            <form method="post" encType="multipart/form-data" action={config.api + '/fielddata/properties/rlp'}>
              <div>
                <input type="file" id="rlp-zip-properties" name="upload-file-needs-to-have-a-name" accept=".zip" />
                <button>Ingest road properties</button>
              </div>
            </form>

            <form method="post" encType="multipart/form-data" action={config.api + '/fielddata/geometries/rlp'}>
              <div>
                <input type="file" id="rlp-zip-geometries" name="upload-file-needs-to-have-a-name" accept=".zip" />
                <button>Ingest road geometries</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Upload;
