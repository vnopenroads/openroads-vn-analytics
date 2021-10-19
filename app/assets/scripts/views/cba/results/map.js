'use strict';
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import parse from 'wellknown';
import interpolate from 'color-interpolate';

import Legend from './map/legend';
import LayerSelector from './map/layer_selector';
import config from '../../../config';


export default function ResultsMap(props) {
    const mapContainer = useRef(null);
    const legendRef = useRef(null);
    const map = useRef(null);
    const lng = 104.9467516;
    const lat = 22.738768300;
    const zoom = 7;

    const halfColor = (c) => interpolate([c, 'white'])(0.75);
    const linear_interp = (x, y, a) => x * (1 - a) + y * a;

    props.labels = []; props.lowValue = 1; props.highValue = 10;
    props.startColor = '#165ca1'; props.endColor = '#ffa3c6';
    props.continuous = true;


    var updateMap = () => {
        if (props.continuous) {
            map.current.setPaintProperty('layer-roads', 'line-color', [
                'interpolate', ['linear'], ['get', props.attribute], props.lowValue, props.startColor, props.highValue, props.endColor
            ]);
            legendRef.current.setState(props); // { labels: props.labels, title: props.title, lowValue: props.lowValue, highValue: props.highValue, startColor: props.startColor, endColor: props.endColor })
        } else {
            // #5a74a1 #7d76b2 #aa73b6 #d66dab #f96a92 #ff726f #ff8845 #ffa600
            var colors = {
                "Periodic Maintenance (Concrete)": "#8dd3c7",
                "Functional Overlay (<=50mm)": "#ffed6f",
                "Reconstruction (Cobblestone)": "#bebada",
                "Reconstruction (Concrete)": "#fb8072",
                "Periodic Maintenance (Cobblestone)": "#80b1d3",
                "Reconstruction Type V": "#fdb462",
                "Regravelling (Gravel)": "#b3de69",
                "Reconstruction (Gravel)": "#fccde5",
                "Thick Overlay (>100mm)": "#bc80bd"

            };
            var x = Object.entries(colors).flat();
            var y = ["match", ['get', props.attribute], ...x, 'red'];
            map.current.setPaintProperty('layer-roads', 'line-color', y);
            map.current.setPaintProperty('layer-roads', 'line-width', 2);
            legendRef.current.setState({ ...props, colors }); // { labels: props.labels, title: props.title, lowValue: props.lowValue, highValue: props.highValue, startColor: props.startColor, endColor: props.endColor })
        }
    }

    var setColor_ = (c) => {
        if (Array.isArray(c)) {
            props.color
            console.log("WOOPS");
        } else {
            props.endColor = halfColor(c);
            props.startColor = c;
        }

    }
    var setColor = (c) => { setColor_(c); updateMap(); }

    const npvMax = Math.max(...props.data.map((e) => e.npv));

    var setAttribute_ = (attrib, colors) => {
        props.attribute = attrib;
        props.continuous = true;
        if (attrib == 'work_year') {
            props.labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            props.lowValue = 1; props.highValue = 10;
            props.title = "Work Year"
        } else if (attrib == 'npv') {
            props.labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => Math.round(linear_interp(0, npvMax, e / 9)))
            props.lowValue = props.labels[0]; props.highValue = npvMax;
            props.title = "Net Present Value (NPV)"
        } else if (attrib == 'priority') {
            props.labels = ['High', '', '', '', '', '', '', '', '', 'Low']
            props.lowValue = 1; props.highValue = props.data.length;
            props.title = "Priority Order"
        } else if (attrib == 'work_name') {
            props.labels = undefined; //  Object.keys(colors)
            props.lowValue = undefined; props.highValue = undefined;
            props.title = "Work Type"
            props.continuous = false;
        }
    }
    var setAttribute = (attrib) => { setAttribute_(attrib); updateMap(); }

    // Initial Values
    // setColor_('#ae017e');
    setAttribute_('priority');

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on("load", () => {
            var url = `${config.api}/cba/roads/snapshot/${props.snapshotId}/stats`;
            fetch(url).then((res) => res.json())
                .then((res) => {
                    props.provinceId = res.province_id;
                    props.districtId = res.district_id;

                    addDistricts(map.current, props.provinceId, props.districtId);
                    addProvince(map.current, props.provinceId, props.districtId);
                    addRoads(map.current, props.snapshotId, props.configId, props.lowColor, props.highColor, updateMap);
                });
        });
    });


    return (
        <div>
            <div ref={mapContainer} className="map-container">
                <Legend ref={legendRef} />
                <LayerSelector setColor={setColor} setAttribute={setAttribute} />
            </div>
        </div >
    );
}

const isSelectedThing = (id, is, isnt) => ["case", ['==', ['get', 'id'], id], is, isnt];

function addDistricts(map, provinceId, districtId) {
    if (!districtId || districtId <= 0) { return; }
    console.log(provinceId, districtId);
    var url = `${config.api}/cba/map/districts?`;

    var params = []
    if (districtId && districtId > 0) { params = [...params, `district_id=${districtId}`] }
    if (provinceId && provinceId > 0) { params = [...params, `province_id=${provinceId}`] }
    if (params.length > 0) { url += "?" + params.join("&") }
    console.log(url);

    fetch(url).then((res) => res.json())
        .then((res) => {
            console.log(res);
            map.addSource("source-districts", {
                type: "geojson",
                data: res['rows'][0]['json_build_object']
            });
            if (districtId > 0) {
                map.addLayer({
                    id: "layer-districts-line",
                    type: "line",
                    source: "source-districts",
                    paint: {
                        "line-color": "#444444",
                        "line-dasharray": [2, 2],
                        "line-opacity": isSelectedThing(districtId, 1.0, 0.0),
                    },
                    layout: { "line-sort-key": isSelectedThing(districtId, 1.0, 0.0) }
                });
            }
            map.addLayer({
                id: "layer-districts-fill",
                type: "fill",
                source: "source-districts",
                paint: {
                    "fill-color": "#ffffff",
                    "fill-opacity": isSelectedThing(districtId, 0.0, 0.5)
                }
            });
        });
}

function addProvince(map, provinceId, districtId) {
    if (!provinceId || provinceId <= 0) { return; }
    fetch(`${config.api}/cba/map/province`).then((res) => res.json())
        .then((res) => {
            var result = res['rows'][0]
            map.addSource("source-province", {
                type: "geojson",
                data: result['json_build_object']
            });
            if (provinceId > 0 && districtId <= 0) {
                map.addLayer({
                    id: "layer-province-line",
                    type: "line",
                    source: "source-province",
                    paint: { "line-color": isSelectedThing(provinceId, '#444444', 'white'), "dash-array": [2, 2], "line-opacity": isSelectedThing(provinceId, 0.5, 0.0) },
                });
            }
            map.addLayer({
                id: "layer-province-fill",
                type: "fill",
                source: "source-province",
                paint: { "fill-color": 'white', 'fill-opacity': isSelectedThing(provinceId, 0.0, 0.5) },
            });
        });
}

function addRoads(map, snapshotId, configId, startColor, endColor, updateMap) {
    fetch(`${config.api}/cba/map/road_assets?snapshot_id=${snapshotId}&config_id=${configId}`).then((res) => res.json())
        .then((res) => {
            var result = res['rows'][0]
            var widthFn = ["interpolate", ["linear"], ["zoom"], 6, 1, 10, 2];
            console.log(res);
            map.addSource("source-roads", {
                type: "geojson",
                data: result['json_build_object']
            });
            map.addLayer({
                id: "layer-roads",
                type: "line",
                source: "source-roads",
                paint: { 'line-width': widthFn, "line-color": 'red' }, // will be overwritten by call to updateMap
            });
            map.setCenter(parse(result['centroid']).coordinates);
            updateMap();
        });

}

