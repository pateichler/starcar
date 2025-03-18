import { fetchAnalysisOneData, fetchMission } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({params,}: {
    params: Promise<{ slug: number }>
}) {
    const missionID = (await params).slug;
    const mission = await fetchMission(missionID);

    if(mission == null)
        notFound();

    const data = await fetchAnalysisOneData(mission.id);

    return (
        <div>
            <Link href={`/mission/${missionID}`}>&lt;Mission</Link>
            <h1>Analysis 1</h1>
            <p>Gauge 1 average {data?.gauge_1_average}</p>
            <p>Gauge 1 average {data?.gauge_2_average}</p>
        </div>
    )
}