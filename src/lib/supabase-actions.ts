'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import * as z from "zod";

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
        revalidatePath('/', 'layout')
        if( user?.user_metadata.user_type === "admin"){ 
          redirect('/admin/members')
        } else {
          redirect('/dashboard')
        }
    }
}

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.string().min(1, 'User type is required'),
  companyName: z.string().optional(),
})


export async function createUser(formData: FormData) {
  const supabase = createClient()
  try {
    // Validate form data using Zod schema
    const parsedData = createUserSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userType: formData.get("userType"),
      companyName: formData.get("companyName"),
    });

    // Fetch current user and check role
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error fetching user or user not found");
      return { error: "Error fetching user", status: 500 };
    }

    const userRole = user.user?.user_metadata.user_type;
    if (userRole !== "admin") {
      console.log("Access denied");
      return { error: "Access denied", status: 403 };
    }

    // If user is admin, proceed with creating a new user
    const { email, password, firstName, lastName, userType, companyName } = parsedData;

    const { data, error: createUserError } = await supabase.rpc("create_user", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      user_type: userType.toLowerCase(),
      company_name: companyName,
    });

    if (createUserError) {
      console.error("ERROR:", createUserError);
      return { error: "An error has occurred while creating the user", status: 500 };
    }

    // If successful, trigger revalidation
    revalidatePath("/admin/members");

    return { message: "User created successfully", status: 200 };

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      console.error("Validation error:", error.errors);
      return { error: error.errors.map(e => e.message).join(", "), status: 400 };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred", status: 500 };
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


