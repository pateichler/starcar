'use server'

import { fetchGenerateAPIKey } from '@/lib/api';
import { ErrorMessage } from '@/types/error-message';

type GenerateResult = {
    apiKey?: string
    error?: ErrorMessage
}

export async function generateAPI(prevState: GenerateResult | undefined, formData: FormData): Promise<GenerateResult> {

    const data = {
        "key_name": formData.get("key_name"),
        "exp_days": formData.get("exp_days"),
        "description": formData.get("description")
    }

    const response = await fetchGenerateAPIKey(data);
    
    
    if(!response.ok){
        console.log("invalid response");
        if(response.status == 400)
            return {error: {message: "", items: await response.json()}};
        
        return {error: {message: "Something went wrong!"}}; 
    }

    const keyData = await response.json();
    return {apiKey: keyData.key};
}