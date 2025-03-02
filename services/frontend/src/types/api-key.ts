export type APIKey = {
    id: number;
    name: string;
    date_expire: string|null;
    value?: string;
};


// export const generateAPIKeySchema = z.object({
//     key_name: z.string().min(2).max(100),
//     exp_days: z.number(),
//     description: z.string()
// })