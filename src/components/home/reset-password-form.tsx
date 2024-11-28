"use client"

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, FormEvent } from "react";
import Input from "@/components/ui/input";
import MainButton from "@/components/ui/main-button";


export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try {
          if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
          }

          if (password === confirmPassword) {
            const supabase = createClient()
            const { data: resetData, error } = await supabase.auth.updateUser({
              password: confirmPassword
          })

            if (error) {
              setError("There was an issue resetting your password. Please contact the Foresight team.")
              setIsLoading(false)
              return
            }

            if (resetData) {
              router.push("/")
            }
          }

        } catch(error) {
          console.error(error)
          setError("A server error occurred, please try again")
          setIsLoading(false)
        } 
    }


    useEffect(() => {
        setError("")
    }, [password, confirmPassword])

    return (
        <form className="flex flex-col gap-4 py-16 w-1/3" onSubmit={handleSubmit}>
            <div>
             
              <h1 className="text-xl font-semibold text-fsGray mb-2 ">Reset your password</h1>
              <p className="text-fsGray text-sm">Enter your new password below to reset it</p>
            </div>
            <Input 
              label="New Password:" 
              type="password" 
              id="password" 
              name="password" 
              isRequired={true}
              setFormState={setPassword}
            />
            <>
              <Input 
                label="Confirm Password:" 
                type="password" 
                id="confirmed-password" 
                name="confirmed-password"
                isRequired={true}
                setFormState={setConfirmPassword}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </>
            <MainButton 
              loading={isLoading}
              id='reset-password'
              text="Submit"
            />
        </form>
    );
}