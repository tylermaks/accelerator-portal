"use client"

import { useState, useEffect } from "react"
import Edit from "@/components/ui/edit"

type ProfileSkillsProps = {
    id: string
    data: string[]
    metaData: string[]
    title: string
    index: number
}

const updateProfileSkills = async (id: string, fields: any) => {
    const response = await fetch("/api/updateSkill", {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
        }, 
        credentials: "include",
        body: JSON.stringify({
            recordID: id,
            fieldData: fields
        })
    });

    if (!response.ok) {
        console.error("Fetch error:", response.statusText);
        return null;
    }

    return await response.json();
}

export default function ProfileSkill({ id, data, metaData, title, index }: ProfileSkillsProps) {
    const [skills, setSkills] = useState<string[]>([]);
    const [metaSkills, setMetaSkills] = useState<string[]>([]);
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);

    const toggleEdit = () => {
        setEditing(!editing);
    };

    const handleSave = async () => {
        setEditing(false);
        setHover(false);

        let skillsArr = skills.map((item) => item);
        await updateProfileSkills(id,  { [title]: skillsArr });
    };

    const handleAddSkill = (event: React.MouseEvent<HTMLButtonElement>) => {
        const value = (event.target as HTMLInputElement).id;
        setSkills((prevSkills) => [...prevSkills, value]);
        setMetaSkills((prevMetaSkills) => prevMetaSkills.filter((item) => item !== value));
    };

    const handleRemoveSkill = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!editing) return;
        const value = (event.target as HTMLInputElement).id;
        setMetaSkills((prevMetaSkills) => [...prevMetaSkills, value]);
        setSkills((prevSkills) => prevSkills.filter((item) => item !== value));
    };

    useEffect(() => {
        const metaDataArray = metaData.map((item: any) => item.name);
        const filteredMetaData = metaDataArray.filter((item: any) => !data.includes(item));
        setSkills(data);
        setMetaSkills(filteredMetaData);
    }, []);

    return (
        <div 
            key={index} 
            className="relative pb-4"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <h3 className="text-fsGray font-bold mb-2">
                {title}:
            </h3>
            <div className="flex flex-wrap gap-2.5">
                {
                    skills.length === 0 ? (
                        <span className="px-3 text-fsGray text-sm cursor-pointer" onClick={toggleEdit}>Add skills here</span>
                    ) : (
                    skills.map((item: any, index: number) => {
                        return(
                            <span 
                                id={item} 
                                key={index} 
                                onClick={handleRemoveSkill}
                                className={`text-fsGray text-sm bg-gray-200 py-1.5 px-3.5 rounded-full ${editing && "cursor-pointer"}`}
                            >
                                {item}
                            </span>
                        )
                    })
                    )
                }
            </div>

            {
                hover && !editing && (
                    <Edit toggleEdit={toggleEdit} title="Edit"/>
                )
            }
            {
                editing && (
                    <div className="p-8">
                        <p className="text-fsGray mb-2">Add skills: </p>
                        <div className="flex flex-wrap gap-4">
                            { 
                                metaSkills.map((item: any, index: number) => {
                                    return(
                                        <span 
                                            key={index} 
                                            className="cursor-pointer text-sm bg-teal-md text-white py-1.5 px-3.5 rounded-full"
                                            onClick={handleAddSkill}
                                            id={item}
                                        >
                                            + {item}
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <Edit 
                            toggleEdit={() => handleSave()}
                            save={true}
                            title="Save"
                        />
                    </div>
                )
            }
        </div>
    )
}