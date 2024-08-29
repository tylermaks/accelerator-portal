"use client"

import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import { useEffect, useState, useRef, useCallback, } from "react";
import { addMeeting, deleteMeeting, updateMeeting } from "@/lib/meeting-actions"

//MAKE THIS DYNAMIC
const supportOptions: string[] = [
    "Supporting a company", 
    "Program Moderation", 
    "Goodwill Advising", 
    "Access to Capital", 
    "Advisory Board", 
    "Content Development", 
    "Intake", 
    "Other"
]

export default function MeetingForm( { toggleModal, addOptimistic, data } : any) {
    const [companyList, setCompanyList] = useState<any>([]);
    const [clickedButton, setClickedButton] = useState<string>("");
    const [supportType, setSupportType] = useState<string>("");
    // const [loading, setLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { fields } = data;
    
    //COME BACK HERE TO FIX
    const getCompanyData = async () => {
        const response = await fetch("/api/getCompanyList", { 
            headers: {
                contentType: "application/json",
                credentials: "include",
            },
            cache: "force-cache"
        });

        if (!response.ok) {
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();
        setCompanyList(data);
    }

    useEffect(() => {
        getCompanyData();
    }, [])

 
    
    const getButtonID = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedButton(event.currentTarget.id);
    };
  
    const handleSubmit = async (formData: FormData) => {
        // setLoading(true);
        const newMeeting = {
            date: formData.get("date"),
            companyName: formData.get("companyName"),
            duration: formData.get("duration"),
            supportType: formData.get("supportType"),
            notes: formData.get("notes")
        }

        addOptimistic({
            id: Math.random(),
            fields: newMeeting
        });

        if (clickedButton === "submit-meeting"){
            await toggleModal();
        } else { 
            formRef.current?.reset();
        }

        try {
            await addMeeting(formData); 
        } catch (error) {
            console.error('Error adding meeting:', error);
        } finally {
            // setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMeeting(data.id);
            toggleModal();
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const handleEdit = async (formData: FormData) => {
        try {
            await updateMeeting(data.id, formData);
            toggleModal();
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    const handleUpdateSupportType = useCallback( () => { 
        setSupportType(currentSupportType);
    }, [supportType])


    //COME BACK TO FIX
    const shouldRenderInput = (type : string) => {
        const supportedTypes = ["Content Development", "Other", "Intake", "Program Moderation"];
        return supportedTypes.includes(type);
    };
    
    const currentSupportType = supportType || fields?.supportType;

    return(
        <form 
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (clickedButton === "delete-meeting") {                    
                    handleDelete();
                    return;
                }

                if (clickedButton === "submit-meeting") {
                    const formData = new FormData(e.currentTarget);
                    handleSubmit(formData as unknown as FormData);
                    return;
                }

                if (clickedButton === "update-meeting") {
                    const formData = new FormData(e.currentTarget);
                    handleEdit(formData as unknown as FormData);
                    return;
                }
            }} 
            className="flex flex-col gap-4 h-full pb-4"
            ref={formRef}
        >

           <Select 
                label="Support Type"
                id="supportType"
                name="supportType"
                prepopulate={fields && fields.supportType} 
                data={supportOptions}
                setFormState={handleUpdateSupportType}
                isRequired={true}
           />
           { shouldRenderInput(currentSupportType) ? (
                <Input 
                    label={`Please provide project name:`}
                    type="text"
                    id="altName"
                    name="altName"
                    prepopulate={fields && fields.altName}
                    isRequired={true}
                />
  
           ) : (
                <Select 
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    prepopulate={fields && fields.companyName}
                    data={companyList.records}
                    searchable={true}
                    isRequired={true}
                />
           )}
           
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
                prepopulate={fields && fields.date}
                isRequired={true}
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
                prepopulate={fields && fields.duration}
                isRequired={true}
            />
           
            <Textarea 
                name="notes" 
                label="Notes"
                prepopulate={fields && fields.notes}
            />  
                                    
            <div className="flex gap-4">
                <MainButton 
                    id={fields ? "update-meeting" : "submit-meeting"}
                    text={fields ? "Update" : "Submit"} 
                    action={getButtonID}
                />
                <MainButton 
                    id={fields ? "delete-meeting" : "add-another-meeting"}
                    text={fields ? "Delete" : "Submit and add another"}
                    altButton={true}
                    warning={fields ? true : false}
                    action={getButtonID}
                />
            </div>
        </form>
    )
}