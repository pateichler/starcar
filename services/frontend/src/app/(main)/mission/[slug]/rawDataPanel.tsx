import { Mission } from "@/types/mission";
import { fetchMissionData } from "@/lib/api"
import RawDataGraph from "./rawDataGraph";


export default async function RawDataPanel({mission}: {mission: Mission}){
    const data = await fetchMissionData(mission.id);

    return (
        <RawDataGraph rawData={data} />
    )
}