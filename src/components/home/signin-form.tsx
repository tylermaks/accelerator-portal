import Input from "../ui/input";
import MainButton from "../ui/main-button";
import { login } from "@/lib/supabase-actions";


export default function SignInForm() {
    return (
        <>
            <div className="text-center">
                    <h1 className="text-3xl text-gray-700 mb-2">Welcome back</h1>
                    <p className="text-gray-700 text-sm">Please enter your details to sign in</p>
            </div>  
        
            <form action={login} className="flex flex-col gap-4 w-full">   
                <Input 
                    label="Email:"
                    type="email" 
                    id="email"
                    name="email"
                />
                <Input 
                    label="Password:"
                    type="password" 
                    id="password"
                    name="password"
                />
                <MainButton 
                    id='signin'
                    text="Sign In"
                />
            </form>
        </>
    );
}