// reset-password-form.tsx
// Password reset form with validation and error handling for Supabase users.

"use client"

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, FormEvent } from "react";
import PasswordInput from "@/components/ui/password-input";
import MainButton from "@/components/ui/main-button";
import * as z from "zod";

// -------------------
// Password validation schema
// -------------------
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export default function ResetPasswordForm() {
    // -------------------
    // State
    // -------------------
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationStatus, setValidationStatus] = useState({
      length: false,
      uppercase: false,
      number: false,
      specialChar: false,
    });
    const [sessionChecked, setSessionChecked] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // -------------------
    // On mount: extract code param and check session
    // -------------------
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const pathName = window.location.search;
        const urlParams = new URLSearchParams(pathName);
        const pathUrl = urlParams?.get('code');
        if (typeof pathUrl === 'string') {
          setCode(pathUrl);
        }
      }
      // Check for valid session on mount
      const checkSession = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Your session has expired or is invalid. Please request a new password reset link.");
        }
        setSessionChecked(true);
      };
      checkSession();
    }, []);

    // -------------------
    // Handlers
    // -------------------
    const handlePasswordChange = (value: string) => {
      setPassword(value);
      setValidationStatus({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[^A-Za-z0-9]/.test(value),
      });
      if (error) setError("");
    };

    const handleConfirmPasswordChange = (value: string) => {
      setConfirmPassword(value);
      if (error) setError("");
    };

    // -------------------
    // Form submit
    // -------------------
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // Check session again before submitting
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Your session has expired or is invalid. Please request a new password reset link.");
          setIsLoading(false);
          return;
        }

        try {
          const passwordValidation = passwordSchema.safeParse(password);
          if (!passwordValidation.success) {
              setError(passwordValidation.error.errors[0].message);
              setIsLoading(false);
              return;
          }
          if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
          }
          if (!code) {
            setError("Your password reset link is not valid. Either it was already clicked or it has expired. Please request another password reset link");
            setIsLoading(false);
            return;
          }
          const { error: updateUserError } = await supabase.auth.updateUser({
            password: confirmPassword
          });
          if (updateUserError) {
            setError("Error updating password:" + updateUserError.message);
            setIsLoading(false);
            return;
          }
          // Redirect to login with success message
          router.push("/login?reset=success");
        } catch (error) {
          setError("A server error occurred, please try again");
          setIsLoading(false);
        }
    };

    // -------------------
    // Render
    // -------------------
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
          <PasswordInput 
            label="Confirm Password:" 
            id="confirmed-password" 
            name="confirmed-password"
            setFormState={handleConfirmPasswordChange}
          />
          <div className="text-sm mt-2">
            <p className={password === confirmPassword ? "text-teal-md" : "text-red-500"}>
              {password === confirmPassword ? "✓" : "✗"} Passwords must match
            </p>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <MainButton 
            loading={isLoading}
            id='reset-password'
            text="Submit"
            type="submit"
            disabled={!sessionChecked || !!error}
          />
      </form>
    );
}
        