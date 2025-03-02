'use server'

import { fetchDeleteAPIKey } from "@/lib/api"
import { revalidatePath } from "next/cache";

export async function DeleteAPI(keyID: number){
    await fetchDeleteAPIKey(keyID);
    revalidatePath('/');
}