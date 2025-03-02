export type AccelerationData = {
    x: number;
    y: number;
    z: number;
}

export type GaugeData = {
    gauge_1: number;
    gauge_2: number;
}

export type SensorData = {
    time: number;
    acceleration: AccelerationData;
    gauge: GaugeData;
};


export type TelemetryPoint = {
    time: number;
    latt: number;
    lng: number;
    distance: number;
}

export type TelemetryData = {
    data: TelemetryPoint[];
    maxVel: number;
    minVel: number;
}

export type TelemetryPath = {
    time: number[];
    path: [longitude: number, latitude: number][];
}