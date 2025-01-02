"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";

// Define the schema using Zod
const TextareaSchema = z.object({
  value: z.string().min(0),
});

type TextAreaProps = { 
    label: string,
    name: string,
    prepopulate?: string,
    setFormState?: (value: string) => void,
    resetKey?: number
}


export default function Textarea({
    label,
    name,
    prepopulate,
    setFormState,
    resetKey
}: TextAreaProps ) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const sanitizedPrepopulate = prepopulate ? DOMPurify.sanitize(prepopulate) : "";
        const result = TextareaSchema.safeParse({ value: sanitizedPrepopulate });

        if (result.success) {
            setValue(result.data.value); // Set the value if validation passes
        } else {
            console.error(result.error); // Log or handle validation errors
            setValue(""); // Optionally set an empty value or handle it differently
        }
    }, [prepopulate]);

    useEffect(() => {
        setValue("");
    }, [resetKey]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        const result = TextareaSchema.safeParse({ value: sanitizedValue });

        if (!result.success) {
            setError(result.error.errors[0].message);
        } else {
            setError("");
            setValue(sanitizedValue);
            setFormState && setFormState(sanitizedValue);
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <label htmlFor={name} className="block mb-1 text-xs text-fsGray">{label}</label>
            <textarea 
                className="w-full resize-none border bg-gray-50 rounded-lg p-2 text-sm text-fsGray h-full" 
                name={name} 
                id={name}
                value={value}
                onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
