import { Color } from "deck.gl";
import { TelemetryData } from "@/types/data";

function lerpColor(color1: Color, color2: Color, t: number): Color{
    return color1.map((e, i) => Math.floor(t * (color2[i] - e) + e)) as Color;
}

function getLerpValue(val: number, min: number, max: number): number{
    if(max - min <= 0)
        return 0;

    const t = (val - min) / (max - min);
    
    return Math.min(Math.max(t, 0), 1);
}

export function getTelemetryColors(telemetry: TelemetryData, minColor: Color, maxColor: Color): Color[]{
    return telemetry.data.map((p, index, arr) => {
        if(index == 0)
            return lerpColor(minColor, maxColor, 0);

        const tDiff = (p.time - arr[index-1].time)/1e3;
        if(tDiff <= 0)
            return lerpColor(minColor, maxColor, 0);

        // const t = getLerpValue(p.distance / p.time, telemetry.maxVel, telemetry.maxVel);
        const t = getLerpValue(1000 * p.distance / tDiff, 0, 5);
        return lerpColor(minColor, maxColor, t);
    });
}


export function getLocationAtTelemetryTime(telemetry: TelemetryData, time: number): [longitude: number, lattitude: number]{
    return [0,0];
}