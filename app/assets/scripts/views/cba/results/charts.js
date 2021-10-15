'use strict';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label } from 'recharts';
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
        { name: 'Insufficient Data', count: props.data.invalid_assets, fill: '#dddddd' },
        { name: 'Positive NPV', count: props.data.positive_npv, fill: '#97ff8a' },
        { name: 'Negative NPV', count: props.data.negative_npv, fill: '#ff8a8e' }
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
    var resultsWithBenefit = props.data.filter(e => e.npv > 0);
    resultsWithBenefit.map((e) => e.npv).reduce(function (a, b, i) { return npvCumSum[i] = a + b; }, 0);
    resultsWithBenefit.map((e) => e.work_cost).reduce(function (a, b, i) { return costCumSum[i] = a + b; }, 0);
    const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]))

    var data = zip([npvCumSum, costCumSum]).map((e) => { return { npv: e[0], cost: e[1] }; });
    return (
        <LineChart
            width={1000}
            height={400}
            data={data}
            className="mx-auto mt-3"
            margin={{ bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cost" type='number' tickCount={10}>
                <Label value="Work Cost ($M)" position='bottom' />
            </XAxis>

            <YAxis label={{ value: 'NPV ($M)', angle: -90, position: 'insideLeft' }} />
            <Line type="monotone" dataKey="npv" stroke="#8884d8" dot={false} />
        </LineChart >
    );
}

export function CostByYearChart(props) {


    var resultsWithBenefit = props.data.filter(e => e.npv > 0);

    var costByYear = resultsWithBenefit.reduce((acc, e) => {
        acc[e.work_year] = (acc[e.work_year] || 0) + e.work_cost;
        return acc;
    }, {});

    var years = [...Array(10).keys()].map(i => i + 1);
    var costByYear_ = years.map((y) => ({ work_year: y, work_cost: Math.round((costByYear[y] || 0) * 100) / 100 }));


    return (
        <BarChart
            width={1000}
            height={400}
            data={costByYear_}
            className="mx-auto mt-3"
            margin={{ bottom: 50 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="work_year" type='number'>
                <Label value="Work Year" position='bottom' />
            </XAxis>
            <YAxis label={{ value: 'Work Cost ($M)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="work_cost" fill="#8884d8" />
        </BarChart>
    );

}
