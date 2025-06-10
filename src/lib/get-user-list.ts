import { createClient } from "@/utils/supabase/server";
import { requireRole } from "@/utils/supabase/requireRole";

export const getUserList = async () => { 
    const supabase = await createClient();
    await requireRole(supabase, 'admin')
    const { data: userList, error: userListError } = await supabase
        .from("profiles")
        .select("*");

    if (userListError) {
        console.log("error", userListError);
        return [];
    }

    if (userList) {
        const sortedUserList = userList.sort((a, b) => a.first_name.localeCompare(b.first_name))
        return sortedUserList;
    }

    return [];
}