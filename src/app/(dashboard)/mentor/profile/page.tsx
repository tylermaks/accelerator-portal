import Image from "next/image";
import ProfileText from "@/components/dashboard/mentor/profile/profile-text";
import ProfileName from "@/components/dashboard/mentor/profile/profile-name";
import SkillsWrapper from "@/components/dashboard/mentor/profile/skills-wrapper";
import { createClient } from "@/utils/supabase/server";

const API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.EIR_BASE_ID
const TABLE_ID = process.env.EIR_PROFILE_TABLE_ID
const VIEW_ID = process.env.EIR_PROFILE_VIEW_ID


async function getSkillData() {
    const supabase = createClient();
    const { data: user, error } = await supabase.auth.getUser();


    if (error) {
        console.error('Error fetching user:', error);
        return { error: 'Error fetching user', status: 500 }
    }
  
    if (!user) {
        return { error: "No user found" , status: 401 };
    }
    
    if(user) {
        const userEmail = user.user.email
        const filterFormula = `AND({Email_Text} = '${userEmail}')`;
        const encodedFilter = encodeURIComponent(filterFormula);
        
        try {
            const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}&filterByFormula=${encodedFilter}`
            const response = await fetch(url, {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                }, 
                cache: 'force-cache',
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let  { records } = await response.json()
            return records
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}


async function getMetaData() {
    try {
        const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`
        const response = await fetch(url, {
            method:'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            }, 
            cache: 'force-cache',
        })

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let records = await response.json()
        const table = records.tables.find((table: any) => table.id === TABLE_ID)

        return table
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


export default async function Profile() {
    const skillsData = await getSkillData();
    const metaData = await getMetaData();
    const fields = skillsData?.length ? skillsData[0].fields : []
    const id = skillsData?.length ? skillsData[0].id : []
    const skillsArray: { name: string, options: any }[] = [];
    
    const includedArrayKeys=[ 
        "Primary Skill Set", 
        "Industry Sector", 
        "WaterTech expertise", 
        "AgTech expertise", 
        "Built Environment expertise", 
        "CCUS expertise", 
        "Forestry expertise", 
        "Mining expertise", 
        "Oil & Gas expertise",
        "Renewable Energy expertise",
        "Power expertise",
        "Bio-circular Economy",
        "CEO skills",
        "CFO skills",
        "CTO skills",
        "COO skills",
        "Leadership skills",
        "Engineering skills",
        "Funding skills",
        "Human Resources skills",
        "IT & Programming skills",
        "Legal skills",
        "Marketing skills",
        "Sales skills"
    ]
    
    for (const [key, value] of Object.entries(fields)) {    
        if (includedArrayKeys.includes(key)) {
            skillsArray.push({ name: key, options: value });
        }
    }

    // const sortedSkills = skillsArray.sort((a: any, b: any) => a.name.localeCompare(b.name));
 
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

            { skillsData.length > 0  ? (
                <>
                    <ProfileName data={fields}/>
                    <ProfileText id={id} data={fields.Bio} /> 
                    <SkillsWrapper id={id} data={skillsArray} metaData={metaData.fields}/>
                </>
            ) : (
                <h2 className="mt-72">It appears you need to fill out your EIR Entry Form</h2>
            )}
       </div>
    )
}