"use server"
import { revalidatePath } from 'next/cache'
import { createClient } from "@/utils/supabase/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.EIR_BASE_ID
const TABLE_ID = process.env.EIR_PROFILE_TABLE_ID
const VIEW_ID = process.env.EIR_PROFILE_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
// const email = user.email // uncomment later for production

// type FieldDataProps = { 
//   title: string,
//   data: string[] | string 
// }


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


// export async function updateSkill(data: { recordID: string, fieldData: any }) {
//     const { recordID, fieldData } = data;

//     if (!recordID || !fieldData) {
//         return { error: 'Missing record ID or fields' };
//     }

//     const supabase = createClient();
//     const { data: user, error } = await supabase.auth.getUser();

//     if (error) {
//         console.error('Error fetching user:', error);
//         return { error: 'Error fetching user' };
//     }

//     if (!user) {
//         return { error: "No user found" };
//     }

//     if(user) {
//         try {
//             const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordID}`
//             const response = await fetch(url, {
//                 method:'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({  
//                     fields: fieldData
        
//                 })
//             })

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }    
           
//             return { success: 'Record updated successfully', status: 200 };
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             return { error: 'Error fetching data', status: 500 };
//         }
//     }
// }