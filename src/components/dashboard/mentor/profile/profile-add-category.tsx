"use client"

import { useState, useEffect } from "react"

type ProfileAddSkillProps = {
    metaData: any[]
    setSkills: React.Dispatch<React.SetStateAction<any>>
    skills: any[]
}

export default function ProfileAddSkill({ metaData, setSkills, skills } : ProfileAddSkillProps ) {
    const [open, setOpen] = useState(false);
    const [metaDataOptions, setMetaDataOptions] = useState<any[]>([]);
    

    const toggleOpen = () => {
        setOpen(!open);
    };

    const addNewSkill = (currentOption: string) => {
        const data = metaData.find((item: any) => item.name === currentOption);
        const newSkill = {
            name: data.name,
            options: []
        }
        
        setSkills((prevSkills: any) => [...prevSkills, newSkill]);
        setOpen(false);
    }

    useEffect(() => {
        const filteredMetaData = metaData.filter((item: any) => item.type.includes('multipleSelects'));
        const metaDataArray = filteredMetaData.map((item: any) => item.name);
        const skillsArray = skills.map((item: any) => item.name);
        const metaDataOptions = metaDataArray.filter((item: any) => !skillsArray.includes(item));
 
        setMetaDataOptions(metaDataOptions);
    }, [skills, metaData])

    return(
        <div className="w-full mt-8 cursor-pointer">
            {
                open ? (
                    <div >
                        <h3 className="text-fsGray font-bold mb-2" >
                            Add New Category: 
                        </h3>
                        <div className="flex flex-wrap gap-2.5">  
                            {
                                metaDataOptions.length === 0 ? (
                                    <span className="px-3 text-fsGray text-sm">You have added all available categories</span>
                                ) : (
                                
                                metaDataOptions.map((item: any, index: number) => {
                                    return(
                                        <span 
                                            key={index} 
                                            className="cursor-pointer text-sm bg-teal-md text-white py-1.5 px-3.5 rounded-full"
                                            onClick={() => addNewSkill(item)}
                                            id={item}
                                        >
                                            + {item}
                                        </span>
                                    )
                                })
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <p className="text-fsGray text-sm" onClick={toggleOpen}>+ Add Category</p>
                )
            }
        </div>
    )
}