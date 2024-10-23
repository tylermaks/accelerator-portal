"use client"

import React from 'react'

import DOMPurify from 'dompurify';
import { useState, useEffect, useRef, useCallback, } from "react"
import { updateProfile } from "@/lib/profile-actions";
import Edit from "@/components/ui/edit";

type EditableTextProps = {
    id: string;
    data: string;
}

export default function ProfileEditable({ data, id }: EditableTextProps) {
    const [dataID, setDataID] = useState("");
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState("");
    const [truncation, setTruncation] = useState(true)
    const [lineCount, setLineCount] = useState(0)
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        setDataID(id);
        setValue(data);
    }, [data, id]);

    useEffect(() => { 
        countLines()
    }, [])

    useEffect(() => {
        if (editing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(value.length, value.length);
        }
    }, [editing, value]);

    // useEffect(() => {
    //     const cancelEditingOnOutsideClick = ( event: MouseEvent) => { 
    //         if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) { 
    //             if(editing){ 
    //                 setEditing(false)
    //             }
    //         }
    //     }
        
    //     document.addEventListener("mousedown", cancelEditingOnOutsideClick);
    //     return () => {
    //         document.removeEventListener("mousedown", cancelEditingOnOutsideClick);
    //     };
    // }, [editing]);


    const toggleTruncation = () =>  {
        setTruncation(!truncation)
    }

    const countLines = () => {
        const el = document.getElementById('bio');
        const divHeight = el ? el.offsetHeight : 0;
        const lineHeight = el ? parseInt(window.getComputedStyle(el).lineHeight, 10) : 1;
        const lines = divHeight / lineHeight;

        setLineCount(Math.floor(lines));
    };

    const handleSave = useCallback(async (formData: FormData) => {
        const bioText = formData.get("profileBio") as string
        const sanitizedBioText = DOMPurify.sanitize(bioText)

        await updateProfile(dataID, { "Bio": sanitizedBioText });

        setValue(sanitizedBioText)
        setEditing(false);
    }, [dataID]);

    const toggleEdit = () => {
        setEditing(true);
    };

    

    return (
        <div
            className={`w-full relative py-1.5`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
         
            {editing ? (
                <form action={handleSave}>
                    <textarea
                        ref={textareaRef}
                        name="profileBio"
                        id="profileBio"
                        className="text-fsGray w-5/6 resize-none border border-fsGray rounded-md p-2 h-60"
                        defaultValue={value}
                    />
                    <div
                        className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer p-5"
                        onClick={toggleEdit}
                    >
                        <Edit title="Save"/>
                    </div>
                </form>
                
            ) : (
                <div>
                    <p id="bio" className={truncation ? "w-5/6 line-clamp-6" : "w-5/6"}>
                        {value?.split('\n').map((item, index) => (
                            <React.Fragment key={index}>
                                {item}
                                {index < value?.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                    {lineCount === 6 && <span className="text-xs underline cursor-pointer" onClick={toggleTruncation}>{truncation ? "Read more" : "Show less"}</span>}
                </div>
                
            )}
              
            {hover && !editing && (
                <div
                    className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer"
                    onClick={toggleEdit}
                >
                    <Edit title="Edit" />
                </div>
            )}
        </div>
    );
}
