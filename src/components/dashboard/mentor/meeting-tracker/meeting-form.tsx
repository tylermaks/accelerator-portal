import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import { useState, useRef, useCallback, } from "react";
import { addMeeting, deleteMeeting, updateMeeting } from "@/lib/meeting-actions"

type MeetingFormProps = { 
    toggleModal: (modalData: {}) => void ;
    addOptimistic: (newRow: any) => void;
    supportTypeOptions: string[];
    companyOptions: string[];
    programOptions: string[];
    data: any;
}


export default function MeetingForm( { toggleModal, addOptimistic, supportTypeOptions, companyOptions, programOptions, data } : MeetingFormProps) {
    const [clickedButton, setClickedButton] = useState<string>(""); 
    const [supportType, setSupportType] = useState<string>(""); 
    const formRef = useRef<HTMLFormElement>(null); 
    const { fields } = data
  

    const getButtonID = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedButton(event.currentTarget.id);
    };
  
    const handleSubmit = async (formData: FormData) => {
        const newMeeting = {
            date: formData.get("date"),
            companyName: formData.get("companyName"),
            altName: formData.get("altName"),
            duration: formData.get("duration"),
            supportType: formData.get("supportType"),
            notes: formData.get("notes")
        }

        addOptimistic({
            id: Math.random(),
            fields: newMeeting
        });

        if (clickedButton === "submit-meeting"){
            await toggleModal({});
        } else { 
            formRef.current?.reset();
        }

        try {
            await addMeeting(formData); 
        } catch (error) {
            console.error('Error adding meeting:', error);
        } 
    };

    const handleDelete = async () => {
        try {
            await deleteMeeting(data.id);
            toggleModal({});
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    const handleEdit = async (formData: FormData) => {
        try {
            await updateMeeting(data.id, formData);
            toggleModal({});
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    const handleUpdateSupportType = useCallback( (currentSupportOption: string) => { 
        setSupportType(currentSupportOption);
    }, [])


    const renderConditionalInput = (type : string) => {
        const requireCompanyList = ["Supporting a Company", "Advisory Board Meeting", "Access to Capital", "Goodwill Advising"]

        if(requireCompanyList.includes(type)){ 
            return ( 
                <Select 
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    prepopulate={fields && fields.companyName}
                    optionList={companyOptions}
                    isSearchable={true}
                    isRequired={true}
                />
            )
        } else if (type === "Program Moderation") { 
            return ( 
                <Select 
                    label="Program Name"
                    id="altName"
                    name="altName"
                    prepopulate={fields && fields.altName}
                    optionList={programOptions}
                    isSearchable={false}
                    isRequired={true}
                />
            )
        } else { 
            return (
                <Input 
                    label={"Please provide details:"}
                    type="text"
                    id="altName"
                    name="altName"
                    prepopulate={fields && fields.altName}
                    isRequired={true}
                />
            )
        }
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
                optionList={supportTypeOptions}
                setFormState={handleUpdateSupportType}
                isRequired={true}
           />
           { renderConditionalInput(currentSupportType) }
           
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