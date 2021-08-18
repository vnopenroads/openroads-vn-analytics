import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dataConfigurations from '../../dataConfigurations';
import VehicleFleet from './table/vehicle-fleet';
import Annual from './table/annual';
import TrafficLevels from './table/traffic-levels';
import RoadWords from './table/road-work';
import Maintenance from './table/recurrent-maintenance';
import Operating from './table/operating';
import Speed from './table/vehicle-speed';
import Deterioration from './table/road-deterioration';
import Evaluated from './table/work-evaluated';
export default class Configurations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : 'vehicle-fleet',
        }
    }

    isActive(value) {
        return (value === this.state.title) ? 'nav-con-active' : 'nav-con-default'
    }
    render() {
        let {title} = this.state

        // var configContainer = 
       var classLookup =  { 
            "vehicle-fleet": VehicleFleet,
            "annual": Annual,
            "traffic-levels": TrafficLevels,
            "operating": Operating,
            "speed": Speed,
            "RW-CHA": RoadWords,
            "maintenance": Maintenance,
            "detejrioration": Deterioration,
            "evaluated": Evaluated
        };

        var configContainer = React.createElement(classLookup[title], { "datas": dataConfigurations[title]});

        //     {(title === 'vehicle-fleet') ?  <VehicleFleet 
        //     datas = {dataConfigurations["vehicle-fleet"]}
        //     /> : <div/> }
        //     {(title === 'annual') ?  <Annual 
        //     datas = {dataConfigurations["vehicle-fleet"]}
        //     /> : <div/> }
        //     {(title === 'operating') ?  <Operating 
        //     datas = {dataConfigurations["vehicle-fleet"]}
        //     /> : <div/> }
        //     {(title === 'speed') ?  <Speed 
        //     datas = {dataConfigurations["vehicle-fleet"]}
        //     /> : <div/> }
        //     {(title === 'RW-CHA') ?  <div> <RoadWords 
        //     datas = {dataConfigurations['RW-CHA']}
        //     /> </div> : <div/> }
        //     {(title === 'maintenance') ?  <div> <Maintenance 
        //     datas = {dataConfigurations['RW-CHA']}
        //     /> </div> : <div/> }
        //     {(title === 'deterioration') ?  <div> <Deterioration 
        //     datas = {dataConfigurations['RW-CHA']}
        //     /> </div> : <div/> }
        //     {(title === 'evaluated') ?  <div> <Evaluated 
        //     datas = {dataConfigurations['RW-CHA']}
        //     /> </div> : <div/> }
 


        return (
            <div className = 'content-con'>
            <div className = 'content-con-left'>
            <div className = 'menu-con'>
            <div className = 'title-con'>
            ECONOMIC ANALYSIS PARAMETER
            </div>
            <div className = 'nav-con'>
                <div >
                General
                </div>
                <div>
                Budget Constraints
                </div>
            </div>
            </div>
            <div className = 'menu-con'>
            <div className = 'title-con'>
            VEHICLE FLEET CHARACTERISTICS
            </div>
            <div className = 'nav-con'>
            <div className = {this.isActive('vehicle-fleet')} onClick = {() => {this.setState({title: 'vehicle-fleet'})}}>  
                Vehicle Fleet Characteristics
            </div>
           
            <div className = {this.isActive('annual')} onClick = {() => {this.setState({title: 'annual'})}}>
                Annual Traffic Growth
            </div>
            <div className = {this.isActive('operating')} onClick = {() => {this.setState({title: 'operating'})}}>
                Vehicle Operating Costs (VOC)
            </div>
            <div className = {this.isActive('speed')} onClick = {() => {this.setState({title: 'speed'})}}>
                Vehicle Speeds
            </div>
            </div>
            </div>
            <div className = 'menu-con'>
            {/* <div className = {this.isActive('RW-CHA')} onClick = {() => {this.setState({title: 'RW-CHA'})}}> */}
            <div className = 'title-con'>
            ROAD WORKS CHARACTERISTICS
            </div>
            <div className = 'nav-con'>
            <div className = {this.isActive('RW-CHA')} onClick = {() => {this.setState({title: 'RW-CHA'})}}>
                Road Works
            </div>
            <div className = {this.isActive('maintenance')} onClick = {() => {this.setState({title: 'maintenance'})}}>
                Recurrent Maintenance
            </div>
            <div className = {this.isActive('deterioration')} onClick = {() => {this.setState({title: 'deterioration'})}}>
                Road Deterioration
            </div>
            <div className = {this.isActive('evaluated')} onClick = {() => {this.setState({title: 'evaluated'})}}>
                Road Work to be Evaluated
            </div>
            </div>
            </div>
            <div className = 'menu-con'>
            <div className = 'title-con'> DEFAULT VALUES </div>
            <div className = 'nav-con'>
            <div > Carriage Way Width </div>
            <div > HDM-4 Environmental Coeff </div> 
            <div > Surface Types </div>
            <div > Road Condition and Age </div> 
            <div className = {this.isActive('traffic-levels')} onClick = {() => {this.setState({title: 'traffic-levels'})}}>
                Traffic Level
            </div>
            </div>
            </div>
            </div> 
            <div className = 'content-con-right'> { configContainer } </div>
            </div>
        )
       
    }
}