import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
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
                    self.setState({ rowId: i });
                }
            }
        }
    };

    const columns = [
        { dataField: 'road_section_id', text: "ID", sort: true },
        { dataField: 'road_number', text: "Road Number", sort: true },
        { dataField: 'road_name', text: "Road Name", sort: true },
        { dataField: 'district', text: "District", sort: true },
        { dataField: 'length', text: "Length (km)", sort: true },
        { dataField: 'road_class', text: "Road Class", sort: true },
        { dataField: 'surface_type', text: "Surface Type", sort: true },
        { dataField: 'traffic_level', text: "Traffic Level", sort: true },
    ]

    return <BootstrapTable
        keyField='volume'
        data={dataList}
        columns={columns}
        bordered={false}
        // cellEdit={cellEditFactory({ mode: 'click' })}
        striped hover
    />;

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