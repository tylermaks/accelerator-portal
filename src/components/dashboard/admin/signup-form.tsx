import { signup } from "@/lib/supabase-actions";

export default function SignupForm() {
    return (
        <div className="flex flex-col justify-center items-center">
            <form action={signup} className="w-full flex flex-col gap-6 p-4">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label className="text-sm" htmlFor="email">Email:</label>
                        <input className="border p-1" type="text" name="email" placeholder="Email" required/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label className="text-sm" htmlFor="password">Password:</label>
                        <input className="border p-1" type="password" name="password" placeholder="Password" required/>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm" htmlFor="userType">User Type</label>
                    <select className="border p-1 text-fsGray" name="userType" required>
                        <option value="admin">Admin</option>
                        <option value="mentor">Mentor</option>
                        <option value="company">Company</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label className="text-sm" htmlFor="email">First Name:</label>
                        <input className="border p-1" type="text" name="firstName" placeholder="First Name" required/>
                    </div>
                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label htmlFor="password">Last Name:</label>
                        <input className="border p-1" type="text" name="lastName" placeholder="Last Name" required/>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm" htmlFor="companyName">Company Name</label>
                    <input className="border p-1" type="text" name="companyName" placeholder="Company Name"/>
                </div>

                <button className="bg-orange p-2 text-white" type="submit">Crate New User</button>
            </form>
        </div>
    );
}