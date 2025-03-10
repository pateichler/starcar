'use client'

import { getTelemetryColors } from "@/lib/mapUtils";
import { TelemetryData, TelemetryPath, TelemetryPoint } from "@/types/data";
// import DeckGL from '@deck.gl/react';
import {GeoJsonLayer, LineLayer, PathLayer} from '@deck.gl/layers';
import DeckGL from "@deck.gl/react";
import { Color, MapViewState, TripsLayer } from "deck.gl";
import { Map } from "react-map-gl/maplibre";
import { InteractContext } from "./InteractContext";
import { useContext, useMemo, useState } from "react";


// export default function TelemetryViewer({telemetry}: {telemetry: TelemetryPath|null }){
export default function TelemetryViewer({telemetry}: {telemetry: TelemetryData|null }){
    if (telemetry == null)
        return <div>No telemetry available.</div>
    
    if (telemetry.data.length == 0)
        return <div>Telemetry data is empty.</div>

    // telemetry.path.push([-93, 27]);
    // const path = {"path": telemetry} as TelemetryPath;

    // const p = [{"time": [0,1], "path": [[2,5],[4,6]]}] as TelemetryPath[];
    
    // const { curTime, setTime } = useContext(InteractContext);

    // Probably shouldn't do this
    // const colors =  useMemo( () => {
    //     return getTelemetryColors(telemetry, [230, 50, 30], [30, 230, 43]);
    // }, [telemetry.data]);

    // console.log("Curtime: " + curTime);

    const startTime = telemetry.data[0].time;
    const lineColors = getTelemetryColors(telemetry, [230, 50, 30], [30, 230, 43]);

    const layer = new PathLayer<TelemetryData>({
        id: 'TelemetryLayer',
        data: [telemetry],
        
        getPath: (d: TelemetryData) => d.data.map(p => {
            const c: [longitude: number, lattitude: number] =[p.lng, p.latt];
            return c;
        }),
        // getColor: [230, 50, 30],
        // getColor: d => getTelemetryColors(d, [230, 50, 30], [30, 230, 43]), 
        getColor: (d: TelemetryData) => getTelemetryColors(d, [230, 50, 30], [30, 230, 43]), 
        // getColor: lineColors, 
        getWidth: 100,
        pickable: false,
        widthMinPixels: 2,
        widthMaxPixels: 5
    });

    // telemetry.data.map(p => console.log(p.time - startTime));

    // const tripLayer = new TripsLayer<TelemetryData>({
    //     id: "TelemetryTrip",
    //     data: [telemetry],

    //     getPath: (d: TelemetryData) => d.data.map(p => [p.lng, p.latt]),
    //     getTimestamps: (d: TelemetryData) => d.data.map(p => p.time - startTime),
    //     getColor: d => [59,180,40],
    //     currentTime: 75538,
    //     trailLength: 50000,

    //     pickable: false,
    //     getWidth: 100,
    //     widthMinPixels: 2,
    //     widthMaxPixels: 5
    // });

    return (
        <div style={{width: "480px", height: "480px", position: "relative"}}>
            <DeckGL 
                // initialViewState={{
                //     longitude: telemetry.path[0][0],
                //     latitude: telemetry.path[0][1],
                //     zoom: 12
                // }}
                initialViewState={{
                    longitude: telemetry.data[0].lng,
                    latitude: telemetry.data[0].latt,
                    zoom: 14
                }}
                controller
                layers={[layer]}
            >
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
            </DeckGL>
        </div>
    )
}