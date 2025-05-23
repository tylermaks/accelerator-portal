'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { setCookie, deleteCookie } from '@/utils/cookies';

export async function login(formData: FormData) {
    const cookieStore = cookies()
    const supabase =  await createClient()

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
      const userType = user.user_metadata.user_type
        
      // Set cookie with user type using centralized utility
      await setCookie('user_type', userType, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
      })

      revalidatePath('/', 'layout')
      
      if (userType === "admin") {
          redirect('/admin/members')
      } else {
          redirect('/dashboard')
      }
    }
}

export async function sendPasswordReset(email: string) {
  const redirectURL = process.env.UPDATE_PASSWORD_URL
  const supabase = await createClient()
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectURL,
  })

  return {data: data, status: error?.status}
}


export async function verifyPasscode(email: string, token: string) { 
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery'})

  if (error) { 
    console.error(error)
    return { message: "An error occured verify your passcode", status: 500}
  }

    // Check if OTP was successfully verified and redirect if valid
  if (data.user) {
    return { message: "Passcode verified", status: 200, redirectUrl: `/reset-password?email=${email}` };
  }

  // If no user data (e.g., invalid OTP)
  return { message: "Invalid or expired passcode", status: 400 };
}

