"use client"

import { FormEvent, useState } from "react";
import { sendPasswordReset } from "@/lib/supabase-actions";
import Input from "../ui/input";
import MainButton from "../ui/main-button";
import LoadingSpinner from "../ui/loading-spinner";

export default function ForgotPassword() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleSendPasswordReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try{ 
            const formData = new FormData(event.currentTarget);
            const result = await sendPasswordReset(formData);

            if (result?.status === 400) {
                setError("Invalid email");
                setIsLoading(false)
            }
            
            const data = result?.data;
            if (data && Object.keys(data).length === 0) {
                setError("If an account exists with this email a password reset link will be sent to your email.");
                setIsLoading(false)
            };
        } catch(error) { 
            console.error(error)
            setError("A server issue occurred, please try again")
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl text-gray-700 mb-2">Forgot password?</h1>
                <p className="text-gray-700 text-sm">Please enter your email to reset your password</p>
            </div>    
            <form onSubmit={handleSendPasswordReset} className="w-full flex flex-col gap-4" >
                <Input 
                    label="Email:"
                    type="email" 
                    id="email"
                    name="email"
                />
               
                <MainButton 
                    loading={isLoading}
                    id='forgot-password'
                    text="Submit"
                />
            </form>
            {error && <p className="bg-green-200 p-2 rounded-md text-green-600 text-xs">{error}</p>}
            {isLoading && <LoadingSpinner />}
        </>
    );
}