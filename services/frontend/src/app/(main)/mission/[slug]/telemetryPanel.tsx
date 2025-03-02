import { fetchTelemetryData } from "@/lib/api"
import TelemetryViewer from "./telemetry";
import { Mission } from "@/types/mission";

export default async function TelemetryPanel({mission}: {mission: Mission}){
    
    
    const telemetry = await fetchTelemetryData(mission.id);

    return (
        <div>
            <TelemetryViewer telemetry={telemetry} />
        </div>
    );
}