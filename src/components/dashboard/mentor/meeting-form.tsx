import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
// import { headers } from "next/headers";
import { useEffect, useState } from "react";
import { addMeeting } from "@/lib/actions";
import { getCompanyList } from "@/lib/actions";




export default function MeetingForm( { addOptimistic } : any) {
    const [companyList, setCompanyList] = useState<any>([]);

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

    const getCompanyData = async () => {
        const data = await getCompanyList();
        setCompanyList(data);
    }

    useEffect(() => {
        getCompanyData();
    }, [])

    const formAction = async (formData : FormData) => {
        const newMeeting = {
            date: formData.get('date'),
            companyName: formData.get('companyName'),
            duration: formData.get('duration'),
            supportType: formData.get('supportType'),
            notes: formData.get('notes'),
        };

        // Optimistically update the UI
        addOptimistic({
            id: Math.random(),
            fields: newMeeting
        });

        await addMeeting(formData);
        // closeModal()
    };
    
    return(
        <form action={formAction} className="flex flex-col gap-6">
           <Select 
                label="Support Type"
                id="supportType"
                name="supportType"
                data={supportOptions}
           />
           <Select 
                label="Company Name"
                id="companyName"
                name="companyName"
                data={companyList.records}
                searchable={true}
           />
            <Input 
                label="Date"
                type="date"
                id="date"
                name="date"
            />
            <Input 
                label="Duration (hrs)"
                type="number"
                id="duration"
                name="duration"
            />
           <Textarea 
                name="notes" 
                label="Notes"
            /> 

            <div className="flex gap-4">
                <MainButton text="Submit"/>
                <MainButton text="Submit and add another" altButton={true}/>
            </div>
        </form>
    )
}