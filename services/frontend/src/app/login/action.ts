'use server'

import { cookies } from 'next/headers';
import {redirect} from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    console.log("Submitting!!!");

    const password = formData.get('password');

    const response = await fetch(`${process.env.API_ROUTE}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    
    
    if(!response.ok){
        console.log("invalid response");
        if(response.status == 401)
            return "Invalid username or password";
        
        return "Something went wrong!";        
    }

    const jsonData = await response.json();
    const cookieStore = await cookies();
    cookieStore.set("cred-token", jsonData["token"]);

    redirect('/');
}