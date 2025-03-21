export function formatDate(dateString: string){
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {year: "numeric", month: "numeric", day: "2-digit"});
}

export function formatDateWithTime(dateString: string){
    const date = new Date(dateString);
  
    const dString = formatDate(dateString);
    return `${dString}, ${date.toLocaleTimeString()}`;
}

// Difference in dates in milliseconds
function getDateDifference(dateStringStart: string, dateStringEnd: string): number{
    return new Date(dateStringEnd).getTime() - new Date(dateStringStart).getTime();
}

export function formatDuration(dateStringStart: string, dateStringEnd?: string, fullString: boolean = false){
    if(dateStringEnd === undefined)
        return "pending";
  
    const diff = getDateDifference(dateStringStart, dateStringEnd);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const secondsString = `${ Math.floor(diff / 1000) % 60 }s`;

    if(fullString)
        return `${hours}h ${minutes}m ${secondsString}`;

    if(hours > 0)
        return `${hours}h ${minutes}m`;

    if(minutes > 0)
        return `${minutes}m`
    
    return secondsString;
}

export function formatChartDuration(milliseconds: number){
    const rawSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(rawSeconds / 3600);
    const hourSeconds = rawSeconds - hours * 3600;
    const minutes = Math.floor(hourSeconds / 60);
    const seconds = hourSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function convertTimestampToDate(timestamp: string): string {
    return new Intl.DateTimeFormat('nl', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(timestamp));
}

export function formatAverageSpeed(distance: number, dateStringStart: string, dateStringEnd?: string, units: string = "km/hr"){
    if(dateStringEnd === undefined)
        return "N/A";

    const diff = getDateDifference(dateStringStart, dateStringEnd);
    const hoursDiff = diff / (1000 * 60 * 60);

    return `${(distance/hoursDiff).toFixed(2)} ${units}`;
}