'use server'

import { CRED_COOKIE_NAME } from "@/config"
import { cookies } from "next/headers"

export async function logout() {
    (await cookies()).delete(CRED_COOKIE_NAME);
}