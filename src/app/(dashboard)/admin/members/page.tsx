import PageHeader from "../../../../components/ui/page-header"
import MembersTable from "../../../../components/dashboard/admin/member-table"
import CreateNewUser from "../../../../components/dashboard/admin/create-btn"
import { createClient } from "../../../../utils/supabase/server"

const getUserList = async () => { 
    const supabase = await createClient();
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

        const sortedUserList = userList.sort((a, b) => a.first_name.localeCompare(b.first_name))
        return sortedUserList;
    };

    console.log("Access denied.");
    return []
}

export default async function Members() {
    const userData = await getUserList();

    return (
        <main className="py-10 px-8">
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