"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";
import Image from "next/image";

const InputSchema = z.object({
  value: z.string().min(0, "This field is required"),
});

export default function Input({ 
    label,
    type, 
    id,
    name,
    setFormState,
    prepopulate,
    isRequired = false,
    resetKey
}: { 
    label: string,
    type: string, 
    id: string,
    name: string,
    setFormState?: (value: string) => void,
    prepopulate?: string,
    isRequired?: boolean
    resetKey?: number
}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [isPassword, setIsPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        const result = InputSchema.safeParse({ value: sanitizedValue });

        if (!result.success) {
            setError(result.error.errors[0].message);
        } else {
            setError("");
            setValue(sanitizedValue);
            setFormState && setFormState(sanitizedValue);
        }
    };

    const togglePassword = () => {
        setIsPassword(!isPassword);
    };

    useEffect(() => {
        const sanitizedPrepopulate = prepopulate ? DOMPurify.sanitize(prepopulate) : "";
        const result = InputSchema.safeParse({ value: sanitizedPrepopulate });

        if (result.success) {
            setValue(sanitizedPrepopulate); // Set the value if validation passes
        } else {
            console.error(result.error); // Log or handle validation errors
            setValue(""); // Optionally set an empty value or handle it differently
        }    
    }, [prepopulate]);

    useEffect(() => {
        setValue("");
    }, [resetKey]);

    return (
        <div className="w-full relative">
            <label htmlFor={id} className="block mb-1 text-xs text-gray-700">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={isPassword ? (type === "password" ? "text" : type) : type}
                value={value}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required={isRequired}
                autoComplete="off"
                min="0"
                step="0.01"
            />
            {
                type === "password" && (
                    <Image 
                        className="absolute right-3 top-[45%] bottom-[55%] cursor-pointer"
                        src="/images/show-icon.svg" 
                        alt="Show password" 
                        width={23} 
                        height={23} 
                        onClick={togglePassword} 
                    />
                )  
            }
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
