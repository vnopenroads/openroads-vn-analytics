'use strict';
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Button } from 'react-bootstrap';
import parse from 'wellknown';
import interpolate from 'color-interpolate';

import Legend from './map/legend';
import LayerSelector from './map/layer_selector';
import config from '../../../config';


export default function ResultsMap(props) {
    const mapContainer = useRef(null);
    const legendRef = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(102.1);
    const [lat, setLat] = useState(45.00);
    const [zoom, setZoom] = useState(7);
    const [districtId, setDistrictId] = useState(300);
    const [provinceId, setProvinceId] = useState(294);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on("load", () => {
            addDistricts(map.current);
            addProvince(map.current);

            var startColor = '#ae017e'; //  '#023858',
            var endColor = '#fcc5c0';

            addRoads(map.current, props.snapshotId, props.configId, startColor, endColor);
            legendRef.current.setState({ labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
        });
    });

    var setColor = (c) => {
        console.log(c);
        let colormap = interpolate([c, 'white']);

        legendRef.current.setState({ startColor: c, endColor: colormap(0.5) })

        map.current.setPaintProperty('layer-roads', 'line-color', [
            'interpolate', ['linear'], ['get', 'work_year'], 1, c, 10, 'white'
        ]);
    };
    const linear_interp = (x, y, a) => x * (1 - a) + y * a;
    console.log(props);
    const npvMax = Math.max(...props.data.map((e) => e.npv));
    var setAttribute = (attrib) => {

        var labels = undefined;
        if (attrib == 'work_year') {
            labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        } else if (attrib == 'npv') {
            labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => Math.round(linear_interp(0, npvMax, e / 9)))
        }
        legendRef.current.setState({ labels: labels })

        map.current.setPaintProperty('layer-roads', 'line-color', [
            'interpolate', ['linear'], ['get', attrib], 1, c, 10, 'white'
        ]);
    }
    return (
        <div>
            <div ref={mapContainer} className="map-container">
                <Legend ref={legendRef} />
                <LayerSelector setColor={setColor} setAttribute={setAttribute} />
            </div>
        </div >
    );
}

function addDistricts(map) {
    fetch(`${config.api}/cba/map/districts`).then((res) => res.json())
        .then((res) => {
            console.log(res);
            map.addSource("source-districts", {
                type: "geojson",
                data: res['rows'][0]['json_build_object']
            });
            var isSelectedDistrict = ["case", ['==', ['get', 'id'], 300], 1.0, 0.0];
            // map.addLayer({
            //     id: "layer-districts-line",
            //     type: "line",
            //     source: "source-districts",
            //     paint: {
            //         "line-color": "#f05c5c",
            //         "line-dasharray": [5, 5],
            //         "line-opacity": isSelectedDistrict,
            //     },
            //     layout: { "line-sort-key": isSelectedDistrict }
            // });
            map.addLayer({
                id: "layer-districts-fill",
                type: "fill",
                source: "source-districts",
                paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": ["case", ['==', ['get', 'id'], 300], 0.0, 0.5]
                }
            });
        });
}

function addProvince(map) {
    fetch(`${config.api}/cba/map/province`).then((res) => res.json())
        .then((res) => {
            var result = res['rows'][0]
            map.addSource("source-province", {
                type: "geojson",
                data: result['json_build_object']
            });
            map.addLayer({
                id: "layer-province-line",
                type: "line",
                source: "source-province",
                paint: { "line-color": "#b0b0b0", "line-width": 2, "line-opacity": 0.5 },
            });
            map.setCenter(parse(result['centroid']).coordinates);
        });
}

function addRoads(map, snapshotId, configId, startColor, endColor) {
    fetch(`${config.api}/cba/map/road_assets?snapshot_id=${snapshotId}&config_id=${configId}`).then((res) => res.json())
        .then((res) => {
            var result = res['rows'][0]
            console.log(res);
            map.addSource("source-roads", {
                type: "geojson",
                data: result['json_build_object']
            });
            map.addLayer({
                id: "layer-roads",
                type: "line",
                source: "source-roads",
                paint: {
                    "line-color": [
                        'interpolate',
                        ['linear'],
                        ['get', 'work_year'],
                        1, startColor, // '#023858',   // '#00441b',  
                        10, endColor, // '#74a9cf'   // '#66c2a4'   
                    ],
                },
            });
        });

}

