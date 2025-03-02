'use client'

import { EXP_DAYS_OPTIONS } from "@/config";
import { useActionState } from "react";
import { generateAPI } from "./generate-action";
import FormError from "@/components/form-error";
import FormGroup from "@/components/form-group";

export default function APIGenerateForm(){
    const [result, formAction, isPending] = useActionState(
        generateAPI,
        {error: {message: ""}}
    )
    
    if(result.apiKey !== undefined && result.apiKey != ""){
        return (
            <div>
                <h1>Created new API Key</h1>
                <p>This key will only display once, so make sure you copy and store it.</p>
                <div>
                    <p>{result.apiKey}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1>Generate API Key</h1>
            <form action={formAction}>
                <FormGroup labelName="Name" error={result.error}>
                    <input type="text" name="key_name" required />
                </FormGroup>

                <FormGroup labelName="Expiration" error={result.error}>
                    <select name="exp_days">
                        {EXP_DAYS_OPTIONS.map((exp_day) => (
                        <option key={`exp-${exp_day}`} value={exp_day}>{exp_day} {exp_day == 1 ? "day" : "days"}</option>
                        ))}
                        
                        <option key={`exp-inf`} value={-1}>No expiration</option>
                    </select>
                </FormGroup>


                <FormGroup labelName="Description" error={result.error}>
                    <p className="test">Test</p>
                    <textarea name="description" />
                    <p className="argg">Test</p>
                </FormGroup>
                
                <button aria-disabled={isPending}>Generate</button>
            </form>

            
            {result.error?.message && (
                <div>
                    <label>Error:</label>
                    <p className="text-sm text-red-500">{result.error.message}</p>
                </div>
            )}
        </div>
    );
}