import {
  compose,
  withStateHandlers
} from 'recompose';
import { connect } from 'react-redux';
import RoadTable from '../components/road-table';


const RoadTableContainer = compose(
  connect(
    state => ({
      fieldIds: state.fieldVProMMsids.ids,
      adminRoadProperties: state.VProMMsAdminProperties.data
    })
  ),
  withStateHandlers(
    { sortField: 'id', sortOrder: 'asc' },
    {
      sortColumnAction: ({ sortField, sortOrder }) => (field) => (
        sortField === field ?
          { sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' } :
          { sortField: field, sortOrder: 'asc' }
      )
    }
  )
)(RoadTable);


export default RoadTableContainer;
