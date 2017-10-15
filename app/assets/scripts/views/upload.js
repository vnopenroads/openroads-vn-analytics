'use strict';
import React from 'react';
import config from '../config';

var Upload = React.createClass({
  render: function () {
    return (
      <section classNmae='page'>
        <div className='page__body'>
          <div className='upload__header'>Upload RoadLabPro ZIP files</div>
          <form method="post" encType="multipart/form-data" action={config.api + '/fielddata/properties/rlp'}>
            <div>
              <input type="file" id="rlp-zip-properties" accept=".zip" />
              <button>Ingest road properties</button>
            </div>
          </form>

          <form method="post" encType="multipart/form-data" action={config.api + '/fielddata/geometries/rlp'}>
            <div>
              <input type="file" id="rlp-zip-geometries" accept=".zip" />
              <button>Ingest road geometries</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
});

module.exports = Upload;
