import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Deterioration extends React.Component {
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
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Roughness Progression Type (1:Percentage, 2:Traffic & Climate: 3:Climate)</TableHeaderColumn>
                    <TableHeaderColumn row='0' rowSpan='2' dataField=''>Annual Percentage (% increase per year)</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='5' headerAlign = 'center'>Bituminous Roads Traffic and Climate Related Roughness Progression Coefficients </TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField=''>Kgp</TableHeaderColumn>   
                    <TableHeaderColumn row='1' dataField=''>Kgm</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField=''> a0</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField=''> a1 </TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField=''> a2 </TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}