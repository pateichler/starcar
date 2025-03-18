'use server'

import { fetchMissionData } from "@/lib/api";
import { SensorData } from "@/types/data";

export async function fetchRawDataAction(missionID: number, minTime: number, maxTime: number): Promise<SensorData[]|null> {
    return await fetchMissionData(missionID, minTime, maxTime);
}