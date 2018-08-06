import React from 'react';
import { Link } from 'react-router';
import { api } from '../config';
import T, {
  translate
} from './t';


const RowReadView = ({
  vpromm, properties, hasOSMData, language, shouldShowProperties,
  toggleProperties, showDeleteView, showEditView
}) => {
  return (
    <tr>
      <td><Link className='a-table-action' to={`/${language}/assets/road/${vpromm}/`}>{vpromm}</Link></td>
      <td className={hasOSMData ? 'added' : 'not-added'}>
        {hasOSMData &&
          <div className='a-table-actions'>
            <Link className='a-table-action' to={`/${language}/assets/road/${vpromm}/`}><T>View</T></Link>
            <Link
              className='a-table-action'
              to={{
                pathname: `/${language}/explore`,
                query: {
                  activeRoad: vpromm
                }
              }}
            >
              <T>Explore</T>
            </Link>

            <a className='a-table-action' href={`${api}/properties/roads/${vpromm}.geojson`}>
              <T>Download</T>
            </a>
          </div>
        }
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
  <tr
    className="error-row"
  >
    <td/>
    <td
      colSpan="3"
    >
      <p className="invalid"><strong><T>Error</T></strong></p>
    </td>
  </tr>
);


export default TableRow;
