'use strict';
import React from 'react';
import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label, Legend } from 'recharts';
import { Form, Row, Col } from 'react-bootstrap'
import HelpOverlay from '../../help_overlay';
import _ from 'lodash';
import debounce from 'lodash.debounce';
import config from '../../../config';
import { round } from '../../../utils/format';
// import Slider from 'rc-slider';


function avgByYear(arrays) {
    let result = [];
    let numYears = Math.min(arrays[0].length, 5);
    for (var i = 0; i < numYears; i++) {
        var num = 0;
        for (var j = 0; j < arrays.length; j++) {
            num += arrays[j][i];
        }
        result.push(num / arrays.length);
    }
    return result;
};

function percGoodByYear(arrays) {
    let result = [];
    let goodThreshold = 8.5;
    let numYears = Math.min(arrays[0].length, 5);
    for (var i = 0; i < numYears; i++) {
        var goodCount = 0;
        for (var j = 0; j < arrays.length; j++) {
            goodCount += arrays[j][i] <= goodThreshold ? 1 : 0;
        }
        result.push(100.0 * goodCount / arrays.length);
    }
    return result;
};

const cumulativeSum = (sum => value => sum += value)(0);

export default class RoadConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = { lineData: undefined, totalBudget: 0.0 };
        this.sliderRef = React.createRef();
        this.budgetRef = React.createRef();
        this.moveSlider = this.moveSlider.bind(this);
    }

    componentDidMount() {
        var iriBase = this.props.data.map(e => e.iri_base);
        var iriProj = this.props.data.map(e => e.iri_projection);
        // const lastTwo = cars.slice(-2);
        // var avgIriBase = avgByYear(iriBase);
        // var avgIriProjection = avgByYear(iriProj);
        var validElements = this.props.data.filter(e => e.work_year < 6);
        var workCosts = validElements.map(e => e.work_cost);

        var totalBudget = round(workCosts.reduce((partial_sum, a) => partial_sum + a, 0), 1)
        var availableBudget = totalBudget;
        var cumulativeBudget = workCosts.map(cumulativeSum);
        var goodBase = percGoodByYear(iriBase);
        var goodProjection = percGoodByYear(iriProj);
        var lineData = _.zip(goodBase, goodProjection).map(([b, p], i) => ({ year: i + this.props.startingYear, iriBase: b, iriProjection: p, iriBudget: p }));
        this.setState({ lineData, totalBudget, goodBase, goodProjection, iriBase, iriProj, availableBudget, cumulativeBudget });
    }


    moveSlider() {
        console.log(this.sliderRef.current.value)
        let { iriBase, iriProj, availableBudget, cumulativeBudget, goodBase, goodProjection } = this.state;
        var goal = this.sliderRef.current.value;

        const findClosest = (arr, target) => {
            var idx = 0, closestVal = arr[0] || 0;
            arr.forEach((e, i) => {
                if (Math.abs(e - target) < Math.abs(closestVal - target)) {
                    idx = i; closestVal = e;
                }
            });
            return [round(closestVal, 1), idx];
        }

        var [closest, n] = findClosest(cumulativeBudget, this.sliderRef.current.value);

        console.log(closest);
        this.sliderRef.current.value = closest;
        this.budgetRef.current.value = `$${closest}M`;

        var numElem = iriBase.length;
        var iriBudget = iriProj.slice(0, n).concat(iriBase.slice(-(numElem - n)));
        var goodBudget = percGoodByYear(iriBudget);
        var lineData = _.zip(goodBase, goodProjection, goodBudget).map(([b, p, bg], i) => ({ year: i + this.props.startingYear, iriBase: b, iriProjection: p, iriBudget: bg }));
        console.log("move");
        console.log(lineData);
        this.setState({ lineData, goodBase, goodProjection, iriBase, iriProj, availableBudget, cumulativeBudget });
    }


    render() {
        if (!this.state.lineData) {
            return "";
        }
        const wrapperStyle = { width: 400, margin: 50 };
        const debouncedChangeHandler = debounce(this.moveSlider, 300);
        var numYears = 5;
        // <YAxis label={{ value: 'Roughness', angle: -90 }} yAxisId="2" orientation='right' hidden={true} />
        // <Slider min={20} defaultValue={20} marks={{ 20: 20, 40: 40, 100: 100 }} step={null} />
        // <Form.Control type="range" min="0" max={this.props.totalBudget} step="0.1" id="customRange3" onSlideStop={this.moveSlider} ref={this.sliderRef} />
        console.log(this.state.lineData);
        return (<div>
            <LineChart
                width={1000}
                height={400}
                data={this.state.lineData}
                className="mx-auto mt-3"
                margin={{ bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="cccccc" />
                <XAxis dataKey="year" type='number' domain={['dataMin-1', 'dataMax+1']} tickCount={numYears + 2}>
                    <Label value="Year" position='bottom' />
                </XAxis>

                <YAxis label={{ value: '% Fair to Good', angle: -90 }} yAxisId="1" />
                <Line type="monotone" name="No investment" yAxisId="1" dataKey="iriBase" strokeDasharray="5 5" stroke="#cccccc" dot={false} />
                <Line type="monotone" name="Available budget" yAxisId="1" dataKey="iriBudget" stroke="#f58888" strokeWidth={2} dot={false} />
                <Line type="monotone" name="Recommended budget" yAxisId="1" dataKey="iriProjection" stroke="#f7d2d2" dot={false} />
                <Legend verticalAlign="top" height={36} />
            </LineChart >



            <Form.Group className="d-flex road-condition-form-group justify-content-center">
                <Form.Label>Budget Required</Form.Label>
                <Form.Control type="text" readOnly placeholder={`$${this.state.totalBudget}M`} />
                <Form.Label>Budget Available</Form.Label>
                <Form.Control type="text" readOnly ref={this.budgetRef} placeholder={`$${this.state.totalBudget / 2}M`} />
            </Form.Group>
            <Form.Control type="range" min="0" max={this.state.totalBudget} step="0.1"
                className="mx-auto" id="range-slider" onChange={debouncedChangeHandler} ref={this.sliderRef} />

        </div>
        );
    }


}


