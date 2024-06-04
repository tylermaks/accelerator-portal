import Image from "next/image";
import SignInForm from "../home/signin-form";
import Link from "next/link";

export default function SignIn() {
    return (
        <div className="w-1/2 p-8">
            <Image 
                src="/images/company-logo.png"
                alt="Foresight Logo"
                width={100}
                height={50}
            />
            <div className="flex flex-col gap-8 py-28 px-32 items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl text-gray-700 mb-2">Welcome back</h1>
                    <p className="text-gray-700 text-sm">Please enter your details to sign in</p>
                </div>    
                <SignInForm />
                <Link href="/forgotpassword" className="text-orange-500 text-sm">Forgot password?</Link>
            </div>
        </div>
    );
}