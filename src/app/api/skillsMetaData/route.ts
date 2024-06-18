import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.SKILLS_TABLE_ID
const VIEW_ID = process.env.SKILLS_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL

export async function GET(request: NextRequest) {
    try {
        const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`
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
        const table = records.tables.find((table: any) => table.id === TABLE_ID)
    
        return NextResponse.json(table)
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}