import PageHeader from "@/components/ui/page-header";
import ProfileForm from "@/components/dashboard/mentor/profile-form";
import { headers } from "next/headers";

const url = `${process.env.URL_ROOT}/api/skillsData`;

const getSkillData = async () => {
    try {
        const response = await fetch(url, {
            headers: {
                cookie: headers().get("cookie") as string,
            },
        });
        
        if (!response.ok) {
            // Handle response errors
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("An error occurred:", error);
        return null;
    }
};

const metaDataUrl = `${process.env.URL_ROOT}/api/skillsMetaData`;
const getMetaData = async () => {
    try {
        const response = await fetch(metaDataUrl, {
            cache: "no-store",
        });
        
        if (!response.ok) {
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();

        return data;
    } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("An error occurred:", error);
        return null;
    }
};

export default function Profile() {
    // const skills = getSkillData();

    const metaData = getMetaData();

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