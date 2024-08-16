"use server"
import { revalidatePath } from 'next/cache'
import { createClient } from "@/utils/supabase/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.BASE_ID
const TABLE_ID = process.env.SKILLS_TABLE_ID
const VIEW_ID = process.env.SKILLS_VIEW_ID
const TEST_EMAIL = process.env.TEST_EMAIL
// const email = user.email // uncomment later for production


 export async function getSkillData() {
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
        const filterFormula = `AND({Email} = '${TEST_EMAIL}')`;
        const encodedFormula = encodeURIComponent(filterFormula);

        try {
            const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}&filterByFormula=${encodedFormula}`
            const response = await fetch(url, {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let records = await response.json()
            return records
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

export async function getMetaData() {
    try {
        const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`
        const response = await fetch(url, {
            method:'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let records = await response.json()
        const table = records.tables.find((table: any) => table.id === TABLE_ID)
    
        return table
    } catch (error) {
        console.error('Error fetching data:', error);
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