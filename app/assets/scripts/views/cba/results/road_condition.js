'use strict';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label } from 'recharts';
import _ from 'lodash';
import config from '../../../config';

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


export default class RoadConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
    }

    render() {
        var iriBase = this.props.data.map(e => e.iri_base)
        var iriProj = this.props.data.map(e => e.iri_projection)
        // var avgIriBase = avgByYear(iriBase);
        // var avgIriProjection = avgByYear(iriProj);
        var goodBase = percGoodByYear(iriBase);
        var goodProjection = percGoodByYear(iriProj);
        var x = _.zip(goodBase, goodProjection).map(([b, p], i) => ({ year: i + this.props.startingYear, iriBase: b, iriProjection: p }));
        var numYears = 5;
        // <YAxis label={{ value: 'Roughness', angle: -90 }} yAxisId="2" orientation='right' hidden={true} />
        return (<LineChart
            width={1000}
            height={400}
            data={x}
            className="mx-auto mt-3"
            margin={{ bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" type='number' domain={['dataMin-1', 'dataMax+1']} tickCount={numYears + 2}>
                <Label value="Year" position='bottom' />
            </XAxis>

            <YAxis label={{ value: '% Fair to Good', angle: -90 }} yAxisId="1" />
            <Line type="monotone" yAxisId="1" dataKey="iriBase" stroke="#cccccc" dot={false} />
            <Line type="monotone" yAxisId="1" dataKey="iriProjection" stroke="#f58888" strokeWidth={2} dot={false} />
        </LineChart >
        );
    }


}


