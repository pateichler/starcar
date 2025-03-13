'use client'

import { useActionState } from "react";
import { authenticate } from "./action";


export default function LoginForm() {

    const [errorMsg, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    return (
        <div>
            <h1>Log in</h1>
            <form action={formAction}>
                <input type="password" name="password" placeholder="Password" required />
                <button aria-disabled={isPending}>Login</button>
            </form>

            <div>
                {errorMsg && (
                    <>
                    <label>Error:</label>
                    <p className="text-sm text-red-500">{errorMsg}</p>
                    </>
                )}
            </div>
        </div>
    );
}