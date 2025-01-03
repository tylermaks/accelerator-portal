"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'


export async function deleteUser (formData: FormData){ 
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if(error) { 
        return { error: "User not found"}
    }

    if (user && user?.user_metadata.user_type === "admin"){ 
        const userID = formData.get('userID') as string

        const { data, error } = await supabase
            .from("profiles")
            .delete()
            .eq('user_id', userID)
            .select()

        if (error) {
            console.error("Error deleting user:", error);
            return null; 
        }

        data && revalidatePath("/admin/members")
    }
}