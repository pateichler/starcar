import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from "next/headers";
import { CRED_COOKIE_NAME } from "@/config"; 

export default function middleware(request: NextRequest) {
    const cookie = request.cookies.get(CRED_COOKIE_NAME);
    
    if(cookie === undefined){
        const response = NextResponse.redirect(new URL("/login", request.url));
        return response;
    }
}

export const config = {
    matcher: ['/((?!login|_next/static|favicon.ico).*)',]
}