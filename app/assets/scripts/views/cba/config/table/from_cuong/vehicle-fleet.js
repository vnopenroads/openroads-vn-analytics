import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class VehicleFleet extends React.Component {
    render() {
        let dataVehicle = this.props.datas['vehicle-fleet']
        let cellEditProp = {
            mode: 'click'
          };
      
        return (
            <div>   
                <div style = {{ fontWeight: 'bold', marginTop:'30px', marginBottom: '10px'}}>
                Vehicle Fleet Characteristics (VehicleFleet)
                </div>
                <BootstrapTable data={ dataVehicle } cellEdit={ cellEditProp } >
                    <TableHeaderColumn dataField='vehicle-type' isKey>Vehicle Type</TableHeaderColumn>
                    <TableHeaderColumn dataField='number'>Equivalent Standard Axles (ESA/vehicle)</TableHeaderColumn>
                    <TableHeaderColumn dataField='esa'>Number of Passengers (#)</TableHeaderColumn>
                    <TableHeaderColumn dataField='PTC'>Passengers Time Cost ($/hour per Passenger)</TableHeaderColumn>   
                </BootstrapTable>
            </div>
        )
    }
}