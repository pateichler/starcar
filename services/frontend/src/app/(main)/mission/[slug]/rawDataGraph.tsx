'use client'

import { SensorData } from "@/types/data";
import { Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Label, Legend, ReferenceArea } from "recharts";
import dynamic from "next/dynamic";
import { formatChartDuration } from "@/lib/utils";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { convertRawAcceleration, convertRawGaugeToStrain } from "@/lib/dataUtils"
import { InteractContext } from "./InteractContext";
import { CategoricalChartState } from "recharts/types/chart/types";
import { Mission } from "@/types/mission";
import { fetchRawDataAction } from "./rawDataLoaderAction";


function generateCallback(onTimeUpdate: (time: number) => void): (nextState: CategoricalChartState) => void{
    function onMove(nextState: CategoricalChartState){
        if(nextState.activePayload !== undefined)
            onTimeUpdate(nextState.activePayload[0].payload.time);
    }

    return onMove;
}

const LineChart = dynamic( () => (import("recharts").then(recharts => recharts.LineChart)), {
    ssr: false
} )

export default function RawDataGraph({rawData, mission}: {rawData: SensorData[]|null, mission: Mission }){
    const [activeSeries, setActiveSeries] = useState<Array<string>>([]);
    const [customViewData, setCustomViewData] = useState<SensorData[]|null>(null);
    const [startTimeSelection, setStartTimeSelection]  = useState<number|null>(null);
    const [endTimeSelection, setEndTimeSelection]  = useState<number|null>(null);

    const { setTime, leftTimeBound, rightTimeBound, setLeftTimeBound, setRightTimeBound } = useContext(InteractContext);
    const moveSyncCallback = generateCallback(setTime);
    

    useEffect(() => {
        if(leftTimeBound == 0 && rightTimeBound == 0)
            setCustomViewData(null);
        else
            fetchRawDataAction(mission.id, leftTimeBound, rightTimeBound).then((data) => setCustomViewData(data));
    }, [leftTimeBound, rightTimeBound]);

    const data = customViewData ?? rawData;

    if (data == null)
        return <div>Error in retreiving data.</div>

    if (data.length == 0)
        return <div>Data is empty.</div>

    const accelerationData = convertRawAcceleration(data);
    const strainData = convertRawGaugeToStrain(data);
    
    const handleLegendClick = (dataKey: string) => {
      if (activeSeries.includes(dataKey)) {
        setActiveSeries(activeSeries.filter(el => el !== dataKey));
      } else {
        setActiveSeries(prev => [...prev, dataKey]);
      }
    };

    function handleMouseDown(nextState: CategoricalChartState, _event: SyntheticEvent){
        if(nextState.activePayload !== undefined)
            setStartTimeSelection(parseInt(nextState.activePayload[0].payload.time));
    }

    function handleMouseMove(nextState: CategoricalChartState, _event: SyntheticEvent){
        if(nextState.activePayload !== undefined && startTimeSelection)
            setEndTimeSelection(parseInt(nextState.activePayload[0].payload.time));

        moveSyncCallback(nextState);
    }

    function handleMouseUp(_nextState: CategoricalChartState, _event: SyntheticEvent){
        if(endTimeSelection === null || startTimeSelection === null)
            return;

        if(endTimeSelection > startTimeSelection){
            setLeftTimeBound(startTimeSelection);
            setRightTimeBound(endTimeSelection);
        }else{
            setLeftTimeBound(endTimeSelection);
            setRightTimeBound(startTimeSelection);
        }

        setStartTimeSelection(null);
        setEndTimeSelection(null);
    }

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            <div>
                <h3>Raw Mission Data</h3>
                {leftTimeBound && rightTimeBound ? (
                    <button style={{marginLeft: "25px"}} onClick={() => {setLeftTimeBound(0); setRightTimeBound(0);}}>Zoom out</button>
                ) : <></>}
            </div>
            <ResponsiveContainer>
                <LineChart data={accelerationData} syncId={"data"} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                    <Line hide={activeSeries.includes('x')} name="Acceleration X" type={"monotone"} dataKey={"x"}  stroke={"#8884d8"} dot={false} isAnimationActive={false} />
                    <Line hide={activeSeries.includes('y')} name="Acceleration Y" type={"monotone"} dataKey={"y"}  stroke={"#20a418"} dot={false} isAnimationActive={false} />
                    <Line hide={activeSeries.includes('z')} name="Acceleration Z" type={"monotone"} dataKey={"z"}  stroke={"#9bbb04"} dot={false} isAnimationActive={false} />
                    <XAxis dataKey={"time"} tickFormatter={formatChartDuration} tick={false} />
                    <YAxis>
                        <Label value={"Acceleration (m/s^2)"} angle={-90} position={"insideLeft"} />    
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                    {startTimeSelection && endTimeSelection ? (
                        <ReferenceArea x1={startTimeSelection} x2={endTimeSelection} strokeOpacity={0.3} />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={strainData} syncId={"data"} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                    <Line hide={activeSeries.includes('gaugeLeft')} name="Left strut" type={"monotone"} dataKey={"gaugeLeft"}  stroke={"#8884d8"} dot={false} isAnimationActive={false} />
                    <Line hide={activeSeries.includes('gaugeRight')} name="Right strut" type={"monotone"} dataKey={"gaugeRight"}  stroke={"#20a418"} dot={false} isAnimationActive={false} />
                    <XAxis dataKey={"time"} tickFormatter={formatChartDuration}>
                        <Label value="Mission time (T+ h:mm:ss)" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis>
                        <Label value={"Microstrain"} angle={-90} position={"insideLeft"} />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} onClick={props => handleLegendClick(props.dataKey as string)} />
                    {startTimeSelection && endTimeSelection ? (
                        <ReferenceArea x1={startTimeSelection} x2={endTimeSelection} strokeOpacity={0.3} />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}