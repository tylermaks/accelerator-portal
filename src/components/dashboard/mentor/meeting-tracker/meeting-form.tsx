import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import AltButton from "@/components/ui/alt-button";
import DeleteButton from "@/components/ui/delete-button";
import { useState, useRef, useEffect, useMemo } from "react";
import { addMeeting, deleteMeeting, updateMeeting } from "@/lib/meeting-actions"

type MeetingFormProps = { 
    toggleModal: (modalData: {}) => void;
    addOptimistic: (newRow: any) => void;
    supportTypeList: [{ Name: number, 'Dropdown Item Name': string, 'Dropdown Type': string[]}];
    companyOptions: string[];
    programOptions: string[];
    meetingObjectiveOptions: string[];
    data: any;
}

const initializeFields = (fields: any, supportTypeList: MeetingFormProps["supportTypeList"]) => ({
    supportType: fields?.supportType || supportTypeList[0]['Dropdown Item Name'],
    companyName: fields?.companyName || "",
    altName: fields?.altName || "",
    date: fields?.date || "",
    duration: fields?.duration || "",
    meetingObjective: fields?.meetingObjective || "",
    notes: fields?.notes || "",
});


export default function MeetingForm( { toggleModal, addOptimistic, supportTypeList, companyOptions, programOptions, meetingObjectiveOptions, data } : MeetingFormProps) {
    const [formState, setFormState] = useState(() => initializeFields(data.fields, supportTypeList));
    const [clickedButton, setClickedButton] = useState<string>(""); 
    const supportOptions = useMemo(() => supportTypeList, [supportTypeList]);

    const handleInputChange = (name: string, value: string) => {
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const getButtonID = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedButton(event.currentTarget.id);
    };
  
    const handleSubmit = async () => {
        const newMeeting = { ...formState };

        if (!newMeeting.companyName) {
            newMeeting.companyName = "Foresight";
        }

        addOptimistic({ id: Math.random(), fields: newMeeting });


        if (clickedButton === "add-another-meeting") { 
            setFormState(() => initializeFields({}, supportOptions));
        }

        if (clickedButton === "submit-meeting"){
            await toggleModal({});
        } 

        try {
            await addMeeting(newMeeting); 
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

    const handleEdit = async () => {
        try {
            await updateMeeting(data.id, formState);
            toggleModal({});
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };


    const currentDropdownType = useMemo(() => {
        const option = supportOptions.find((opt) => opt["Dropdown Item Name"] === formState.supportType);
        return option?.["Dropdown Type"][0] || "";
    }, [supportOptions, formState.supportType]);


    const renderConditionalInput = () => {
        switch (currentDropdownType) {
          case "Company List":
            return (
              <Select
                label="Company Name"
                id="companyName"
                name="companyName"
                prepopulate={formState.companyName}
                setFormState={(value) => handleInputChange("companyName", value)}
                optionList={companyOptions}
                isSearchable
              />
            );
          case "Program List":
            return (
              <Select
                label="Program Name"
                id="altName"
                name="altName"
                prepopulate={formState.altName}
                setFormState={(value) => handleInputChange("altName", value)}
                optionList={programOptions}
                isSearchable={false}
                isRequired
              />
            );
          default:
            return (
              <Input
                label={formState.supportType === "Content Development" ? "Please provided project name:" : "Please provided company name:"}
                type="text"
                id="altName"
                name="altName"
                prepopulate={formState.altName}
                setFormState={(value) => handleInputChange("altName", value)}
                isRequired
              />
            );
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (clickedButton === "delete-meeting") return handleDelete();
        if (clickedButton === "update-meeting") return handleEdit();
        handleSubmit();
    };
    
    return(
        <form 
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 h-full pb-4"
        >

            <Select
                label="Support Type"
                id="supportType"
                name="supportType"
                prepopulate={formState.supportType}
                optionList={supportTypeList.map((opt) => opt["Dropdown Item Name"])}
                setFormState={(value) => handleInputChange("supportType", value)}
                isRequired
            />

           { renderConditionalInput() }
           { (formState.supportType === "Supporting a company" || formState.supportType === "Goodwill Advising") &&
                <Select
                   label="Meeting Objective"
                   id="meetingObjective"
                   name="meetingObjective"
                   prepopulate={formState.meetingObjective}
                   setFormState={(value) => handleInputChange("meetingObjective", value)}
                   optionList={meetingObjectiveOptions}
                 />
           }
           
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
                prepopulate={formState.date}
                setFormState={(value) => handleInputChange("date", value)}
                isRequired
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
                prepopulate={formState.duration.toString()}
                setFormState={(value) => handleInputChange("duration", value)}
                isRequired
            />
           
            <Textarea 
                label="Notes"
                name="notes" 
                prepopulate={formState.notes}
                setFormState={(value) => handleInputChange("notes", value)}
            />  
                                    
            <div className="flex gap-4">
                <MainButton
                    id={data.fields ? "update-meeting" : "submit-meeting"}
                    text={data.fields ? "Update" : "Submit"}
                    action={getButtonID}
                />
                { data.fields ? (
                    <DeleteButton 
                        id="delete-meeting"
                        text="Delete"
                        action={getButtonID}
                    />
                ) : (
                    <AltButton 
                        id="add-another-meeting"
                        text="Submit and add another"
                        action={getButtonID}
                    />
                )}
            </div>
        </form>
    )
}