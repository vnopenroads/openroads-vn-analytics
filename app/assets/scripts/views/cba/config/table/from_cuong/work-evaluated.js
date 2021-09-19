import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Evaluated extends React.Component {
    render() {
        let dataVehicle = [{"a": 1}]
        let cellEditProp = {
            mode: 'click'
          };
      
        return (
            <div>   
                <div style = {{ fontWeight: 'bold', marginTop:'30px', marginBottom: '10px'}}>
                Road Deterioration (RoadDeterioration)
                </div>
                <BootstrapTable data={ dataVehicle } cellEdit={ cellEditProp } >
                    <TableHeaderColumn row='0' rowSpan='2' dataField='a' isKey>Surface Type</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Road Class</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Condition Class</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Base Alternative Road Work Year</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Base Alternative Road Work Number</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='2' headerAlign = 'center'> Project Alternatives Road Works Numbers </TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField=''>Alternative 1</TableHeaderColumn>   
                    <TableHeaderColumn row='1' dataField=''>Alternative 2</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Unit Cost Multiplier</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}