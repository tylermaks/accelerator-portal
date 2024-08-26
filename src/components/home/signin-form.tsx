"use client"

import { useState, useEffect } from "react";
import Input from "../ui/input";
import MainButton from "../ui/main-button";
import { login } from "@/lib/supabase-actions";


export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (formData: FormData) => {
        const result = await login(formData);
        
        if (result?.status === 400) {
            setError("Invalid email or password");
        }
    }

    useEffect(() => {
        setError("")
    }, [password, email])

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl text-gray-700 mb-2">Welcome back</h1>
                <p className="text-gray-700 text-sm">Please enter your details to sign in</p>
            </div>  
        
            <form action={handleLogin} className="flex flex-col gap-4 w-full">   
                <Input 
                    label="Email:"
                    type="email" 
                    id="email"
                    name="email"
                    isRequired={true}
                    updateExternalState={setEmail}
                />
                <>
                    <Input 
                        label="Password:"
                        type="password" 
                        id="password"
                        name="password"
                        isRequired={true}
                        updateExternalState={setPassword}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </>
               
                <MainButton 
                    id='signin'
                    text="Sign In"
                />
            </form>
        </>
    );
}