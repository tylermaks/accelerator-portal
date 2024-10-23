"use client"

import ProfileSkill from "./profile-skill";
import ProfileAddSkill from "./profile-add-category";
import { useState, useEffect } from "react";

type ProfileWrapperProps = { 
    id: string
    data: any[]
    metaData: any[]
}

export default function SkillsWrapper ({ id, data, metaData, }: ProfileWrapperProps) {
    const [skills, setSkills] = useState<any>([]); // update to cateogories

    useEffect(() => {
        setSkills(data);
    }, [data])

    return(
        <div >
            <h2 className="text-2xl font-bold text-fsGray mb-4">Skills and Expertise</h2>
            <div className="flex flex-col gap-8">
            {
                skills && skills.map((item: any, index: number) => {
                    const meta = metaData.find((meta: any) => meta.name === item.name);
            
                    return(
                        <div key={index}>
                            <ProfileSkill 
                                id={id}
                                metaData={meta.options.choices} 
                                data={item.options} 
                                title={item.name} 
                                index={index} 
                                updateCategories={setSkills}
                            />
                        </div>
                    )
                })
            }
            </div>
            <ProfileAddSkill 
                metaData={metaData}
                setSkills={setSkills}
                skills={skills}
            />         
        </div>
    )
}