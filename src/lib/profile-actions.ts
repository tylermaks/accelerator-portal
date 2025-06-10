"use server"
import { revalidatePath } from 'next/cache'
import { createClient } from "@/utils/supabase/server";
import { requireRole } from '@/utils/supabase/requireRole'
import { env } from "@/env.server";

const API_KEY = env.AIRTABLE_API_KEY
const BASE_ID = env.EIR_BASE_ID
const TABLE_ID = env.EIR_PROFILE_TABLE_ID


export async function updateProfile(recordID: string, fieldData: Record<string, string[]>) {
    const supabase = await createClient();
  
    if(!recordID || !fieldData) { 
      return { error: "Invalid record ID or field data" };
    } 
   
    try{
      const user = await requireRole(supabase, 'mentor')
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
      
      revalidatePath("/dashboard/profile");
      return { message: "Skill updated successfully" };
    } catch(error){ 
        console.error("Error:", error);
        return null
  }
}