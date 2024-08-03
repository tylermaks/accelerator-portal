"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";

// Define the schema using Zod
const TextareaSchema = z.object({
  value: z.string().min(1, "This field is required"),
});

export default function Textarea({ label, name, prepopulate }: { label: string, name: string, prepopulate?: string }) {
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        const result = TextareaSchema.safeParse({ value: sanitizedValue });

        if (!result.success) {
            setError(result.error.errors[0].message);
        } else {
            setError("");
            setValue(sanitizedValue);
        }
    };

    return (
        <div className="w-full">
            <label htmlFor={name} className="block mb-1 text-xs text-fsGray">{label}</label>
            <textarea 
                className="w-full resize-none border bg-gray-50 rounded-lg p-2 text-sm text-fsGray" 
                name={name} 
                id={name}
                rows={6}
                value={value}
                onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
