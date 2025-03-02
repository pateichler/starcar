'use client'

import { formatDate } from "@/lib/utils";
import { APIKey } from "@/types/api-key";
import { DeleteAPI } from "./api-action";

export default function APIKeyItem({apiKey} : {apiKey: APIKey}) {
    return (
        <div>
            <h3>{apiKey.name}</h3>
            <p>{apiKey.date_expire !== null ? `Expires on ${formatDate(apiKey.date_expire)}` : "Does not expire"}</p>

            <form action={() => DeleteAPI(apiKey.id)}>
                <input type="submit" value={"Delete"} />
            </form>            
        </div>
    )
}