export const CRED_COOKIE_NAME = process.env.CRED_COOKIE_NAME || "cred-token";

export const EXP_DAYS_OPTIONS = process.env.EXP_DAYS_OPTIONS?.split(", ").map(Number) || [7,30,90];
export const EXP_DAYS_DEFAULT_OPTION = parseInt(process.env.EXP_DAYS_DEFAULT_OPTION!) || 1;