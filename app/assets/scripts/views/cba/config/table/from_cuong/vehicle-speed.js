import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Speed extends React.Component {
    render() {
        let dataVehicle = [{"a": 1}]
        let cellEditProp = {
            mode: 'click'
          };
      
        return (
            <div>   
                <div style = {{ fontWeight: 'bold', marginTop:'30px', marginBottom: '10px'}}>
                Vehicle Speeds (SPEED)
                </div>
                <BootstrapTable data={ dataVehicle } cellEdit={ cellEditProp } >
                    <TableHeaderColumn dataField='a' isKey>Number of Lanes Class (1 to 7)</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Terrain Class (1 to 3)</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Coefficient</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Motor cycle</TableHeaderColumn>   
                    <TableHeaderColumn dataField=''>Small Car</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Medium Car</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Delivery Vehicle</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Four Wheel Drive</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Light Truck</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Medium Truck</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Heavy Truck</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Articulated Truck</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Small Bus</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Medium Bus</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Large Bus</TableHeaderColumn>
                    <TableHeaderColumn dataField=''>Average Vehicle Fleet</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}