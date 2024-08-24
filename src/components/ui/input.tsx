"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";

const InputSchema = z.object({
  value: z.string().min(1, "This field is required"),
});

export default function Input({ 
    label,
    type, 
    id,
    name,
    prepopulate,
    isRequired = false
}: { 
    label: string,
    type: string, 
    id: string,
    name: string,
    prepopulate?: string,
    isRequired?: boolean
}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        const result = InputSchema.safeParse({ value: sanitizedValue });

        if (!result.success) {
            setError(result.error.errors[0].message);
        } else {
            setError("");
            setValue(sanitizedValue);
        }
    };

    useEffect(() => {
        const sanitizedPrepopulate = prepopulate ? DOMPurify.sanitize(prepopulate) : "";
        const result = InputSchema.safeParse({ value: sanitizedPrepopulate });

        if (result.success) {
            setValue(result.data.value); // Set the value if validation passes
        } else {
            console.error(result.error); // Log or handle validation errors
            setValue(""); // Optionally set an empty value or handle it differently
        }    
    }, [prepopulate]);

    return (
        <div className="w-full">
            <label htmlFor={id} className="block mb-1 text-xs text-gray-700">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required={isRequired}
                autoComplete="off"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
