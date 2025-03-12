export type Mission = {
    id: number;
    name?: string;
    date_start: string;
    date_end?: string;
    total_dist: number;
    analysis?: AnalysisDescription[]
};

export type AnalysisDescription = {
    name: string
    health_status: number,
    is_pending: boolean
}