import PageHeader from "../../../../components/ui/page-header"
import MembersTable from "../../../../components/dashboard/admin/member-table"
import CreateNewUser from "../../../../components/dashboard/admin/create-btn"
import { getUserList } from "@/lib/get-user-list";

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