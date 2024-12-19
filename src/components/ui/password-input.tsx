"use client"

import { useState } from "react"
import Image from "next/image"

export default function PasswordInput({ 
    label, 
    id, 
    name,
    setFormState,
} : {
    label: string, 
    id: string,
    name: string,
    setFormState?: (value: string) => void,
}) {

    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [isPassword, setIsPassword] = useState(true)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value
        setValue(password);
        setFormState && setFormState(password);
    }

    const togglePassword = () => {
        setIsPassword(!isPassword)
    }

    return (
        <div className="w-full relative">
        <label htmlFor={id} className="block mb-1 text-xs text-gray-700">
            {label}
        </label>
        <input
            id={id}
            name={name}
            type={isPassword ? "password" : "text"}
            value={value}
            onChange={handleChange}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
            autoComplete="off"
        />
        
        <Image 
            className="absolute right-3 top-[45%] bottom-[55%] cursor-pointer"
            src="/images/show-icon.svg" 
            alt="Show password" 
            width={23} 
            height={23} 
            onClick={togglePassword} 
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
    )
}