import { z } from "zod";

const envSchema = z.object({
  AIRTABLE_API_KEY: z.string().min(1, "Missing AIRTABLE_API_KEY"),
  BASE_ID: z.string().min(1, "Missing BASE_ID"),
  MEETING_TABLE_ID: z.string().min(1, "Missing MEETING_TABLE_ID"),
  MEETING_VIEW_ID: z.string().min(1, "Missing MEETING_VIEW_ID"),
  PROGRAM_OPTIONS_TABLE_ID: z.string().min(1, "Missing PROGRAM_OPTIONS_TABLE_ID"),
  EIR_BASE_ID: z.string().min(1, "Missing EIR_BASE_ID"),
  EIR_PROFILE_TABLE_ID: z.string().min(1, "Missing EIR_PROFILE_TABLE_ID"),
  EIR_PROFILE_VIEW_ID: z.string().min(1, "Missing EIR_PROFILE_VIEW_ID"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "Missing NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  // Add any other required variables here
});

export const env = envSchema.parse(process.env); 