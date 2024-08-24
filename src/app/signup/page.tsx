import { signup } from "@/lib/supabase-actions";

export default function SignUp() {
    return (
        <div className="h-screen px-[450px] flex flex-col justify-center items-center">
            <form action={signup} className="w-full flex flex-col gap-6 border p-4">
                <h1 className="text-3xl">Sign Up</h1>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="email">Email:</label>
                        <input className="border p-1" type="text" name="email" placeholder="Email"/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="password">Password:</label>
                        <input className="border p-1" type="password" name="password" placeholder="Password"/>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="userType">User Type</label>
                    <select className="border p-1 text-fsGray" name="userType">
                        <option value="admin">Admin</option>
                        <option value="mentor">Mentor</option>
                        <option value="company">Company</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="email">First Name:</label>
                        <input className="border p-1" type="text" name="firstName" placeholder="First Name"/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="password">Last Name:</label>
                        <input className="border p-1" type="text" name="lastName" placeholder="Last Name"/>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="companyName">Company Name</label>
                    <input className="border p-1" type="text" name="companyName" placeholder="Company Name"/>
                </div>

                <button className="bg-orange p-2 text-white" type="submit">Sign Up</button>
            </form>
        </div>
    );
}