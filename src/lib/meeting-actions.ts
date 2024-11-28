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

export async function addMeeting(
  formData: {
    companyName: string, 
    altName: string, 
    supportType: string, 
    meetingObjective: string, 
    date: string,
    duration: string,
    notes: string
}) {
  const supabase = createClient();
  const { data: user, error} =  await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return { error: 'Error fetching user', status: 500 }
  }

  if (!user) {
      return { error: "No user found" , status: 401 };
  }

  console.log("TEST", formData)


  if(user){
    const userEmail = user.user.email

    const meetingRecord = {
      "companyName": formData.companyName ? formData.companyName : "Foresight",
      "altName": formData.altName,
      "supportType": formData.supportType,
      "meetingObjective": formData.meetingObjective,
      "email": userEmail as string, // add user email here
      "date": formData.date,
      "duration": Number(formData.duration) as number,
      "notes": formData.notes
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

      revalidatePath("/dashboard/meeting-tracker");
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
  
        revalidatePath("/dashboard/meeting-tracker");
        return { message: "Meeting deleted successfully" };
      } catch (error) {
        console.error('Error:', error);
        return { error: error };
      }
    }
}



export async function updateMeeting(
  recordID: string, 
  fieldData: {
    companyName: string, 
    supportType: string, 
    meetingObjective: string, 
    date: string, 
    duration: string, 
    notes: string
}) {
  const supabase = createClient();
  const { data: user, error } =  await supabase.auth.getUser();
  
  if (error) {
    console.log("Error fetching user:", error)
    return
  }


  const airtableData = {
    "companyName": fieldData.companyName,
    "supportType": fieldData.supportType,
    "meetingObjective": fieldData.meetingObjective,
    "date": new Date(fieldData.date),
    "duration": Number(fieldData.duration),
    "notes": fieldData.notes,
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

      revalidatePath("/dashboard/meeting-tracker");
      return { message: "Meeting updated successfully" };
    } catch (error) {
      console.error('Error:', error);
      return { error: error };
    }
  }
}