import { createClient } from "@/utils/supabase/server";

export default async function getCompanyList(){ 
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
  
    if(user){ 
        let allRecords: any[] = [];
        let offset = null;
  
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
  
            const data = await response.json()
            allRecords = allRecords.concat(data.records)
            offset = data.offset
  
        } while (offset)
        
        return allRecords
    } else{ 
      console.error("User not found")
      return []
    }
  }
  