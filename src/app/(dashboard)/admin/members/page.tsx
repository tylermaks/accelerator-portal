import PageHeader from "@/components/ui/page-header"
import MembersTable from "@/components/dashboard/admin/member-table"
import CreateNewUser from "@/components/dashboard/admin/create-btn"
import { createClient } from '@/utils/supabase/server'


const getUserList = async () => { 
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.log("User not found")
        return [];
    }

    if (user?.user_metadata.user_type === "admin"){ 
        const {data: userList, error: userListError} = await supabase
        .from("profiles")
        .select("*");

        if (userListError) {
            console.log("error", userListError);
            return [];
        };

        return userList;
    };

    console.log("Access denied.");
    return []
}

export default async function Members() {
    const userData = await getUserList();

    return (
        <main>
            <PageHeader
                title="Members"
                subTitle="Add and remove EIRs and Mentors"
            />
            <CreateNewUser />
            <MembersTable
                data={userData}
            />
        </main>
    );
}