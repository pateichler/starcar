import Image from "next/image";
import styles from "./page.module.css";
import { fetchAllMissions } from "@/lib/api";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";


export default async function Home() {
  const missions = await fetchAllMissions();

  return (
    <div>
      <Link href={"/settings"} className="btn">Site Settings</Link>
      <h1 className={styles.header}>Missions</h1>
      <div>
        {missions.map((mission) => (
          <Link key={mission.id} href={`/mission/${mission.id}`}>
            <div>
              <h5>{formatDate(mission.date_start)}</h5>
              <h2>{mission.name}</h2>
              <div>
                <p><span>Distance:</span> {mission.total_dist.toFixed(2)}km</p>
                <p><span>Duration:</span> {formatDuration(mission.date_start, mission.date_end)}</p>
              </div>
              <div>
                <span>Analysis 1</span>
                <span>Analysis 2</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
