import Link from "next/link";

export default async function Page() {
    return (
        <div>
            <h1>Settings</h1>
            <div>
                <Link href={"/settings/api-keys"} className="btn">API Keys</Link>
                <Link href={"/settings/site-password"} className="btn">Change Site Passowrd</Link>
            </div>
        </div>
    )
}