'use client'

import { EXP_DAYS_OPTIONS } from "@/config";
import { useActionState } from "react";
import FormError from "@/components/form-error";
import FormGroup from "@/components/form-group";
import { setSitePassword } from "./site-password-action";

export default function SitePasswordFrom(){
    const [error, formAction, isPending] = useActionState(
        setSitePassword,
        {message: ""}
    )

    return (
        <div>
            <h1>Generate API Key</h1>
            <form action={formAction}>
                <FormGroup labelName="New password" error={error}>
                    <input type="password" name="password" required />
                </FormGroup>
                
                <button aria-disabled={isPending}>Set password</button>
            </form>

            
            {error?.message && (
                <div>
                    <label>Error:</label>
                    <p className="text-sm text-red-500">{error.message}</p>
                </div>
            )}
        </div>
    );
}