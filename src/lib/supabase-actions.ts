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

    const { error } = await supabase.auth.signUp(newUserData)

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