import { createUser } from "@/lib/supabase-actions";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

type FormProps = { 
    toggleModal: () => void
}


export default function CreateUserForm( {toggleModal} : FormProps) {

    const handleFormSubmit = (formData: FormData) => { 
        createUser(formData)
        toggleModal()
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <form action={handleFormSubmit} className="w-full flex flex-col gap-6 p-4">
                <div className="flex gap-4">
                    <Input 
                        label="Email"
                        type="text"
                        id="email"
                        name="email"
                    />
                    <Input 
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Select 
                        label="User Type"
                        id="userType"
                        name="userType"
                        optionList={['Mentor', 'Admin', 'Company']}
                    />
                </div>

                <div className="flex gap-4">
                    <Input 
                        label="First Name"
                        type="text"
                        id="firstName"
                        name="firstName"
                    />
                    <Input 
                        label="Last Name"
                        type="text"
                        id="lastName"
                        name="lastName"
                    />
                </div>

                <Input
                    label="Company Name"
                    type="text"
                    id="companyName"
                    name="companyName"
                />

                <button className="bg-orange rounded-md p-2 text-white" type="submit">Create New User</button>
            </form>
        </div>
    );
}