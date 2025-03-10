'use client'

import { SensorData } from "@/types/data";
import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, Legend } from "recharts";
import dynamic from "next/dynamic";
import { convertTimestampToDate, formatChartDuration } from "@/lib/utils";
import { CategoricalChartState } from "recharts/types/chart/types";
import { InteractContext } from "./InteractContext";
import { useState, useContext } from "react";


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
    if (rawData == null)
        return <div>Error in retreiving data.</div>

    if (rawData.length == 0)
        return <div>Data is empty.</div>

    // const { setTime } = useContext(InteractContext);
    // const moveCallback = generateCallback(setTime);
    // const moveCallback = generateCallback(function(t:number){});
    // console.log("Update data graph!");
    // <LineChart width={480} height={480} data={rawData} syncId={"data"} onMouseMove={moveCallback} />

    const gauge1Start = rawData[0].gauge.gauge_1;
    const gauge2Start = rawData[0].gauge.gauge_2;

    rawData.forEach(s => {
        s.gauge.gauge_1 -= gauge1Start;
        s.gauge.gauge_2 -= gauge2Start;
    });

    const [activeSeries, setActiveSeries] = useState<Array<string>>([]);
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
                <LineChart width={480} height={480} data={rawData} syncId={"data"}>
                    <Line hide={activeSeries.includes('acceleration.x')} name="X" type={"monotone"} dataKey={"acceleration.x"}  stroke={"#8884d8"} dot={false} />
                    <Line hide={activeSeries.includes('acceleration.y')} name="Y" type={"monotone"} dataKey={"acceleration.y"}  stroke={"#20a418"} dot={false} />
                    <Line hide={activeSeries.includes('acceleration.z')} name="Z" type={"monotone"} dataKey={"acceleration.z"}  stroke={"#9bbb04"} dot={false} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={"100%"} height={200}>
                <LineChart width={480} height={480} data={rawData} syncId={"data"}>
                    <Line hide={activeSeries.includes('gauge.gauge_1')} name="Left" type={"monotone"} dataKey={"gauge.gauge_1"}  stroke={"#8884d8"} dot={false} />
                    <Line hide={activeSeries.includes('gauge.gauge_2')} name="Right" type={"monotone"} dataKey={"gauge.gauge_2"}  stroke={"#20a418"} dot={false} />
                    <XAxis dataKey={"time"} tickFormatter={formatChartDuration}>
                        <Label value="Mission time (T+ h:mm:ss)" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}