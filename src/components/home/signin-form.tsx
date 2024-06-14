import Input from "../ui/input";
import MainButton from "../ui/main-button";
import { login } from "@/lib/actions";


export default function SignInForm() {
    return (
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
                text="Sign In"
            />
        </form>
    );
}