import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import MainButton from "@/components/ui/main-button";
import { headers } from "next/headers";


const getCompanyLIst = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/getCompanyList', { 
            headers: {
                cookie: headers().get("cookie") as string,
            },
            cache: 'force-cache'
        });
        
        if (!response.ok) {
            // Handle response errors
            console.error("Fetch error:", response.statusText);
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Handle network errors or other unexpected errors
        console.error("An error occurred:", error);
        return null;
    }
}

export default async function MeetingForm() {
    const supportOptions = ["Supporting a Company", "Program Moderation", "Goodwill Advising", "Access to Capital", "Advisory Board", "Content Development", "Intake", "Other"]
    const companyList = await getCompanyLIst();
    
    return(
        <form className="flex flex-col gap-4">
           <Select 
                label="Support Type"
                id="supportType"
                name="supportType"
                data={supportOptions}
           />
           <Select 
                label="Company Name*"
                id="companyName"
                name="companyName"
                data={companyList.records}
                searchable={true}
           />
           <div className="flex gap-4">
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
           </div>
           <Textarea label="Notes"/> 
           <MainButton 
                text="Submit"
           />
        </form>
    )
}