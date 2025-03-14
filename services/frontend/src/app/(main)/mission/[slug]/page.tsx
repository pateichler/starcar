import { fetchMission } from "@/lib/api"
import { notFound } from "next/navigation";
import RawDataPanel from "./rawDataPanel";
import TelemetryPanel from "./telemetryPanel";
import styles from "./page.module.css";
import InteractContextComponent from "./InteractContext";
import { Suspense } from "react";
import MissionControlBar from "./missionControlBar";
import AnalysisOne from "./analysisOne";
import Pannel from "@/components/pannel/pannel";
import LoadingIcon from "@/components/loading-icon/loading-icon";

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
                <div className={styles.dataContainer}>
                    <Pannel style={{flex: "1 1 auto"}}>
                        <Suspense fallback={<LoadingIcon />}>
                            <RawDataPanel mission={mission} />
                        </Suspense>
                    </Pannel>
                    <Pannel style={{flex: "0 1 450px"}}>
                        <Suspense fallback={<LoadingIcon />}>
                            <TelemetryPanel mission={mission} />
                        </Suspense>
                    </Pannel>
                </div>
            </InteractContextComponent>

            { mission.analysis && mission.analysis.length > 0 ? (
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