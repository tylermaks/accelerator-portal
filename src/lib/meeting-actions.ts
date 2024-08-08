"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'


const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID
const VIEW_ID = process.env.MEETING_VIEW_ID
const COMPANY_TABLE_ID = process.env.COMPANY_TABLE_ID
const COMPANY_VIEW_ID = process.env.COMPANY_VIEW_ID
const SKILLS_TABLE_ID = process.env.SKILLS_TABLE_ID
const SKILLS_VIEW_ID = process.env.SKILLS_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
 // const email = user.email // uncomment later for production 

 interface SortCriteria {
  [key: string]: string | string[] | undefined;
}

interface FilterCriteria {
  [key: string]: string | string[] | undefined;
}

 export async function getTableData( 
    offset: string | null = null,
    sort: SortCriteria | null = null,
    filter: FilterCriteria[] | null = null,
) {
    const supabase = createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user', status: 500 }
    }
  
    if (!user) {
        return { error: "No user found" , status: 401 };
    }

    if(user) {
        try{
          let filterFormula = `AND({email} = '${TEST_EMAIL}'` //change this in production
          // filter?.forEach(item => {
          //   filterFormula += `, FIND('${item.value}', {${item.field}}) > 0`
          // })
          filterFormula += ")"
    
          const encodedFilter = encodeURIComponent(filterFormula)
    
          let sortQuery = "sort[0][field]=date&sort[0][direction]=desc&";

          // sort?.forEach((sortParam, index) => {
          //     const field = sortParam.field
          //     const direction = sortParam.value
    
          //     let sortField = encodeURIComponent(`sort[${index + 1 }][field]`) + `=${field}`
          //     let sortDirection = encodeURIComponent(`sort[${index + 1}][direction]`) + `=${direction}`
    
          //     sortQuery += `${sortField}&${sortDirection}&`
          // });
            
            const urlBase = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${encodedFilter}&pageSize=25&${sortQuery}view=${VIEW_ID}`
            const urlOffset = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`

            const paginatedUrl = offset ? urlOffset : urlBase

            const response = await fetch(paginatedUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let records = await response.json()
            return records
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
}


export async function addMeeting(formData: FormData) {
  const supabase = createClient();
  const user =  await supabase.auth.getUser();

  const meetingRecord = {
    "companyName": formData.get('companyName') as string,
    "supportType": formData.get('supportType') as string,
    "email": TEST_EMAIL as string, // add user email here
    "date": formData.get('date') as string,
    "duration": Number(formData.get('duration')) as number,
    "notes": formData.get('notes') as string
  };

  if(user){
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'records': [
            {
              'fields': meetingRecord
            }
          ]
        })
      });

      if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      revalidatePath("/mentor/meeting-tracker");
      return { message: "Meeting added successfully" };
    } catch (error) {
      console.error('Error:', error);
      return { error: error };
    }
  }
}


export async function deleteMeeting(recordID: string) {
    const supabase = createClient();
    const user =  await supabase.auth.getUser();

    if(user){
      try {
        const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          }
        }); 
  
        if(!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        revalidatePath("/mentor/meeting-tracker");
        return { message: "Meeting deleted successfully" };
      } catch (error) {
        console.error('Error:', error);
        return { error: error };
      }
    }
}

export async function updateMeeting(recordID: string, fieldData: any) {
  const supabase = createClient();
  const user =  await supabase.auth.getUser();

  const stateKey = Object.getOwnPropertySymbols(fieldData)[0];
  const fieldObj = fieldData[stateKey];
  const airtableData = {
    "companyName": fieldObj[1].value,
    "supportType": fieldObj[0].value,
    "date": new Date(fieldObj[2].value),
    "duration": Number(fieldObj[3].value),
    "notes": fieldObj[4].value,
  }

  if(user){
    try {
      const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          fields: airtableData
        })
      });

      if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 

      revalidatePath("/mentor/meeting-tracker");
      return { message: "Meeting updated successfully" };
    } catch (error) {
      console.error('Error:', error);
      return { error: error };
    }
  }
}