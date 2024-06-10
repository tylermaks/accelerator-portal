import Logout from "@/components/ui/logout";
import { headers } from "next/headers";

const getData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/getTableData', {
            headers: {
                cookie: headers().get("cookie") as string,
            },
            cache: 'no-store'
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
};
export default async function MeetingTracker() {
    const data = await getData();

    return(
        <div>
            <p>Meeting Tracker</p>
            <Logout />
            {
                data?.records.map((item: any) => (
                    <div key={item.id}>
                        <p>{item.fields.companyName}</p>
                    </div>
                ))
            }
        </div>
    )
}