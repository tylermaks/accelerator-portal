"use client"

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, FormEvent } from "react";
import Input from "@/components/ui/input";
import MainButton from "@/components/ui/main-button";
import * as z from "zod"; // Import Zod

// Define the password schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");


export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [validationStatus, setValidationStatus] = useState({
      length: false,
      uppercase: false,
      number: false,
      specialChar: false,
    });

    const router = useRouter()

    const handlePasswordChange = (value: string) => {
      setPassword(value);
  
      // Update validation status
      setValidationStatus({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[@$!%*?&#]/.test(value),
      });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try {
          const passwordValidation = passwordSchema.safeParse(password)

          if (!passwordValidation.success) {
              setError(passwordValidation.error.errors[0].message)
              setIsLoading(false);
              return;
          }

          if (password !== confirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
          }

     
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
              setFormState={handlePasswordChange}
            />
             <div className="text-sm mt-2">
              <p className={validationStatus.length ? "text-green-500" : "text-red-500"}>
                {validationStatus.length ? "✓" : "✗"} Must have at least 8 characters
              </p>
              <p className={validationStatus.uppercase ? "text-green-500" : "text-red-500"}>
                {validationStatus.uppercase ? "✓" : "✗"} Must contain an uppercase letter
              </p>
              <p className={validationStatus.number ? "text-green-500" : "text-red-500"}>
                {validationStatus.number ? "✓" : "✗"} Must contain a number
              </p>
              <p className={validationStatus.specialChar ? "text-green-500" : "text-red-500"}>
                {validationStatus.specialChar ? "✓" : "✗"} Must contain a special character
              </p>
            </div>
            <>
              <Input 
                label="Confirm Password:" 
                type="password" 
                id="confirmed-password" 
                name="confirmed-password"
                isRequired={true}
                setFormState={setConfirmPassword}
              />
              <div className="text-sm mt-2">
                <p className={password === confirmPassword ? "text-green-500" : "text-red-500"}>
                  {password === confirmPassword ? "✓" : "✗"} Passwords must match
                </p>
              </div>
              
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