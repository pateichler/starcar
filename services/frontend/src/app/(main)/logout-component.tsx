'use client'

import { logout } from "./logout-action"

export default function LogoutComponent (){
    return <button onClick={() => logout()}>Log out</button>
} 