"use server"
import { revalidatePath } from 'next/cache'
import { createClient } from "@/utils/supabase/server";
import { env } from "@/env";

const API_KEY = env.AIRTABLE_API_KEY
const BASE_ID = env.EIR_BASE_ID
const TABLE_ID = env.EIR_PROFILE_TABLE_ID


export async function updateProfile(recordID: string, fieldData: any) {
    const supabase = await createClient();
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
        
        revalidatePath("/dashboard/profile");
        return { message: "Skill updated successfully" };
      } catch(error){ 
          console.error("Error:", error);
          return null
      }
    }
  }