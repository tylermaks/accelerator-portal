import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.SKILLS_TABLE_ID
const VIEW_ID = process.env.SKILLS_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
// const email = user.email // uncomment later for production

export async function PATCH(request: Request) {
    const requestData = await request.json();
    const { recordID, fieldData } = requestData;

    if (!recordID || !fieldData) {
        return NextResponse.json({ error: 'Missing record ID or fields' }, { status: 400 });
    }

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
        try {
            const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordID}`
            const response = await fetch(url, {
                method:'PATCH',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  
                    fields: fieldData
        
                })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }    

           
            return NextResponse.json({ success: 'Record updated successfully' }, { status: 200 });
        } catch (error) {
            console.error('Error fetching data:', error);
            return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
        }
    }
}