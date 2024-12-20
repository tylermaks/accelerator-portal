"use server"

import { createClient } from '@/utils/supabase/server'

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID
const VIEW_ID = process.env.MEETING_VIEW_ID

type ReportDataProps = {
    month: number;
    year: number;
    offset?: string | null;
}

export async function getReportData({month, year, offset= null} : ReportDataProps) {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user', status: 500 }
    }

    if (!user) {
        return { error: "No user found" , status: 401 };
    }

    if (user) {
        const userEmail = user.user.email
        const startDate = new Date(year, month -1, 1);
        const endDate = new Date(year, month, 0); // get the last day of the month
        const filterFormula = `AND({email} = '${userEmail}', {date} >= '${startDate.toISOString()}', {date} <= '${endDate.toISOString()}')`;
        const sortQuery = "sort[0][field]=date&sort[0][direction]=asc";
        const fields = ["companyName", "altName", "supportType", "date", "meetingObjective", "duration"]
        const fieldQuery = fields.map(field => `fields=${field}`).join("&")
        const urlBase = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${filterFormula}&${sortQuery}&${fieldQuery}&view=${VIEW_ID}`
        const urlOffset = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
        const paginatedUrl = offset ? urlOffset : urlBase

        try{ 
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
            return { error: 'Error fetching data', status: 500 }
        }
    }
}