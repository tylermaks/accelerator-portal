"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'


export async function deleteUser (formData: FormData){ 
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if(error) { 
        return { error: "User not found"}
    }

    if (user && user?.user_metadata.user_type === "admin"){ 
        const userID = formData.get('userID') as string
        console.log("USERID FROM ADMIN ACTIONS", userID)
        const { data, error } = await supabase
            .from("profiles")
            .delete()
            .eq('user_id', userID)
            .select()

        if (error) {
            console.error("Error deleting user:", error);
            return null; 
        }

        console.log("FROM DELETE USER", data, error)
        data && revalidatePath("/admin/members")
    }
}