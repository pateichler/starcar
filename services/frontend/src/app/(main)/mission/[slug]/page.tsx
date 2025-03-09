import { fetchMission } from "@/lib/api"
import { notFound } from "next/navigation";
import RawDataPanel from "./rawDataPanel";
import TelemetryPanel from "./telemetryPanel";
import InteractContextComponent from "./InteractContext";
import { Suspense } from "react";


function timeUpdate(time: number){
    console.log("We have updated our time!");
}


export default async function Page({params,}: {
    params: Promise<{ slug: number }>
}) {
    const missionID = (await params).slug;
    const mission = await fetchMission(missionID);
    
    

    if(mission == null)
        notFound();

    const test  = <TelemetryPanel mission={mission} />;
    const test2 = [test];
    return (
        <div>
            <h1>{mission.name}</h1>
            <p>{mission.date_start}</p>
            
            <InteractContextComponent>
                <Suspense>
                    <RawDataPanel mission={mission} />
                </Suspense>
                <Suspense>
                    <TelemetryPanel mission={mission} />
                </Suspense>
            </InteractContextComponent>
        </div>
    );
}