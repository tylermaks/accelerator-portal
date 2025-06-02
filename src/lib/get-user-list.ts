import { createClient } from "@/utils/supabase/server";

export const getUserList = async () => { 
    const supabase = await createClient();
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