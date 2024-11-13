'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)
    const { data: {user} } = await supabase.auth.getUser();

    if (error) {
      console.error(error)
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

export async function createUser(formData: FormData) {
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
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const first_name = formData.get('firstName') as string
    const last_name = formData.get('lastName') as string
    const user_type_titlecase = formData.get('userType') as string

    const company_name = formData.get('companyName') as string
    const user_type = user_type_titlecase.toLowerCase() as string



    let { data, error } = await supabase
      .rpc('create_user', {
        email, 
        password, 
        first_name, 
        last_name, 
        user_type,
        company_name,
      })

    if(error) { 
      console.log("ERROR", error)
      console.error("An error has occurred, please try again")
      return 
    }

    revalidatePath('/admin/members')
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


