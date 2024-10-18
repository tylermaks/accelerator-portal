import { cache } from 'react';
import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = cache(async () => {
    try{
        const supabase = createClient();
        const { data: userResponse, error } = await supabase.auth.getUser();

        if (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }

        if (!userResponse || !userResponse.user) {
            throw new Error("User not found or user object is null");
        }

        const user = userResponse.user;

        const currentUser = { 
            userType: user.user_metadata.user_type,
            firstName: user.user_metadata.firstName,
            lastName: user.user_metadata.lastName, 
            email: user.email, 
            isSuperAdmin: user.user_metadata.is_super_admin
        };

        return currentUser
    } catch(error) {
        console.error('Error getting current user:', error);
        return null;
    }
})
