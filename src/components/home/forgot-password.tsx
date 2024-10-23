"use client"

import { useState } from "react";
import Input from "../ui/input";
import MainButton from "../ui/main-button";
import { sendPasswordReset } from "@/lib/supabase-actions";

export default function ForgotPassword() {
    const [error, setError] = useState<string>("");

    const handleSendPasswordReset = async (formData: FormData) => {
        const result = await sendPasswordReset(formData);
        console.log("RESULT", result)
        const data = result?.data

        if (data && Object.keys(data).length === 0) {
            setError(" Please check your email for a link to reset your password");
        };
    }

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl text-gray-700 mb-2">Forgot password?</h1>
                <p className="text-gray-700 text-sm">Please enter your email to reset your password</p>
            </div>    
            <form className="w-full flex flex-col gap-4" action={handleSendPasswordReset}>
                <Input 
                    label="Email:"
                    type="email" 
                    id="email"
                    name="email"
                />
               
                <MainButton 
                    id='forgot-password'
                    text="Submit"
                />
            </form>
            {error && <p className="bg-green-200 p-2 rounded-md text-green-600 text-xs">{error}</p>}
        </>
    );
}