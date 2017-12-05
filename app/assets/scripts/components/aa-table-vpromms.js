// TODO generalize sort tables to accept arbitrary columns and attributes
// (combine aa-table-index.js and aa-table-vromms.js into single component)
import React from 'react';
import {
  compose,
  getContext,
  withHandlers
} from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';
import { api } from '../config';
import { Link } from 'react-router';
import T from './t';


const TableColumnHeader = withHandlers({
  sortLink: ({ columnKey, sortLinkHandler }) => () => sortLinkHandler(columnKey)
})
  (({ columnKey, label, sortField, sortOrder, sortLink }) => (
    <th
      onClick={sortLink}
    >
      <i
        className={classnames({
          'collecticon-sort-none': sortField !== columnKey,
          'collecticon-sort-asc': sortField === columnKey && sortOrder === 'asc',
          'collecticon-sort-desc': sortField === columnKey && sortOrder === 'desc'
        })}
      />
      <T>{label}</T>
    </th>
  ));


const TableRow = withHandlers({
  propertiesButtonClick: ({ vpromm, toggleProperties }) => () => toggleProperties(vpromm)
})
  (({
    vpromm, fieldRoads, adminRoadProperties, adminRoadPropertiesFetched,
    vprommFieldInDB, expandedId, language, propertiesButtonClick
  }) => {
    // TODO - properly render props dropdown
    const roadPropDropDown = [];

    if (adminRoadPropertiesFetched) {
      if (adminRoadProperties.length !== 0) {
        const adminProp = adminRoadProperties.find((prop) => prop.id === vpromm);
        if (adminProp) {
          _.forEach(adminProp.properties, (prop, key, j) => {
            roadPropDropDown.push(<dt key={`${vpromm}-${key}-${j}-key`}>{key}</dt>);
            roadPropDropDown.push(<dd key={`${vpromm}-${key}-${j}-prop`}>{prop}</dd>);
          });
        } else {
          roadPropDropDown.push(<dt key={`${vpromm}-key`}></dt>);
          roadPropDropDown.push(<dd key={`${vpromm}-prop`}></dd>);
        }
      } else {
        roadPropDropDown.push(<p><T>Loading</T></p>);
      }
    }

    return (
      <tr>
        <th>
          {vprommFieldInDB ?
            <Link to={`/${language}/explore`}>
              <strong>{vpromm}</strong>
            </Link> :
            vpromm
          }
        </th>
        <td
          className={vprommFieldInDB ? 'added' : 'not-added'}
        >
          { vprommFieldInDB &&
            <div className='a-table-actions'>
              <Link
                className='a-table-action'
                to={`/${language}/assets/road/${vpromm}/`}
              >
                <T>Explore</T>
              </Link>
              <a
                className='a-table-action'
                href={`${api}/field/geometries/${vpromm}?grouped=false&download=true`}
              >
                <T>Download</T>
              </a>
            </div>
          }
        </td>
        {
          adminRoadProperties.length !== 0 ?
            <td className='table-properties-cell'>
              <button
                type='button'
                className={`button-table-expand ${expandedId ? 'button-table-expand--show' : 'button-table-expand--hide'}`}
                onClick={propertiesButtonClick}
              >
                <span>{expandedId === vpromm ? <T>Hide</T> : <T>Show</T>}</span>
              </button>
              <div
                className={`table-properties ${expandedId !== vpromm ? 'table-properties--hidden' : ''}`}
              >
                <dl className='table-properties-list'>{roadPropDropDown}</dl>
              </div>
            </td> :
            <td/>
        }
      </tr>
    );
  });


const AATable = React.createClass({
  displayName: 'AATable',

  propTypes: {
    aaId: React.PropTypes.string,
    data: React.PropTypes.array,
    province: React.PropTypes.string,
    provinceName: React.PropTypes.string,
    routeParams: React.PropTypes.func,
    sources: React.PropTypes.array,
    _fetchVProMMSidsSources: React.PropTypes.func,
    _fetchVProMMsBbox: React.PropTypes.func,
    _removeAdminInfo: React.PropTypes.func,
    fetched: React.PropTypes.bool,
    properties: React.PropTypes.object,
    propertiesData: React.PropTypes.array,
    propertiesFetched: React.PropTypes.bool,
    fieldRoads: React.PropTypes.array,
    language: React.PropTypes.string,
    adminRoadProperties: React.PropTypes.array,
    adminRoadPropertiesFetched: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      sortField: 'id',
      sortOrder: 'desc',
      expandedId: null
    };
  },

  sortLinkClickHandler: function (field) {
    let { sortField, sortOrder } = this.state;

    if (sortField === field) {
      this.setState({
        sortOrder: sortOrder === 'asc' ? 'desc' : 'asc'
      });
    } else {
      this.setState({
        sortField: field,
        sortOrder: 'desc'
      });
    }
  },

  toggleProperties: function (vprommId) {
    this.setState({ expandedId: this.state.expandedId === vprommId ? null : vprommId });
  },

  render: function () {
    const {
      adminRoadProperties, data, fieldRoads, adminRoadPropertiesFetched, language
    } = this.props;
    const {
      expandedId, sortField, sortOrder
    } = this.state;

    return (
      <div className='table'>
        <table>
          <thead>
            <tr>
              <TableColumnHeader
                columnKey="id"
                label="VPRoMMS ID"
                sortField={sortField}
                sortOrder={sortOrder}
                sortLinkHandler={this.sortLinkClickHandler}
              />
              <th className='table-properties-head'><T>Field Data</T></th>
              <th className='table-properties-head'><T>Properties</T></th>
            </tr>
          </thead>
          <tbody>
            {_.map(
              _.orderBy(data, _.identity, [sortOrder]),
              (vpromm) => (
                <TableRow
                  key={vpromm}
                  vpromm={vpromm}
                  fieldRoads={fieldRoads}
                  adminRoadProperties={adminRoadProperties}
                  adminRoadPropertiesFetched={adminRoadPropertiesFetched}
                  vprommFieldInDB={fieldRoads.includes(vpromm)}
                  expandedId={expandedId}
                  language={language}
                  toggleProperties={this.toggleProperties}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }
});


export default compose(
  getContext({ language: React.PropTypes.string }),
  connect(
    state => ({
      properties: state.VProMMsidProperties.properties,
      fieldIds: state.fieldVProMMsids.ids,
      adminRoadProperties: state.VProMMsAdminProperties.data,
      adminRoadPropertiesFetched: state.VProMMsAdminProperties.fetched
    })
  )
)(AATable);

