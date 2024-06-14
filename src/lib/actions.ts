'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

const URL = process.env.URL_ROOT

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
  revalidatePath('/', 'layout')
  redirect('/')
}




const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID
const VIEW_ID = process.env.MEETING_VIEW_ID
const COMPANY_TABLE_ID = process.env.COMPANY_TABLE_ID
const COMPANY_VIEW_ID = process.env.COMPANY_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
 // const email = user.email // uncomment later for production

 export async function addMeeting(formData: FormData) {
  const start = performance.now(); // Start timing

  const supabase = createClient();
  const userPromise = supabase.auth.getUser();

  const meetingRecord = {
    "companyName": formData.get('companyName') as string,
    "supportType": formData.get('supportType') as string,
    "email": TEST_EMAIL as string, // add user email here
    "date": formData.get('date') as string,
    "duration": Number(formData.get('duration')) as number,
    "notes": formData.get('notes') as string
  };

  const airtablePromise = fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
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

  try {
    const [userResult, airtableResponse] = await Promise.all([userPromise, airtablePromise]);

    const { data: user, error: userError } = userResult;
    if (userError) {
      console.error('Error fetching user:', userError);
      return { error: userError };
    }

    if (user) {
      revalidatePath("/mentor/meeting-tracker");

      const end = performance.now(); // End timing
      console.log(`API took ${end - start} milliseconds`);

      return { message: "Meeting added successfully" };
    }
  } catch (error) {
    console.error('Error:', error);
    return { error: error };
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