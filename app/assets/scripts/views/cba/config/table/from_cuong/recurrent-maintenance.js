import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class RecurrentMaintenance extends React.Component {
    render() {
        let dataMain = this.props.datas['recurrent-maintenance']
        let cellEditProp = {
            mode: 'click'
          };
      
        return (
            <div>
                <div>
                <div style = {{ fontWeight: 'bold', marginTop:'30px', marginBottom: '10px'}}>
                Recurrent Maintenance ($/km-year) (Recurrent)
                </div>
                <BootstrapTable data={ dataMain } cellEdit={ cellEditProp }>
                <TableHeaderColumn row='0' rowSpan='2' dataField='type' isKey>Surface Type</TableHeaderColumn>
                <TableHeaderColumn row='0' colSpan='7'>Number of Lanes Class</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='OL'>1: One Lane</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='NTL'>2: Narrow Two Lanes</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='TL'>3: Two Lanes</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='WTL'>4: Wide Two Lanes</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='FL'>5: Four Lanes</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='SL'>6: Six Lanes</TableHeaderColumn>
                <TableHeaderColumn row='1' dataField='EL'>7: Eight Lanes</TableHeaderColumn>
                </BootstrapTable>
                </div>
            </div>
        )
    }
}