'use client'

import { getTelemetryColors } from "@/lib/mapUtils";
import { TelemetryData } from "@/types/data";
import { PathLayer } from '@deck.gl/layers';
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";


export default function TelemetryViewer({telemetry}: {telemetry: TelemetryData|null }){
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

    return (
        <div style={{height: "100%", position: "relative"}}>
            <DeckGL 
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