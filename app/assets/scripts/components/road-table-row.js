import React from 'react';
import { Link } from 'react-router';
import c from 'classnames';
import { api } from '../config';
import T from './t';


const RowReadView = ({
  vpromm, properties, hasOSMData, language, shouldShowProperties,
  toggleProperties, showDeleteView, showEditView
}) => {
  return (
    <tr>
      <td><Link to={`/${language}/assets/road/${vpromm}/`}><strong>{vpromm}</strong></Link></td>
      <td className={hasOSMData ? 'added' : 'not-added'}>
        <div className='a-table-actions'>
          <Link className='a-table-action' to={`/${language}/assets/road/${vpromm}/`}>
            <T>View</T>
          </Link>
          <a className={c('a-table-action', {disabled: !hasOSMData})} href={`${api}/properties/roads/${vpromm}.geojson?download`} disabled={!hasOSMData}>
            <T>Download</T>
          </a>
        </div>
      </td>
    </tr>
  );
};


const TableRow = (props) => {
  if (props.viewState === 'read') {
    return <RowReadView {...props} />;
  }
};


TableRow.propTypes = {
  viewState: React.PropTypes.string.isRequired
};


export const TableErrorRow = () => (
  <tr className="error-row">
    <td/>
    <td colSpan="3">
      <p className="invalid"><strong><T>Error</T></strong></p>
    </td>
  </tr>
);


export default TableRow;
