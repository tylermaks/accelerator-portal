"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from "@/utils/supabase/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.COMPANY_TABLE_ID
const VIEW_ID = process.env.COMPANY_VIEW_ID

const SUPPORT_TYPE_TABLE_ID = process.env.SUPPORT_TYPE_TABLE_ID


export async function getCompanyList(){ 
    const supabase = createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user', status: 500 }
    }
  
    if (!user) {
        return { error: "No user found" , status: 401 };
    }

    if(user){ 
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
                    }, 
                    cache: "force-cache"
                });


                if(!response.ok){ 
                    throw new Error("Network response was not ok") 
                }
                const data = await response.json()
                allRecords = allRecords.concat(data.records)
                offset = data.offset

            } while (offset)

            const companyNameArr = allRecords.map((company: any) => company.fields.companyName)
            return companyNameArr
        } catch (error) {
            console.error("An error occurred:", error);
            return{ error: "An error occurred" , status: 500 };
        }

    }
}


export async function getSupportTypeList() { 
    try{ 
        const url = `https://api.airtable.com/v0/${BASE_ID}/${SUPPORT_TYPE_TABLE_ID}?sort[0][field]=Name&sort[0][direction]=asc`
        
        const response = await fetch(url, {
            method:'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }, 
            cache: "force-cache"
        });

        if(!response.ok){ 
            throw new Error("Network response was not ok") 
        }
        const { records } = await response.json()
        const supportTypeArr = records.map((item: any) => item.fields['Dropdown Item Name'])

        return supportTypeArr
    } catch (error){ 
        return {error: "An error occurred", status: error}
    }
}


