import fakeData from '../../fakeData';
import React from 'react';

function catchNull (value) {
  if (value === null) {
    return (<div>_</div>);
  }
  return value;
}

const dataList = fakeData;
export default class SectionDetails extends React.Component {

  render() {
    const { rowId } = this.props;
    return (
      <div>
        <div className = 'detail'>
          Details: {dataList[rowId].road_section_id}
        </div>
        <div className = 'section'>
          <div className = 'title'>SECTION INFORMATION</div>
          <div className = 'inner'>
            <div className = 'inner-left'>Road number</div>
            <div className = 'inner-right'>{dataList[rowId].road_number}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Road name</div>
            <div className = 'inner-right'>{dataList[rowId].road_name}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Road start location</div>
            <div className = 'inner-right'>{dataList[rowId].road_start}</div>
          </div>
        </div>


        <div className = 'section'>
          <div className = 'title'>SECTION LOCATION</div>
          <div className = 'inner'>
            <div className = 'inner-left'>Section sequence number</div>
            <div className = 'inner-right'>1</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Session name</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].section_name)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Province</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].province)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>District</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].district)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Commune</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].commune)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Management</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].management)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Start chainage (km)</div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].start_km)).toFixed(2)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>End chainage (km)</div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].end_km)).toFixed(2)}</div>
          </div>
        </div>

        <div className = 'section'>
          <div className = 'title'>SECTION CHARACTERISTICS</div>
          <div className = 'inner'>
            <div className = 'inner-left'>Length (km) </div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].length)).toFixed(2)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>No. of lanes class</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].lanes)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Carriageway Width</div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].width)).toFixed(2)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Road class</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].road_class)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Terrain type</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].terrain_type)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Temperature classs</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].temperature_class)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Moisture class</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].moisture_class)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Pavement type</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].pavement_type)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Surface type</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].surface_type)}</div>
          </div>
        </div>

        <div className = 'section'>
          <div className = 'title'>SECTION CONDITION</div>
          <div className = 'inner'>
            <div className = 'inner-left'>Pavement condition class</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].pavement_condition_class)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Roughness (IRI)</div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].roughness)).toFixed(1)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Structural number </div>
            <div className = 'inner-right'>{Number(catchNull(dataList[rowId].structural_no)).toFixed(1)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Pavement age</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].pavement_age)}</div>
          </div>
        </div>

        <div className = 'section'>
          <div className = 'title'>SECTION TRAFFIC(AADT: veh/day)</div>
          <div className = 'inner'>
            <div className = 'inner-left'>Motorcycle</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_motorcycle)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Small car</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_carsmall)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Medium car </div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_carmediun)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Delivery vehicle</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_delivery)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>4 wheel drive</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_4wheel)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Small truck</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_smalltruck)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Medium truck</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_mediumtruck)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Heavy truck</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_largetruck)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Articulated truck</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_articulatedtruck)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Small bus</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_smallbus)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Medium bus</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_mediumbus)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Large bus</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_largebus)}</div>
          </div>
          <div className = 'inner'>
            <div className = 'inner-left'>Total traffic</div>
            <div className = 'inner-right'>{catchNull(dataList[rowId].aadt_total)}</div>
          </div>
        </div>
      </div>
    );
  }
}
