import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }

    if (!user) {
        return NextResponse.json({ error: "No user found" }, { status: 401 });
    }

    if(user) {
        const API_KEY = process.env.AIRTABLE_API_KEY
        const BASE_ID = process.env.BASE_ID
        const TABLE_ID = process.env.COMPANY_TABLE_ID
        const VIEW_ID = process.env.COMPANY_VIEW_ID

        let allRecords: any[] = [];
        let offset = null;

        try {
            do{ 
                const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}&pageSize=50`
                const paginatedUrl : string = offset ? `${url}&offset=${offset}` : url
                
                const response = await fetch(paginatedUrl, {
                    method:'GET',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });


                if(!response.ok){ 
                    throw new Error("Network response was not ok") 
                }
                const data = await response.json()
                allRecords = allRecords.concat(data.records)
                offset = data.offset

            } while (offset)

            const companyNameArr = allRecords.map((company: any) => company.fields.companyName)
            return NextResponse.json({ records: companyNameArr }, { status: 200 });
        } catch (error) {
            // Handle network errors or other unexpected errors
            console.error("An error occurred:", error);
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }
    }
}