"use client"

import { useState } from "react"
import { createUser } from "@/lib/supabase-actions";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";


type FormProps = {
    toggleModal: () => void
}

const initialFormState = {
    email: "",
    password: "",
    userType: "",
    firstName: "",
    lastName: "",
    companyName: ""
};


type FormStateType = typeof initialFormState;

export default function CreateUserForm({ toggleModal }: FormProps) {
    const [formState, setFormState] = useState<FormStateType>(initialFormState);

   
    const handleInputChange = (name: string, value: string) => {
        setFormState((prev:any) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        try {
            await createUser(formState);
            toggleModal();
        } catch (error) {
            // Handle error (e.g., display an error message)
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-6 p-4">
                <div className="flex gap-4">
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        name="email"
                        isRequired={true}
                        prepopulate={formState.email}
                        setFormState={(value) => handleInputChange("email", value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        name="password"
                        isRequired={true}
                        prepopulate={formState.password}
                        setFormState={(value) => handleInputChange("password", value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Select
                        label="User Type"
                        id="userType"
                        name="userType"
                        optionList={['EIR', 'Mentor', 'Admin', 'Company']}
                        isRequired={true}
                        prepopulate={formState.userType}
                        setFormState={(value) => handleInputChange("userType", value)}
                    />
                </div>

                <div className="flex gap-4">
                    <Input
                        label="First Name"
                        type="text"
                        id="firstName"
                        name="firstName"
                        isRequired={true}
                        prepopulate={formState.firstName}
                        setFormState={(value) => handleInputChange("firstName", value)}
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        id="lastName"
                        name="lastName"
                        isRequired={true}
                        prepopulate={formState.lastName}
                        setFormState={(value) => handleInputChange("lastName", value)}
                    />
                </div>

                <Input
                    label="Company Name"
                    type="text"
                    id="companyName"
                    name="companyName"
                    prepopulate={formState.companyName}
                    setFormState={(value) => handleInputChange("companyName", value)}
                />

                <button className="bg-orange rounded-md p-2 text-white" type="submit">Create New User</button>
            </form>
        </div>
    );
}