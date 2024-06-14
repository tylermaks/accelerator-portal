import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID
const VIEW_ID = process.env.MEETING_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
 // const email = user.email // uncomment later for production

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
       
        const filterFormula = `AND({Email} = '${TEST_EMAIL}')`;
        const encodedFormula = encodeURIComponent(filterFormula);

        try {
            const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}&filterByFormula=${encodedFormula}&sort[0][field]=date&sort[0][direction]=desc&pageSize=15`
            const response = await fetch(url, {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let records = await response.json()
            return NextResponse.json(records)
        } catch (error) {
            console.error('Error fetching data:', error);
            return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
        }
    }
}


