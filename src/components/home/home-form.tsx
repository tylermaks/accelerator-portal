"use client"

import { useState } from "react";
import ForgotPassword from "@/components/home/forgot-password";
import Image from "next/image";
import SignInForm from "./signin-form";


export default function HomeForm() {
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [sucess, setSuccess] = useState<boolean>(false);

    return (
        <div className="w-full">
            <Image 
                src="/images/company-logo.png"
                alt="Foresight Logo"
                width={100}
                height={50}
            />
            <div className="flex flex-col gap-8 pt-28 pb-8 px-32 items-center justify-center">
                { forgotPassword ? <ForgotPassword /> :  <SignInForm /> } 
                <p
                    className="text-fsGray text-sm hover:underline cursor-pointer"
                    onClick={() => setForgotPassword(!forgotPassword)}
                    >
                    { forgotPassword ? "Back to Sign In" : "Forgot password?" } 
                </p>
            </div>
        </div>
    );
}