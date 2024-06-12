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

        try {
            const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}`
            const response = await fetch(url, {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return NextResponse.json(data);
        } catch (error) {
            // Handle network errors or other unexpected errors
            console.error("An error occurred:", error);
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }
    }
}