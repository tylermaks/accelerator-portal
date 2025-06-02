"use client"

import { useState } from "react"
import { createUser } from "@/lib/admin-actions";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { z } from "zod";


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

const createUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    userType: z.string().min(1, "User type is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().optional(),
  });


type FormStateType = typeof initialFormState;

export default function CreateUserForm({ toggleModal }: FormProps) {
    const [formState, setFormState] = useState<FormStateType>(initialFormState);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
   
    const handleInputChange = (name: string, value: string) => {
        setFormState((prev:any) => ({ ...prev, [name]: value }));
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            createUserSchema.parse(formState);
            await createUser(formState);
            setSuccessMessage("User created successfully");
            setTimeout(() => {
                setSuccessMessage("");
                toggleModal();
            }, 1500);
            setFormState(initialFormState);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setErrorMessage(error.errors.map(e => e.message).join(", "));
                } else {
                setErrorMessage(error?.message || "Error creating user");
            }
        } finally {
            setIsLoading(false);
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

                <button 
                    className="bg-orange rounded-md p-2 text-white" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create New User"}
                </button>
            </form>

            { successMessage && (
                <p data-message="user-created-success" className="text-xs text-green-500">
                    {successMessage}
                </p>
            )}
            { errorMessage && ( 
                <p data-message="user-created-error" className="text-xs text-red-500">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}