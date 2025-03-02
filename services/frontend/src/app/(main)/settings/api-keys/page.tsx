import { fetchAPIKeys } from "@/lib/api";
import Link from "next/link";
import APIKeyItem from "./api-key-item";

export default async function Page() {
    const keys = await fetchAPIKeys();

    keys.map((k) => (console.log(k.date_expire)));

    return (
        <div>
            <h1>API Keys</h1>
            <Link href={"/settings/api-keys/generate"} className="btn">Generate new key</Link>
            <div>
                {keys.map((k) => (
                    <APIKeyItem key={k.id} apiKey={k} />
                ))}
            </div>
        </div>
    )
}