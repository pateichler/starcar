'use server'

import { fetchSetSitePassword } from '@/lib/api';
import { ErrorMessage } from '@/types/error-message';
import {redirect} from 'next/navigation';
import { cookies } from 'next/headers';

export async function setSitePassword(prevState: ErrorMessage | undefined, formData: FormData): Promise<ErrorMessage> {

    const data = {
        "password": formData.get("password")
    }

    const response = await fetchSetSitePassword(data);
    
    
    if(!response.ok){
        if(response.status == 400)
            return {message: "", items: await response.json()};
        
        return {message: "Something went wrong!"}; 
    }

    const jsonData = await response.json();
    const cookieStore = await cookies();
    cookieStore.set("cred-token", jsonData["token"]);

    redirect('/settings');
}