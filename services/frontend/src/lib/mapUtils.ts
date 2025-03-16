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

function lerp(min: number, max: number, t: number){
    return t * (max - min) + min;
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
    //TODO: Optimize with binary search
    for(let i = 1; i < telemetry.data.length; i+=1){
        if(telemetry.data[i].time > time){
            const t = getLerpValue(time, telemetry.data[i-1].time, telemetry.data[i].time);

            return [
                lerp(telemetry.data[i-1].lng, telemetry.data[i].lng, t),
                lerp(telemetry.data[i-1].latt, telemetry.data[i].latt, t)
            ];
        }
    }
    return [telemetry.data[telemetry.data.length-1].lng, telemetry.data[telemetry.data.length-1].latt];
}