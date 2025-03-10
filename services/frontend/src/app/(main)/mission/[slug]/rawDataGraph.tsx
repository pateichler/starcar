'use client'

import { SensorData } from "@/types/data";
import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, Legend } from "recharts";
import dynamic from "next/dynamic";
import { convertTimestampToDate, formatChartDuration } from "@/lib/utils";
import { CategoricalChartState } from "recharts/types/chart/types";
import { InteractContext } from "./InteractContext";
import { useState, useContext } from "react";
import { convertRawAcceleration, convertRawGaugeToStrain } from "@/lib/dataUtils"


// function generateCallback(onTimeUpdate: (time: number) => void): (nextState: CategoricalChartState, _: any) => void{
//     function onMove(nextState: CategoricalChartState, _: any){
//         if(nextState.activePayload !== undefined)
//             onTimeUpdate(nextState.activePayload[0].payload.time);
//     }

//     return onMove;
// }


// function move(nextState: CategoricalChartState, _: any){
    
//     if(nextState.activePayload !== undefined){
//         console.log(nextState.activePayload[0].payload.time);
//     }
// }

const LineChart = dynamic( () => (import("recharts").then(recharts => recharts.LineChart)), {
    ssr: false
} )

export default function RawDataGraph({rawData}: {rawData: SensorData[]|null }){
    const [activeSeries, setActiveSeries] = useState<Array<string>>([]);

    if (rawData == null)
        return <div>Error in retreiving data.</div>

    if (rawData.length == 0)
        return <div>Data is empty.</div>

    const accelerationData = convertRawAcceleration(rawData);
    const strainData = convertRawGaugeToStrain(rawData);
    
    const handleLegendClick = (dataKey: string) => {
      if (activeSeries.includes(dataKey)) {
        setActiveSeries(activeSeries.filter(el => el !== dataKey));
      } else {
        setActiveSeries(prev => [...prev, dataKey]);
      }
    };

    return (
        <div>
            <ResponsiveContainer width={"100%"} height={200}>
                <LineChart width={480} height={480} data={accelerationData} syncId={"data"}>
                    <Line hide={activeSeries.includes('x')} name="X" type={"monotone"} dataKey={"x"}  stroke={"#8884d8"} dot={false} />
                    <Line hide={activeSeries.includes('y')} name="Y" type={"monotone"} dataKey={"y"}  stroke={"#20a418"} dot={false} />
                    <Line hide={activeSeries.includes('z')} name="Z" type={"monotone"} dataKey={"z"}  stroke={"#9bbb04"} dot={false} />
                    <YAxis>
                        <Label value={"Acceleration (m/s^2)"} angle={-90} position={"insideBottomLeft"} />    
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={"100%"} height={200}>
                <LineChart width={480} height={480} data={strainData} syncId={"data"}>
                    <Line hide={activeSeries.includes('gaugeLeft')} name="Left" type={"monotone"} dataKey={"gaugeLeft"}  stroke={"#8884d8"} dot={false} />
                    <Line hide={activeSeries.includes('gaugeRight')} name="Right" type={"monotone"} dataKey={"gaugeRight"}  stroke={"#20a418"} dot={false} />
                    <XAxis dataKey={"time"} tickFormatter={formatChartDuration}>
                        <Label value="Mission time (T+ h:mm:ss)" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                        <Label value={"Microstrain"} angle={-90} position={"insideBottomLeft"} />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}