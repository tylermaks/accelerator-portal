"use client"

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, FormEvent } from "react";
import PasswordInput from "@/components/ui/password-input";
import MainButton from "@/components/ui/main-button";
import * as z from "zod"; // Import Zod

// Define the password schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");


export default function ResetPasswordForm() {
    const [code, setCode] = useState("")
    // const [email, setEmail] = useState("")
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

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const pathName = window.location.search;
        const urlParams = new URLSearchParams(pathName);
        const pathUrl = urlParams?.get('code');
        // const emailUrl = urlParams?.get('email')
        if (typeof pathUrl === 'string') {
          setCode(pathUrl);
        }
        // if (typeof emailUrl === 'string') {
        //   setEmail(emailUrl);
        // }
      }
    }, []);

    const router = useRouter();
    const supabase = createClient();

    // const searchParams = useSearchParams();
    // const code = searchParams?.get('code');
    // const email = searchParams?.get('email') as string;

    const handlePasswordChange = (value: string) => {
      setPassword(value);
  
      // Update validation status
      setValidationStatus({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[^A-Za-z0-9]/.test(value),
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

          if(!code){
            setError("Your password reset link is not valid. Either it was already clicked or it has expired. Please request another password reset link")
            setIsLoading(false)
            return;
          }

          // const { error: verifyError } = await supabase.auth.verifyOtp({
          //   token: code,
          //   type: "recovery",
          //   email: email
          // });

          // if (verifyError) {
          //   console.log("Verify Error", verifyError);
          //     setError("Error verifying code:" + verifyError.message);
          //     setIsLoading(false);
          //     return;
          // }

          const { error: updateUserError } = await supabase.auth.updateUser({
            password: confirmPassword
          })


          if (updateUserError) {
              console.log("Update User Error", updateUserError);
                setError("Error updating password:" + updateUserError.message);
                setIsLoading(false);
                return;
          }
        
          console.log("SUCCESSFULLY UPDATED PASSWORD")
          router.push("/dashboard");


          // if (code) { 
          //   const supabase = createClient()

          //   const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          //   console.log("SESSIONN", session, sessionError)

          //   const { data: resetData, error } = await supabase.auth.updateUser({
          //     password: confirmPassword
          //   })

          //   if (error) {
          //     console.log("ERROR", error)
          //     setError("Password was not updated: " + error.message)
          //     setIsLoading(false)
          //     router.push("/")
          //   }
  
          //   if (resetData) {
          //     router.push("/")
          //   }
          // }
        } catch(error) {
          console.error("There was an error:", error)
          setError("A server error occurred, please try again")
          setIsLoading(false)
        } 
    }


    useEffect(() => {
        setError("")
    }, [password, confirmPassword])

    return (
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <div>
            <h1 className="text-xl font-semibold text-fsGray mb-2 ">Reset your password</h1>
            <p className="text-fsGray text-sm">Enter your new password below to reset it</p>
          </div>
          <PasswordInput 
            label="New Password:" 
            id="password" 
            name="password"
            setFormState={handlePasswordChange}
          />
            <div className="text-sm mt-2">
            <p className={validationStatus.length ? "text-teal-md" : "text-red-500"}>
              {validationStatus.length ? "✓" : "✗"} Must have at least 8 characters
            </p>
            <p className={validationStatus.uppercase ? "text-teal-md" : "text-red-500"}>
              {validationStatus.uppercase ? "✓" : "✗"} Must contain an uppercase letter
            </p>
            <p className={validationStatus.number ? "text-teal-md" : "text-red-500"}>
              {validationStatus.number ? "✓" : "✗"} Must contain a number
            </p>
            <p className={validationStatus.specialChar ? "text-teal-md" : "text-red-500"}>
              {validationStatus.specialChar ? "✓" : "✗"} Must contain a special character
            </p>
          </div>
          <>
            <PasswordInput 
              label="Confirm Password:" 
              id="confirmed-password" 
              name="confirmed-password"
              setFormState={setConfirmPassword}
            />
            <div className="text-sm mt-2">
              <p className={password === confirmPassword ? "text-teal-md" : "text-red-500"}>
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
    )
}
        