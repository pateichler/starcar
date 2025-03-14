'use client'

import { useActionState, useState } from "react";
import { deleteMission, renameMission } from "./missionControlBarAction";
import { Mission } from "@/types/mission";
import { formatDateWithTime } from "@/lib/utils";
import styles from "./page.module.css";

export default function MissionControlBar({mission}: {mission: Mission}){
    const [nameResult, renameAction, isRenamePending] = useActionState(
        renameMission.bind(null, mission.id),
        {name: mission.name ?? "Unamed mission"}
    )

    const [isRenaming, setIsRenaming] = useState(false);

    function onDeleteButton(){
        if(window.confirm("Are you sure you want to delete?")){
            deleteMission(mission.id);
        }
            
    }

    return (
        <div>
            <div>
                <button style={{float: "right", marginRight:"20px"}} onClick={onDeleteButton}>Delete</button>

                {!isRenaming && !isRenamePending ? (
                <div>
                    <h1 className={styles.title}>{nameResult.name}</h1>
                    <svg onClick={() => setIsRenaming(true)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                </div>
                ):(
                <div>
                    <form action={renameAction} onSubmit={() => setIsRenaming(false)}>
                        <input name="name" type="text" defaultValue={nameResult.name} disabled={isRenamePending}></input>
                        <label>
                            <input type="submit" style={{display: "none"}} />
                            { !isRenamePending ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                            </svg>
                            ) : (<></>)}
                        </label>
                    </form>
                </div>
                )}
            </div>
            <p>{formatDateWithTime(mission.date_start)}</p>
        </div>
    );
}