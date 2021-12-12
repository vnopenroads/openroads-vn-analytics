'use strict';
import React from 'react';
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Label } from 'recharts';
import { PieChart, Cell, Pie, Sector, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Tooltip, Legend } from 'recharts';
import { Spinner } from 'react-bootstrap';
import { renderActiveShape } from '../chart_utils';


export function AssetBreakdownChart(props) {
    if (!props.data.positive_npv) {
        return <Spinner animation="border" role="status" variant='danger'>
            <span className="visually-hidden">Chart Loading...</span>
        </Spinner>
    }


    const [activeIndex, setActiveIndex] = React.useState(0);

    var data = [
        // { name: 'Insufficient Data', count: props.data.invalid_assets, fill: '#da251d88' },
        { name: 'Medium Term Priority', count: props.data.medium_term, fill: '#81dd75' },
        { name: 'Long Term Priority', count: props.data.long_term, fill: '#cae9c6' },
        { name: 'No Recommendation', count: props.data.negative_npv, fill: '#c6e2e9' }
    ];
    data = data.map((e) => { return { valueStr: `${e.count} assets`, ...e } });
    return <PieChart width={600} height={400} className='mx-auto mt-3'>
        <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            fill="#da251d88"
            nameKey="name"
            dataKey="count"
            onMouseEnter={(_, i) => setActiveIndex(i)}
        >
            {data.map((e, i) => <Cell key={`cell-${i}`} fill={e.fill} />)}
        </Pie>
    </PieChart>
}

export function CumumlativeNPVChart(props) {

    var npvCumSum = [], costCumSum = [];
    console.log(props.data)
    var resultsWithBenefit = props.data.filter(e => e.npv > 0 && e.work_year < 6);
    resultsWithBenefit.map((e) => e.work_cost).reduce(function (a, b, i) { return costCumSum[i] = a + b; }, 0);
    resultsWithBenefit.map((e) => e.npv).reduce(function (a, b, i) { return npvCumSum[i] = a + b; }, 0);
    const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]))

    const round = (value) => Math.round(value * 10) / 10;
    var data = zip([npvCumSum, costCumSum]).map((e) => { return { npv: round(e[0]), cost: round(e[1]) }; });

    //        <Area type="monotone" dataKey="cost" stroke="#cccccc" fill="#cccccc" stackId="1" />
    // <Area type="monotone" dataKey="npv" stroke="#b4fec5" fill="#b4fec5" stackId="1" />

    return (
        <LineChart
            width={1000}
            height={400}
            data={data}
            className="mx-auto mt-3"
            margin={{ left: 20, bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cost" type='number' tickCount={10}>
                <Label value="Recommended Maintenance ($M)" position='bottom' offset={50} />
            </XAxis>

            <YAxis>
                <Label value='Social and Economic Benefits ($M)' position='insideBottomLeft' angle={-90} />
            </YAxis>
            <Line type="monotone" dataKey="npv" stroke="#f58888" />
            <Tooltip />
            <Legend />

        </LineChart >
    );
}

export function CostByYearChart(props) {


    var resultsWithBenefit = props.data.filter(e => e.npv > 0);

    var costByYear = resultsWithBenefit.reduce((acc, e) => {
        acc[e.work_year] = (acc[e.work_year] || 0) + e.work_cost;
        return acc;
    }, {});

    var years = [...Array(5).keys()].map(i => i);
    var costByYear_ = years.map((y) => ({ work_year: y + props.startingYear, work_cost: Math.round((costByYear[y + 1] || 0) * 100) / 100 }));

    // type='number' domain={['dataMin-1', 'dataMax+1']}>
    return (
        <BarChart
            width={1000}
            height={400}
            data={costByYear_}
            className="mx-auto mt-3"
            margin={{ bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="work_year" >
                <Label value="Work Year" position='bottom' />
            </XAxis>
            <YAxis label={{ value: 'Work Cost ($M)', angle: -90 }} />
            <Tooltip />
            <Bar dataKey="work_cost" fill="#f58888" formatter={(a) => `$${parseFloat(a).toFixed(1)}M`} />
        </BarChart>
    );

}

export function WorkByTypeChart(props) {

    var accumulateField = (f) => resultsWithBenefit.reduce((acc, e) => {
        acc[e.work_name] = (acc[e.work_name] || 0) + e[f];
        return acc;
    }, {});

    var resultsWithBenefit = props.data.filter(e => e.npv > 0 && e.work_year <= 5);
    console.log(resultsWithBenefit);

    var lengthByType = accumulateField('length');
    var costByType = accumulateField('work_cost');
    var data = Object.entries(lengthByType).map(([k, v]) => ({ work_type: k, length: v, work_cost: costByType[k] }));

    return (
        <BarChart
            width={1000}
            height={400}
            data={data}
            className="mx-auto mt-3"
            margin={{ bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="work_type" >
                <Label value="Work Type" position='bottom' />
            </XAxis>
            <YAxis label={{ value: 'KM', angle: -90 }} yAxisId="1" />
            <YAxis key='work_cost' type='number' orientation='right' yAxisId="2" label={{ value: 'USD (M)', angle: -90 }} />
            <Tooltip />
            <Bar dataKey="length" yAxisId="1" fill="#f58888" formatter={(a) => `${parseFloat(a).toFixed(1)} km`} />
            <Bar dataKey="work_cost" yAxisId="2" fill="#f7c0c0" formatter={(a) => `$${parseFloat(a).toFixed(1)}M`} />
        </BarChart>
    );

}

