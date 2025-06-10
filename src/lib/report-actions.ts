"use server"

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/utils/supabase/requireRole';
import { env } from "@/env.server";

const API_KEY = env.AIRTABLE_API_KEY
const BASE_ID = env.BASE_ID
const TABLE_ID = env.MEETING_TABLE_ID
const VIEW_ID = env.MEETING_VIEW_ID

interface ReportDataProps {
    month: number;
    year: number;
    offset?: string | null;
}

export async function getReportData({month, year, offset= null} : ReportDataProps) {
    // Input validation
    if (
      typeof month !== "number" ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(month)
    ) {
      return { error: "Invalid month. Must be an integer between 1 and 12.", status: 400 };
    }

    if (
      typeof year !== "number" ||
      year < 2000 || // adjust lower bound as needed
      year > 2100 || // adjust upper bound as needed
      !Number.isInteger(year)
    ) {
      return { error: "Invalid year. Must be a reasonable integer.", status: 400 };
    }

    if (offset !== null && typeof offset !== "string") {
      return { error: "Invalid offset. Must be a string or null.", status: 400 };
    }

    const supabase = await createClient();

    try{ 
        const user = await requireRole(supabase, 'mentor')
        const userEmail = user.email
        const startDate = new Date(year, month -1, 1);
        const endDate = new Date(year, month, 0); 
        const filterFormula = `AND({email} = '${userEmail}', {date} >= '${startDate.toISOString()}', {date} <= '${endDate.toISOString()}')`;
        const sortQuery = "sort[0][field]=date&sort[0][direction]=asc";
        const fields = ["companyName", "altName", "supportType", "date", "meetingObjective", "duration"]
        const fieldQuery = fields.map(field => `fields=${field}`).join("&")
        const urlBase = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${filterFormula}&${sortQuery}&${fieldQuery}&view=${VIEW_ID}`
        const urlOffset = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
        const paginatedUrl = offset ? urlOffset : urlBase
        const response = await fetch(paginatedUrl, {
            method:'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let records = await response.json()
        return records
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: error, status: 500 }
    }
}