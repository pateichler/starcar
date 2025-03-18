'use client'

import { getLocationAtTelemetryTime, getTelemetryColors } from "@/lib/mapUtils";
import { TelemetryData } from "@/types/data";
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from "@deck.gl/react";
import { useContext, useEffect, useState } from "react";
import { Map } from "react-map-gl/maplibre";
import { InteractContext } from "./InteractContext";
import { MapViewState } from "deck.gl";


export default function TelemetryViewer({telemetry}: {telemetry: TelemetryData|null }){
    const { curTime } = useContext(InteractContext);

    const curPoint = telemetry !== null ? getLocationAtTelemetryTime(telemetry, curTime) : [0,0];
    const [ viewState, setViewState ] = useState<MapViewState>({
        longitude: curPoint[0],
        latitude: curPoint[1],
        zoom: 14
    })

    useEffect(() => {
        if(telemetry === null)
            return;
        
        setViewState({
            ...viewState,
            longitude: curPoint[0],
            latitude: curPoint[1]
        })
    }, [curTime]);
    
    if (telemetry == null)
        return <div>No telemetry available.</div>
    
    if (telemetry.data.length == 0)
        return <div>Telemetry data is empty.</div>


    const layer = new PathLayer<TelemetryData>({
        id: 'TelemetryLayer',
        data: [telemetry],
        
        getPath: (d: TelemetryData) => d.data.map(p => {
            const c: [longitude: number, lattitude: number] =[p.lng, p.latt];
            return c;
        }),
        getColor: (d: TelemetryData) => getTelemetryColors(d, [230, 50, 30], [30, 230, 43]), 
        getWidth: 100,
        pickable: false,
        widthMinPixels: 2,
        widthMaxPixels: 5
    });

    const posLayer = new ScatterplotLayer({
        id: "PositionLayer",
        data: [curPoint],

        getPosition: [curPoint[0], curPoint[1]],
        

        stroked: true,
        getFillColor: [40, 200, 40],
        getLineColor: [255,255,255],
        
        getRadius: 20,
        radiusMinPixels: 7,
        radiusMaxPixels: 10,

        getLineWidth: 10,
        lineWidthMinPixels: 2,
        lineWidthMaxPixels: 4,
    });

    return (
        <div style={{height: "100%", position: "relative"}}>
            <DeckGL 
                viewState={viewState}
                controller
                layers={[layer, posLayer]}
                onViewStateChange={e => setViewState(e.viewState as MapViewState)}
            >
                <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
            </DeckGL>
        </div>
    )
}