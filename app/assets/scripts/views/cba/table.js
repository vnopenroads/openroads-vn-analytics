import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import fakeData from '../../fakeData';

const CbaTable = () => {
    var dataList = fakeData;

    const selectRowProp = {
        mode: 'radio',
        bgColor: 'pink',
        hideSelectColumn: true,
        clickToSelect: true,

    };

    const options = {
        onRowClick: function (row) {
            for (var i = 0; i < dataList.length; i++) {
                if (`${row.road_section_id}` === dataList[i]['road_section_id']) {
                    console.log(i);
                    self.setState({ rowId: i });
                }
            }
        }
    };

    return (
        <div>
            <BootstrapTable data={dataList} options={options} selectRow={selectRowProp}>
                <TableHeaderColumn dataField='road_section_id' isKey>VPRoMMS ID</TableHeaderColumn>
                <TableHeaderColumn dataField='road_number'>Road Num.</TableHeaderColumn>
                <TableHeaderColumn dataField='road_name'>Road Name</TableHeaderColumn>
                <TableHeaderColumn dataField='district'>District</TableHeaderColumn>
                <TableHeaderColumn dataField='length'>Length (km)</TableHeaderColumn>
                <TableHeaderColumn dataField='road_class'>Road Class</TableHeaderColumn>
                <TableHeaderColumn dataField='surface_type'>Surface Type</TableHeaderColumn>
                <TableHeaderColumn dataField='traffic_level'>Traffic Level</TableHeaderColumn>
            </BootstrapTable>
        </div>)
};
export default CbaTable;