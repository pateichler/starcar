export function formatDate(dateString: string){
    const date = new Date(dateString);
  
    return date.toLocaleDateString('en-US', {year: "numeric", month: "numeric", day: "2-digit"});
}
  
export function formatDuration(dateStringStart: string, dateStringEnd?: string){
    if(dateStringEnd === undefined)
        return "pending"
  
    const dateStart = new Date(dateStringStart).getTime();
    const dateEnd = new Date(dateStringEnd).getTime();
  
    const diff = dateEnd - dateStart;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if(hours > 0)
        return `${hours}h ${minutes}m`;
    if(minutes > 0)
        return `${minutes}m`
    
    return `${Math.floor(diff / 1000)}s`
}

export function convertTimestampToDate(timestamp: string): string {
    return new Intl.DateTimeFormat('nl', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(timestamp));
}