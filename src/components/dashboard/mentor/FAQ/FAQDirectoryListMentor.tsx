import Link from "next/link"

const directoryStructure = [
    {
        title: "Tracking Your Billable Hours with Foresight",
        link: "#meeting-tracking-section",
        subDirectory: [
            {
                title: "Support Types",
                link: "#support-types"
            },
            {
                title:"Entering Hours in the Meeting Tracker", 
                link: "#entering-hours"
            },
            { 
                title:"Editing and Deleting Records",
                link:"#editing-deleting-records"
            }, 
        ]
    }, 
    {
        title: "Showcasing your Skills and Expertise",
        link: "#profile-section",
        subDirectory: [
            {
                title: "Adding a New Skill or Expertise",
                link: "#add-new-skill-expertise"
            }, 
            { 
                title: "Editing or Removing a Skill or Expertise",
                link: "#edit-remove-skills-expertise"
            }            
        ]
    },
    {
        title:"Finding New Ventures to Support in Foresight Programs",
        link:"#support-request-section",
        subDirectory: []
    }, 
    { 
        title:"Troubleshooting Common Issues",
        link: "#troubleshooting-section", 
        subDirectory: [
            {
                title: "A venture is missing from the venture dropdown",
                link:"#missing-venture"
            },
            {
                title: "The Support Type I'm looking for doesn't exist",
                link:"#missing-support-type"
            },
            {
                title: "I've found a bug while using the Foresight Advisor Portal",
                link: "#found-bug"
            }
        ]
    }
]

export default function FAQDirectoryListMentor() { 
    return (
        <ul className="flex flex-col gap-4 my-8">
            { directoryStructure.map((directoryItem, index) => { 
                return (
                    <li className="flex flex-col gap-3" key={index}>
                        <Link className="text-fsGray font-bold" href={directoryItem.link}>
                            {directoryItem.title}
                        </Link>
                        <ul className="flex flex-col gap-4 ml-8">
                            { directoryItem.subDirectory.map((subList, index) => { 
                                return (
                                    <li className="flex gap-2" key={index}>
                                     
                                        <Link className="text-fsGray flex gap-2" href={subList.link}>
                                            {subList.title}
                                        </Link>
                                        
                                        
                                    </li>
                                )
                            })

                            }
                        </ul>
                    </li>
                )
            })

            }
        </ul>
    )
}