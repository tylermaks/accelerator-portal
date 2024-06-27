"use client"

import { useState, useEffect, useRef } from "react"
import { updateProfile } from "@/lib/actions";
import Edit from "@/components/ui/edit";

type EditableTextProps = {
    id: string;
    data: string;
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
        await updateProfile(dataID, { 'Bio': textareaRef.current?.value });
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
        textarea.style.height = 'auto'; 
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height
    };

    return (
        <div
            className={`w-full relative py-1.5`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
         
            {editing ? (
                <div>
                    <textarea
                        ref={textareaRef}
                        name="profileTextInput"
                        id="profileTextInput"
                        className="text-fsGray w-5/6 resize-none border border-fsGray rounded-md p-2"
                        onChange={handleTextChange}
                        value={value}
                    />
                    <div
                    className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer"
                    onClick={toggleEdit}
                >
                    <Edit title="Save" save={true} toggleEdit={handleSave} />
                </div>

                </div>
                
            ) : (
                <p className="text-fsGray w-5/6">{value}</p>
            )}
              
            {hover && !editing && (
                <div
                    className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer"
                    onClick={toggleEdit}
                >
                    <Edit title="Edit" toggleEdit={toggleEdit} />
                </div>
            )}
        </div>
    );
}
