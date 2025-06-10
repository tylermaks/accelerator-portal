"use server"

import { createClient } from '@/utils/supabase/server'
import { requireRole } from '@/utils/supabase/requireRole'
import { revalidatePath } from 'next/cache'
import * as z from "zod";

const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    userType: z.string().min(1, 'User type is required'),
    companyName: z.string().optional(),
})
  
export async function createUser(
    formData : { 
      email: string, 
      password: string, 
      firstName: string, 
      lastName: string, 
      userType:string, 
      companyName: string
    }) {
    const supabase = await createClient()
    await requireRole(supabase, 'admin')

    try {
      // Validate form data using Zod schema
      const parsedData = createUserSchema.parse(formData);  
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


export async function deleteUser (formData: FormData){ 
    const supabase = await createClient();
    await requireRole(supabase, 'admin')
    const userID = formData.get('userID') as string;
    const { data, error } = await supabase.rpc('delete_user', { target_user_id: userID });

    if (error) {
        console.error("Error deleting user:", error);
        console.log("Error: ", error);
    }

    if (data) {
        revalidatePath("/admin/members");
        console.log("Success: ", data);
    }
}