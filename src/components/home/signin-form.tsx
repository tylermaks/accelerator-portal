"use client"

import { useState, useEffect, FormEvent } from "react";
import { login } from "@/lib/supabase-actions";
import Input from "../ui/input";
import PasswordInput from "../ui/password-input";
import MainButton from "../ui/main-button";
import LoadingSpinner from "../ui/loading-spinner";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const result = await login(formData);

            if (result?.status === 400) {
                setError("Invalid email or password");
                setIsLoading(false);
            }
        } catch (error) {
            setError("A server error occurred, please try again");
            setIsLoading(false);
            console.error(error);
        }
    };

    useEffect(() => {
        setError("");
    }, [password, email]);

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl text-gray-700 mb-2">Welcome back</h1>
                <p className="text-gray-700 text-sm">Please enter your details to sign in</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                <Input
                    label="Email:"
                    type="email"
                    id="email"
                    name="email"
                    isRequired={true}
                    setFormState={setEmail}
                    prepopulate={email} // Added prepopulate prop
                />
                <>
                    <PasswordInput
                        label="Password:"
                        id="password"
                        name="password"
                        setFormState={setPassword}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </>

                <MainButton
                    loading={isLoading}
                    id='signin'
                    text="Sign In"
                />
            </form>
            {isLoading && <LoadingSpinner />}
        </>
    );
}