import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import AltButton from "@/components/ui/alt-button";
import DeleteButton from "@/components/ui/delete-button";
import { useState, useRef, useCallback, useEffect } from "react";
import { addMeeting, deleteMeeting, updateMeeting } from "@/lib/meeting-actions"

type MeetingFormProps = { 
    toggleModal: (modalData: {}) => void;
    addOptimistic: (newRow: any) => void;
    supportTypeList: [{ Name: number, 'Dropdown Item Name': string, 'Dropdown Type': string[]}];
    companyOptions: string[];
    programOptions: string[];
    data: any;
}


export default function MeetingForm( { toggleModal, addOptimistic, supportTypeList, companyOptions, programOptions, data } : MeetingFormProps) {
    const [clickedButton, setClickedButton] = useState<string>(""); 
    const [resetKey, setResetKey] = useState<number>(0)
    const [supportOptions, setSupportOptions] = useState<MeetingFormProps["supportTypeList"]>();
    const [currentSupportType, setCurrentSupportType] = useState<string>(""); 
    const [companyName, setCompanyName] = useState<string>("")
    const [altName, setAltName] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [duration, setDuration] = useState<string>("")
    const [notes, setNotes] = useState<string>("")
    const formRef = useRef<HTMLFormElement>(null); 
    const { fields } = data
  
    useEffect(() => { 
        setSupportOptions(supportTypeList)

        if(fields && fields.supportType){
            setCurrentSupportType(fields.supportType)
            setCompanyName(fields.companyName)
            setAltName(fields.altName)
            setDate(fields.date)
            setDuration(fields.duration)
            setNotes(fields.notes)
        } else{ 
            setCurrentSupportType(supportTypeList[0]['Dropdown Item Name'])
        }
    }, [fields, supportTypeList])

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


        if (clickedButton === "add-another-meeting") { 
            formRef.current?.reset();
            setResetKey(prevKey => prevKey + 1)
        }

        if (clickedButton === "submit-meeting"){
            await toggleModal({});
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

    const handleUpdateSupportType = useCallback( (newSupportOption: string) => { 
        setCurrentSupportType(newSupportOption);
    }, [])


    const renderConditionalInput = (type : string) => {
        const findCurrentSupportOption = supportOptions?.find((option) => option['Dropdown Item Name'] === currentSupportType)
        const currentDropdownType = findCurrentSupportOption?.["Dropdown Type"][0]

    
        if(currentDropdownType === "Company List"){ 
            return ( 
                <Select 
                    label="Company Name"
                    id="companyName"
                    name="companyName"
                    prepopulate={companyName}
                    optionList={companyOptions}
                    isSearchable={true}
                    isRequired={true}
                    resetKey={resetKey}
                />
            )
        } else if (currentDropdownType === "Program List") { 
            return ( 
                <Select 
                    label="Program Name"
                    id="altName"
                    name="altName"
                    prepopulate={altName}
                    optionList={programOptions}
                    isSearchable={false}
                    isRequired={true}
                    resetKey={resetKey}
                />
            )
        } else { 
            return (
                <Input 
                    label={"Please provide details:"}
                    type="text"
                    id="altName"
                    name="altName"
                    prepopulate={altName}
                    isRequired={true}
                    resetKey={resetKey}
                />
            )
        }
    };
    
    return(
        <form 
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (clickedButton === "delete-meeting") {                    
                    handleDelete();
                    return;
                }

                if (clickedButton === "submit-meeting" || clickedButton === "add-another-meeting") {
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
                prepopulate={currentSupportType} 
                optionList={supportTypeList.map(options => {return options['Dropdown Item Name']})}
                setFormState={handleUpdateSupportType}
                isRequired={true}
           />

           { renderConditionalInput(currentSupportType) }
           
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
                prepopulate={date}
                isRequired={true}
                resetKey={resetKey}
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
                prepopulate={duration}
                isRequired={true}
                resetKey={resetKey}
            />
           
            <Textarea 
                name="notes" 
                label="Notes"
                prepopulate={notes}
                resetKey={resetKey}
            />  
                                    
            <div className="flex gap-4">
                <MainButton 
                    id={fields ? "update-meeting" : "submit-meeting"}
                    text={fields ? "Update" : "Submit"} 
                    action={getButtonID}
                />

                { fields ? (
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