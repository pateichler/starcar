// TODO: These calcuations would be better to be computed on backend server instead of front end
import { SensorData } from "@/types/data";

const HX711_GAIN = 32;
const NUM_BITS = 24;
const MAX_BIT_VAL = 2**(NUM_BITS-1);
const GAUGE_TO_VOLT_RATIO = 1 / (HX711_GAIN * MAX_BIT_VAL);

const GF = 2.1;
const POISSON_RATIO = 0.295;

function gaugeToMicroStrain(gDiff: number){
    const vR = gDiff * GAUGE_TO_VOLT_RATIO;

    return - (1e6 * 2 * vR) / (GF * (POISSON_RATIO + 1) + GF * vR * (POISSON_RATIO - 1));
}

export function convertRawGaugeToStrain(data: SensorData[]){
    const gauge1Start = data[0].gauge.gauge_1;
    const gauge2Start = data[0].gauge.gauge_2;

    return data.map(d => ({
        time: d.time,
        gaugeLeft: gaugeToMicroStrain(d.gauge.gauge_1 - gauge1Start),
        gaugeRight: gaugeToMicroStrain(d.gauge.gauge_2 - gauge2Start)
    }));
}


// iOS devices record in units of g
const IOS_ACCEL_TO_M_S2 = 9.8066;

export function convertRawAcceleration(data: SensorData[]){
    return data.map(d => ({
        time: d.time,
        x: d.acceleration.x * IOS_ACCEL_TO_M_S2,
        y: d.acceleration.y * IOS_ACCEL_TO_M_S2,
        z: d.acceleration.z * IOS_ACCEL_TO_M_S2
    }));
}