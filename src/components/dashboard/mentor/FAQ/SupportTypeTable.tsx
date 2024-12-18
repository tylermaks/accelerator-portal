const supportTypeData = [
    {
        title: "Supporting a Company",
        description: "Supporting a company includes all  1:1 meetings that you have with a Foresight venture. The content of these meetings must be related to the venture's progress within Foresight's programs. It does not include any social calls, emails, research, and other prep work as these activities are not billable."
    }, 
    { 
        title: "Program Moderation",
        description: "Program moderation is any activity in which you directly support Foresight programs. This includes leading programs sessions, participating in program prep meetings, providing feedback at Foresight pitch events, and others. This does not include attending any events where you are just a guest or participant. If you are not sure about whether an event qualifies program support please ask a program manager for clarification."
    }, 
    { 
        title: "Advisory Board Meeting",
        description: "Advisory Board Meetings (ABMs) are quarterly, invite-only meetings in which three EIRs evaluate a company’s progress. Only the duration of the meeting is billable. Prep time will require you to meet with the venture and can be billed under Support a Company."
    }, 
    { 
        title: "Content Development", 
        description: "Content Development includes all support generating content for Foresight’s programs, learning management system, etc. This Support Type only applies to you if you’ve been approached by a member of Foresight staff to create content. "
    }, 
    { 
        title: "Intakes",
        description: "Intakes are invite-only meetings in which EIRs evaluate the suitability of incoming ventures for Foresight’s Programs."
    }, 
    { 
        title: "Other", 
        description: "The other Support Type is meant for work that doesn’t fit into any of the other categories. Before using this Support Type please confirm with a program manager that this is the appropriate Support Type. "
    }
]





export default function SupportTypeTable() { 
    const tableHeadStyles = "bg-teal-md text-white text-bold p-4"
    const tableRowStyles = "p-4 pb-8 align-top border border-gray-300"

    return (
        <table className="w-full table table-compact table-auto text-left ">
            <thead>
                <tr>
                    <th className={`w-[33%] ${tableHeadStyles}`}>Support Type</th>
                    <th className={tableHeadStyles}>Description</th>
                </tr>
            </thead>
            <tbody>
                {supportTypeData.map((supportType, index) => { 
                    return (
                        <tr key={index}>
                            <td className={tableRowStyles}>{supportType.title}</td>
                            <td className={tableRowStyles}>{supportType.description}</td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table>
    )
}