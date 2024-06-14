'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

const URL = process.env.URL

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
const TEST_EMAIL = process.env.TEST_EMAIL
 // const email = user.email // uncomment later for production

export async function addMeeting(formData: FormData) {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
      console.error('Error fetching user:', error);
      return
  }

  if(user) {
      const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`

      const meetingRecord = { 
        "companyName": formData.get('companyName') as string,
        "supportType": formData.get('supportType') as string,
        "email": TEST_EMAIL as string, //add user email here
        "date": formData.get('date') as string,
        "duration": Number(formData.get('duration')) as number,
        "notes": formData.get('notes') as string
      }

      try {
        const response = await fetch(url, {
            method:'POST',
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
        })
        
        revalidatePath("/mentor/meeting-tracker")
          
        return { message: "Meeting added successfully" };
      } catch (error) {
        console.error('Error fetching data:', error);
       return { error: error }; 
      }
  }
}

export async function getCompanyList() {
  try {
      const response = await fetch(`${URL}/api/getCompanyList`, { 
          headers: {
              cookie: headers().get("cookie") as string,
          },
          cache: 'force-cache'
      });
      
      if (!response.ok) {
          // Handle response errors
          console.error("Fetch error:", response.statusText);
          return null;
      }
      
      const data = await response.json();
      return data;
  } catch (error) {
      // Handle network errors or other unexpected errors
      console.error("An error occurred:", error);
      return null;
  }
}