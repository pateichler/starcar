'use server'

import { fetchDeleteMission, fetchRenameMission } from '@/lib/api';
import { ErrorMessage } from '@/types/error-message';
import {redirect} from 'next/navigation';


type RenameResult = {
    name: string
    error?: ErrorMessage
}


export async function renameMission(missionID: number, prevState: RenameResult | undefined, formData: FormData): Promise<RenameResult> {
    const name = formData.get("name")! as string;

    const response = await fetchRenameMission(missionID, name);
    
    
    if(!response.ok){
        if(response.status == 400)
            return {name: name, error: {message: "", items: await response.json()}};
        
        return {name: name, error: {message: "Something went wrong!"}}; 
    }

    return {name: name};
}

export async function deleteMission(missionID: number): Promise<ErrorMessage> {
    const response = await fetchDeleteMission(missionID);

    if(!response.ok)
        return {message: "Something went wrong!"};

    redirect('/');
}