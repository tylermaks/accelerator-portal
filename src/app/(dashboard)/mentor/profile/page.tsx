import { headers } from "next/headers";
import Image from "next/image";

import ProfileText from "@/components/dashboard/mentor/profile/profile-text";
import ProfileName from "@/components/dashboard/mentor/profile/profile-name";
import SkillsWrapper from "@/components/dashboard/mentor/profile/skills-wrapper";
import { revalidatePath } from "next/cache";

const url = `${process.env.URL_ROOT}/api/skillsData`;

const getSkillData = async () => {
    try {
        const response = await fetch(url, {
            headers: {
                cookie: headers().get("cookie") as string,
            }
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
        const response = await fetch(metaDataUrl);
        
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




export default async function Profile() {
    const skillsData = await getSkillData();
    const metaData = await getMetaData();
    const { fields } = skillsData.records[0];
    const { id } = skillsData.records[0];

    const skillsArray: { name: string, options: any }[] = [];
    
    for (const [key, value] of Object.entries(fields)) {
        if (key === "Photo") continue;
    
        if (Array.isArray(value)) {
            skillsArray.push({ name: key, options: value });
        }
    }

    const sortedSkills = skillsArray.sort((a: any, b: any) => a.name.localeCompare(b.name));

 
    return(
       <div className="flex flex-col gap-8 px-24 pb-10 relative bg-white">
            <div className="absolute top-0 left-0 right-0 h-48">
                <Image 
                    className="absolute top-0 left-0 right-0 z-0 rounded-md"
                    src="/images/solar-panels.jpg"
                    alt="banner"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>

            <ProfileName data={fields}/>
            <ProfileText id={id} data={fields.Bio} /> 
            <SkillsWrapper id={id} data={sortedSkills} metaData={metaData.fields}/>
       </div>
    )
}