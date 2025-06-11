import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/utils/supabase/requireRole";

interface CompanyRecord { 
    id: string;
    fields: { 
        companyName: string
    }
}

export default async function getCompanyList(): Promise<CompanyRecord[]>{ 
    const supabase = await createClient()
    await requireRole(supabase, 'mentor')

    let allRecords: CompanyRecord[] = [];
    let offset = null;

    try{
        do{ 
            const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/${process.env.COMPANY_TABLE_ID}?view=${process.env.COMPANY_VIEW_ID}&pageSize=50&fields%5B%5D=companyName`
            const paginatedUrl : string = offset ? `${url}&offset=${offset}` : url
            const response = await fetch(paginatedUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }, 
                cache: "force-cache"
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()
            allRecords = allRecords.concat(data.records)
            offset = data.offset
        } while (offset)
    } catch(error) { 
        console.error("Error fetching company list", error)
        return []
    }

    return allRecords    
}
  