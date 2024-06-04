import Input from "../ui/input";
import MainButton from "../ui/main-button";


export default function SignInForm() {
    return (
        <form action="/auth/login" method="POST" className="flex flex-col gap-4 w-full">   
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