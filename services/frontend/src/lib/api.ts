import { Analysis1, SensorData, TelemetryData, TelemetryPath, TelemetryPoint } from "@/types/data";
import { Mission } from "@/types/mission";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CRED_COOKIE_NAME } from "@/config";
import { APIKey } from "@/types/api-key";

async function getAPIAuthHeader(): Promise<{Authorization: string}>{
    const cookieStore = cookies();
    const cookie = (await cookieStore).get(CRED_COOKIE_NAME);
    if(cookie === undefined)
        redirect("/login");


    return {"Authorization": "Bearer " + cookie.value};
}

async function fetchAPI(route: string, options: RequestInit = {}): Promise<Response> {
    const authHeader = await getAPIAuthHeader();

    const f = await fetch(process.env.API_ROUTE + route, {
        ...options,
        headers: {
            ...options.headers,
            ...authHeader
        }
    });

    if(f.status == 401)
        redirect("/login");
        

    return f;
}

async function fectchPostJSON(route: string, postObj: object){
    return fetchAPI(route, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postObj)
    });
}

export async function fetchAllMissions(): Promise<Mission[]>{
    const data = await fetchAPI("get-all-missions");
    return await data.json() as Mission[];
}

export async function fetchMission(missionID: number): Promise<Mission|null> {
    const data = await fetchAPI(`mission/${missionID}`);
    if(data.status == 404)
        return null;

    return await data.json() as Mission;
}

export async function fetchRenameMission(missionID: number, name: string){
    return await fectchPostJSON(`mission/${missionID}/rename`, {name: name});
}

export async function fetchDeleteMission(missionID: number){
    return fetchAPI(`/mission/${missionID}/delete`, {'method': 'POST'});
}

export async function fetchMissionData(missionID: number): Promise<SensorData[]|null> {
    const data = await fetchAPI(`mission/${missionID}/data-reduced`);
    if(data.status == 404)
        return null;

    return await data.json() as SensorData[];
}

export async function fetchTelemetryData(missionID: number): Promise<TelemetryData|null> {
    const data = await fetchAPI(`mission/${missionID}/telemetry-reduced`);
    if(data.status == 404)
        return null;
    
    const points = await data.json() as TelemetryPoint[];
    return {"data": points} as TelemetryData;    
}


export async function fetchTelemetryPath(missionID: number): Promise<TelemetryPath|null>{
    const data = await fetchAPI(`mission/${missionID}/telemetry-path`);
    if(data.status == 404)
        return null;
    
    return await data.json() as TelemetryPath;    
}

export async function fetchSetSitePassword(jsonObj: object){
    return await fectchPostJSON("site/password", jsonObj);
}

export async function fetchAPIKeys(): Promise<APIKey[]>{
    const data = await fetchAPI("/api-key/list");

    return await data.json() as APIKey[];
}

export async function fetchDeleteAPIKey(keyID: number){
    return fetchAPI(`/api-key/${keyID}/delete`, {'method': 'POST'});
}

export async function fetchGenerateAPIKey(jsonObj: object){
    return await fectchPostJSON("api-key/new", jsonObj);
}

export async function fetchAnalysisOneData(missionID: number) : Promise<Analysis1|null>{
    const data = await fetchAPI(`mission/${missionID}/analysis-one`);
    if(data.status == 404)
        return null;

    return await data.json() as Analysis1;
}