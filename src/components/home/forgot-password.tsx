import Input from "../ui/input";
import MainButton from "../ui/main-button";
import { sendPasswordReset } from "@/lib/supabase-actions";

export default function ForgotPassword() {

    

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl text-gray-700 mb-2">Forgot password?</h1>
                <p className="text-gray-700 text-sm">Please enter your email to reset your password</p>
            </div>    
            <form className="w-full flex flex-col gap-4" action={sendPasswordReset}>
                <Input 
                    label="Email:"
                    type="email" 
                    id="email"
                    name="email"
                />
                <MainButton 
                    id='forgot-password'
                    text="Submit"
                />
            </form>
        </>
    );
}