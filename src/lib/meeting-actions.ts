"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import getTableData from '@/components/dashboard/mentor/meeting-tracker/table-data'


const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.MEETING_TABLE_ID


export async function infiniteScrollData(offset: string | undefined) { 
  const newTableData = getTableData(offset)
  return newTableData
}

export async function addMeeting(formData: FormData) {
  const supabase = createClient();
  const { data: user, error} =  await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return { error: 'Error fetching user', status: 500 }
  }

  if (!user) {
      return { error: "No user found" , status: 401 };
  }


  if(user){
    const userEmail = user.user.email

    const meetingRecord = {
      "companyName": formData.get('companyName') ? formData.get('companyName') as string : "Foresight",
      "altName": formData.get('altName') as string,
      "supportType": formData.get('supportType') as string,
      "email": userEmail as string, // add user email here
      "date": formData.get('date') as string,
      "duration": Number(formData.get('duration')) as number,
      "notes": formData.get('notes') as string
    };

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