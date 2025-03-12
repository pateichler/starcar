import { fetchMission } from "@/lib/api"
import { notFound } from "next/navigation";
import RawDataPanel from "./rawDataPanel";
import TelemetryPanel from "./telemetryPanel";
import InteractContextComponent from "./InteractContext";
import { Suspense } from "react";
import MissionControlBar from "./missionControlBar";
import AnalysisOne from "./analysisOne";


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

    
    return (
        <div>
            <MissionControlBar mission={mission} />
            
            <InteractContextComponent>
                <Suspense>
                    <RawDataPanel mission={mission} />
                </Suspense>
                <Suspense>
                    <TelemetryPanel mission={mission} />
                </Suspense>
            </InteractContextComponent>

            { mission.analysis ? (
                <div>
                    <h2>Analysis</h2>
                    <AnalysisOne mission={mission} />
                </div>
            ):(
                <></>
            )}
            
        </div>
    );
}