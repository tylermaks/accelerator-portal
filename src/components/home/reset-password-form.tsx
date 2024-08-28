"use client"

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Input from "@/components/ui/input";
import MainButton from "@/components/ui/main-button";
// import { useRouter } from "next/router";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password === confirmPassword) {
          const supabase = createClient()
          const { data: resetData, error } = await supabase.auth.updateUser({
            password: confirmPassword
          })
          
          if (error) {
            setError("There was an issue resetting your password. Please contact the Foresight team.")
            return
          }

          //RETURN TO FIX THIS LINE
          // if (resetData) {
          //   useRouter().push("/")
          // }
        }
    }

    useEffect(() => {
        setError("")
    }, [password, confirmPassword])

    return (
        <form className="flex flex-col gap-4 py-16 w-1/3" action={handleSubmit}>
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
              updateExternalState={setPassword}
            />
            <>
              <Input 
                label="Confirm Password:" 
                type="password" 
                id="confirmed-password" 
                name="confirmed-password"
                isRequired={true}
                updateExternalState={setConfirmPassword}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </>
            <MainButton 
              id='reset-password'
              text="Submit"
            />
        </form>
    );
}