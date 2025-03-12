import { fetchAnalysisOneData } from "@/lib/api";
import { Mission } from "@/types/mission";

export default async function AnalysisOne({mission}: {mission: Mission}){
    const data = await fetchAnalysisOneData(mission.id);

    return (
        <div>
            <h5>Analysis 1</h5>
            <p>Gauge 1 average {data?.gauge_1_average}</p>
            <p>Gauge 1 average {data?.gauge_2_average}</p>
        </div>
    )
}