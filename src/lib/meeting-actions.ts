"use server"

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/utils/supabase/requireRole'
import * as z from "zod"
import getTableData from '@/components/dashboard/mentor/meeting-tracker/table-data'
import { env } from "@/env.server"


const API_KEY = env.AIRTABLE_API_KEY
const BASE_ID = env.BASE_ID
const TABLE_ID = env.MEETING_TABLE_ID

const schema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  altName: z.string().optional(),
  supportType: z.string().min(1, { message: "Support type is required" }),
  meetingObjective: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  duration: z.preprocess((val) => Number(val), z.number().positive()),
  notes: z.string().optional(),
});

type MeetingFormData = z.infer<typeof schema>;

export async function infiniteScrollData(offset: string | undefined) { 
  const newTableData = getTableData(offset)
  return newTableData
}

export async function addMeeting(formData: MeetingFormData) {
  const supabase = await createClient();

  try {
    const user = await requireRole(supabase, 'mentor')
    const validatedData = schema.parse(formData);
    const meetingRecord = {
        ...validatedData,
        email: user.email,
    };

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
    return { message: "Meeting added successfully"};

  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}


export async function deleteMeeting(recordID: string) {
    const supabase = await createClient();

    try {
      const user =  await requireRole(supabase, 'mentor')
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
      return { error: error instanceof Error ? error.message : String(error) };
    }
}



export async function updateMeeting( recordID: string, fieldData: MeetingFormData) {
  const supabase = await createClient();

  try {
    const user = await requireRole(supabase, 'mentor');
    const validatedData = schema.parse(fieldData);
    const meetingRecord = {
      ...validatedData,
    };
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        fields: meetingRecord
      })
    });

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } 

    revalidatePath("/dashboard/meeting-tracker");
    return { message: "Meeting updated successfully" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}