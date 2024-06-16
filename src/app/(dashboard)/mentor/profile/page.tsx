import PageHeader from "@/components/ui/page-header";
import ProfileForm from "@/components/dashboard/mentor/profile-form";

export default function Profile() {
    return(
        <div>
            <PageHeader 
                title="Profile"
                subTitle="View and update your Executive in Residence details"
            />
            <ProfileForm />
        </div>
    )
}