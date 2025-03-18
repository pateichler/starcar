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
import { formatAverageSpeed, formatDuration } from "@/lib/utils";

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
            
            <div className={styles.quickStatsContainer}>
                <Pannel>
                    <h4 className="title">Duration</h4>
                    <h2 className="value">{formatDuration(mission.date_start, mission.date_end, true)}</h2>
                </Pannel>
                <Pannel>
                    <h4 className="title">Distance</h4>
                    <h2 className="value">{mission.total_dist.toFixed(2)} km</h2>
                </Pannel>
                <Pannel>
                    <h4 className="title">Average speed</h4>
                    <h2 className="value">{formatAverageSpeed(mission.total_dist, mission.date_start, mission.date_end)}</h2>
                </Pannel>
            </div>

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