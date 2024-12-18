"use client"

import Input from "../ui/input"
import MainButton from "@/components/ui/main-button"
import { verifyPasscode } from "@/lib/supabase-actions"
import { useRouter, usePathname } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function VerifyOTPForm() {
    const router = useRouter();
    const [error, setError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { 
        event.preventDefault()

        //get email
        const { email } = usePathname.arguments;
        console.log("EMAIL FROM OTP", email)
        const userEmail = typeof email === 'string' ? email : '';

        //get token
        const token = (event.target as HTMLFormElement).otpPasscode.value

        //verify the OTP
        const response = await verifyPasscode(userEmail, token)

        // If there is an error verifying the code, set the error message
        if (response.status === 400 || response.status === 500) { 
            setError(response.message)
        }

        //If success redirect user to reset their password
        if (response.status === 200 && response?.redirectUrl) { 
            const url = response?.redirectUrl
            router.push(url)
        } 
    }   


    return (
        <form className="flex flex-col gap-4 py-16 w-1/3" onSubmit={handleSubmit}>
            <div>
              <h1 className="text-xl font-semibold text-fsGray mb-2 ">Verify Passcode</h1>
              <p className="text-fsGray text-sm">Enter your passcode below to reset your password</p>
            </div>
            <Input 
                label="Passcode:" 
                type="text" 
                id="otpPasscode" 
                name="otpPasscode" 
                isRequired={true}
            />
            <MainButton 
              id='submitOtp'
              text="Submit"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </form>
    )
}