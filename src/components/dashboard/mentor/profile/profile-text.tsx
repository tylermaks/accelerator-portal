"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

type EditableTextProps = {
    id: string;
    data: string;
}

async function updateProfileText(id: string, fields: any) {
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

export default function ProfileEditable({ data, id }: EditableTextProps) {
    const [dataID, setDataID] = useState("");
    const [hover, setHover] = useState(false);
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(data);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setDataID(id);
        setValue(data);
    }, [data]);

    useEffect(() => {
        if (editing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(value.length, value.length);
        }
    }, [editing, value]);


    //REPLACE WITH EDIT COMPONENT (WITH SAVE OPTION)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
                if (editing) {
                    handleSave();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editing]);

    const handleSave = async () => {
        await updateProfileText(dataID, { 'Bio': textareaRef.current?.value });
        setEditing(false);
    };

    const toggleEdit = () => {
        setEditing(true);
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        adjustTextareaHeight(event.target);
    };

    const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto'; // Reset the height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
    };

    return (
        <div
            className={`w-full relative py-1.5`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
         
            {editing ? (
                <textarea
                    ref={textareaRef}
                    name="profileTextInput"
                    id="profileTextInput"
                    className="text-fsGray w-5/6 resize-none border border-fsGray rounded-md p-2"
                    onChange={handleTextChange}
                    value={value}
                />
            ) : (
                <p className="text-fsGray w-5/6">{value}</p>
            )}
              
            {hover && !editing && (
                <div
                    className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer"
                    onClick={toggleEdit}
                >
                    <Image
                        src="/images/edit-pencil.svg"
                        alt="edit"
                        width={20}
                        height={20}
                    />
                    <p className="text-fsGray text-xs">Edit</p>
                </div>
            )}
        </div>
    );
}
