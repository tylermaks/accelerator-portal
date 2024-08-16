"use client"

import { useState, useEffect } from "react"
import { updateProfile } from "@/lib/actions";
import Edit from "@/components/ui/edit"
import Image from "next/image"

type ProfileSkillsProps = {
    id: string
    data: string[]
    metaData: string[]
    title: string
    index: number
    updateCategories: React.Dispatch<React.SetStateAction<string[]>>
}

export default function ProfileSkill({ id, data, metaData, title, index, updateCategories }: ProfileSkillsProps) {
    const [skillsOnLoad, setSkillsOnLoad] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [metaSkills, setMetaSkills] = useState<string[]>([]);
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);


    const toggleEdit = () => {
        setEditing(!editing);
    };

    const handleSave = async () => {
        //Add useOptimistic here?
        setEditing(false);
        setHover(false);

        if (skills === skillsOnLoad) return;

        let skillsArr = skills.map((item) => item);
        await updateProfile(id,  { [title]: skillsArr });
    };

    const handleDeleteCategory = async (categoryToDelete: string) => {
        updateCategories((prevCategories) => prevCategories.filter((item) => item !== categoryToDelete));
        updateProfile(id, { [categoryToDelete]: [] });
        setEditing(false);
    }

    const handleAddSkill = (event: React.MouseEvent<HTMLButtonElement>) => {
        const value = (event.target as HTMLInputElement).id;
        setSkills((prevSkills) => [...prevSkills, value]);
        setMetaSkills((prevMetaSkills) => prevMetaSkills.filter((item) => item !== value));
    };

    const handleRemoveSkill = (event: React.MouseEvent<HTMLDivElement>) => {
        if(!editing) return
        const value = (event.currentTarget as HTMLDivElement).id;
        setMetaSkills((prevMetaSkills) => [...prevMetaSkills, value]);
        setSkills((prevSkills) => prevSkills.filter((item) => item !== value));
    };

    useEffect(() => {
        const metaDataArray = metaData.map((item: any) => item.name);
        const filteredMetaData = metaDataArray.filter((item: any) => !data.includes(item));
        setSkillsOnLoad(data)
        setSkills(data);
        setMetaSkills(filteredMetaData);
    }, [data, metaData]);

    return (
        <div 
            key={index} 
            className="relative pb-4"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="relative">
                <h3 className="text-fsGray font-bold">
                    {title}:
                </h3>
                {
                    editing && (
                        <div
                            className="cursor-pointer absolute top-0 bottom-0 left-[-22px] flex gap-1 items-center"
                            onClick={() => handleDeleteCategory(title)}
                        >
                            <Image src="/images/remove-icon.svg" alt="remove" width={17} height={17}/>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-wrap gap-2.5">
                {
                    skills.length === 0 ? (
                        <span className="px-3 text-fsGray text-sm cursor-pointer" onClick={toggleEdit}>Add skills here</span>
                    ) : (
                    skills.map((item: any, index: number) => {
                        return(
                            <div 
                                id={item}
                                key={index} 
                                onClick={handleRemoveSkill} 
                                className={`text-fsGray flex gap-2 items-center text-sm bg-gray-200 py-1.5 px-3.5 rounded-full ${editing && "cursor-pointer"}`}
                            >
                                <span 
                                    id={item} 
                                >
                                    {item}
                                </span>
                                { editing && <Image src="/images/remove-icon.svg" alt="remove" width={17} height={17}/>}
                            </div>
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