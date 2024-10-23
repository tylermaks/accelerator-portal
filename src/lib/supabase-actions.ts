'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'


function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)
    const { data: {user} } = await supabase.auth.getUser();

    if (error) {
      return { status: error?.status }
    }

    if (!user) {
        console.log("user not found")
        redirect('/')
    }

    if (user) {
        console.log("user found")
        console.log("USER FROM SIGNIN", user?.user_metadata.user_type)
        revalidatePath('/', 'layout')
        if ( user?.user_metadata.user_type === "mentor"){ 
          redirect('/mentor/meeting-tracker')
        }

        if( user?.user_metadata.user_type === "admin"){ 
          redirect('/admin/members')
        }
    }
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const { data: user, error } = await supabase.auth.getUser()
  const userRole = user.user?.user_metadata.user_type

  if(error) { 
    console.log("Error fetching user")
    return
  }

  if(!user) { 
    console.log("User not found")
    return
  }

  if(userRole !== 'admin'){ 
    console.log("Access denied")
    return
  }


  if(user && userRole === "admin"){ 
    const newUserData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data:{
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
          company_name: formData.get('companyName') as string,
          user_type: formData.get('userType') as string,
        }
      }
    }

    // const { error } = await supabase.auth.signUp(newUserData)

    // const uuid = generateUUID()
    // console.log(uuid)

    // const { error } = await supabase
    //   .from ("profiles")
    //   .insert({ 
    //       user_id: uuid,
    //       first_name: formData.get('firstName') as string,
    //       last_name: formData.get('lastName') as string,
    //       company_name: formData.get('companyName') as string,
    //       user_type: formData.get('userType') as string,
    //   })

    // if (error) {
    //   console.log(error)
    //   return
    // }
  
    revalidatePath('/admin/members', 'layout')
  }
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  cookies().delete('sessionToken')
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function sendPasswordReset(formData: FormData) {
  const redirectURL = process.env.UPDATE_PASSWORD_URL
  const supabase = createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(formData.get('email') as string, {
    redirectTo: redirectURL,
  })

  return {data: data, status: error?.status}
}

// export async function updatePassword(formData: FormData) {
//   const passwordConfirmed = formData.get('password') as string
//   const supabase = createClient()
//   const { data: resetData, error } = await supabase.auth.updateUser({
//     password: passwordConfirmed
//   })

//   console.log("DATA FROM UPDATE PASSWORD", resetData)
//   console.log("ERROR FROM UPDATE PASSWORD", error)

//   redirect("/")
// }

// export async function getCompanyList() {
//   const supabase = createClient();
//     const { data: user, error } = await supabase.auth.getUser();

//     if (error) {
//         console.error('Error fetching user:', error);
//         return { error: 'Error fetching user' }
//     }

//     if (!user) {
//         return { error: "No user found" }
//     }

//     if(user) {
//         let allRecords: any[] = [];
//         let offset = null;

//         try {
//             do{ 
//                 const url = `https://api.airtable.com/v0/${BASE_ID}/${COMPANY_TABLE_ID}?view=${COMPANY_VIEW_ID}&pageSize=50`
//                 const paginatedUrl : string = offset ? `${url}&offset=${offset}` : url
                
//                 const response = await fetch(paginatedUrl, {
//                     method:'GET',
//                     headers: {
//                         'Authorization': `Bearer ${API_KEY}`,
//                         'Content-Type': 'application/json'
//                     }, 
//                     cache: 'force-cache'
//                 });


//                 if(!response.ok){ 
//                     throw new Error("Network response was not ok") 
//                 }
//                 const data = await response.json()
//                 allRecords = allRecords.concat(data.records)
//                 offset = data.offset

//             } while (offset)

//             const companyNameArr = allRecords.map((company: any) => company.fields.companyName)
    
//             return { records: companyNameArr }
//         } catch (error) {
//             // Handle network errors or other unexpected errors
//             console.error("An error occurred:", error);
//             return { error: "An error occurred" }
//         }
//     }
// }