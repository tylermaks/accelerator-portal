'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { recordTraceEvents } from 'next/dist/trace'


export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  cookies().delete('sessionToken')
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUserRole() {
  const cookiesObject = cookies();
  const userRole = cookiesObject.get('sessionToken')?.value;
  console.log("userRole FROM SERVER", userRole)
  return userRole
}



//AIRTABLE SERVER ACTIONS 
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
  field: string | null
  criteria: 'asc' | 'desc' | null
}

interface FilterCriteria {
  field: string | null
  criteria: string | number | boolean | null
}

export async function getTableData (
  offset: number | null = null, 
  sort: SortCriteria[] | null = null,
  filter: FilterCriteria[] | null = null,
  cache: boolean = false,
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

      let filterFormula = `AND({email} = '${TEST_EMAIL}'` //change this in production
      filter?.forEach(item => {
        filterFormula += `, FIND('${item.criteria}', {${item.field}}) > 0`
      })
      filterFormula += ")"

      const encodedFilter = encodeURIComponent(filterFormula)

      let sortQuery = '&sort[0][field]=date&sort[0][direction]=desc';
      sort?.forEach((sortParam, index) => {
          let offsetIndex = index
          let sortField = `sort[${offsetIndex}][field]=${encodeURIComponent(sortParam.field)}`
          let sortDirection = `sort[${offsetIndex}][direction]=${encodeURIComponent(sortParam.criteria)}`
          sortQuery += `&${sortField}&${sortDirection}`
      });

      try {
        const urlBase = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}&filterByFormula=${encodedFilter}${sortQuery}&pageSize=25`
        const paginatedUrl = offset ? `${urlBase}&offset=${offset}` : urlBase
        
        const response = await fetch(paginatedUrl, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            cache: cache ? "force-cache" : "no-store"
        })

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let records = await response.json()

        return records
      } catch (error) {
          console.error('Error fetching data:', error);
          return { error: 'Error fetching data', status: 500 };
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

export async function getCompanyList() {
  const supabase = createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user' }
    }

    if (!user) {
        return { error: "No user found" }
    }

    if(user) {
        let allRecords: any[] = [];
        let offset = null;

        try {
            do{ 
                const url = `https://api.airtable.com/v0/${BASE_ID}/${COMPANY_TABLE_ID}?view=${COMPANY_VIEW_ID}&pageSize=50`
                const paginatedUrl : string = offset ? `${url}&offset=${offset}` : url
                
                const response = await fetch(paginatedUrl, {
                    method:'GET',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    }, 
                    cache: 'force-cache'
                });


                if(!response.ok){ 
                    throw new Error("Network response was not ok") 
                }
                const data = await response.json()
                allRecords = allRecords.concat(data.records)
                offset = data.offset

            } while (offset)

            const companyNameArr = allRecords.map((company: any) => company.fields.companyName)
    
            return { records: companyNameArr }
        } catch (error) {
            // Handle network errors or other unexpected errors
            console.error("An error occurred:", error);
            return { error: "An error occurred" }
        }
    }
}

export async function updateProfile(recordID: string, fieldData: any) {
  const supabase = createClient();
  const user =  await supabase.auth.getUser();
  
  if(!recordID || !fieldData) return

  if(user){
    try{
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
      
      revalidatePath("/mentor/profile");
      return { message: "Skill updated successfully" };
    } catch(error){ 
        console.error("Error:", error);
        return null
    }
  }
}