import FAQList from "@/components/ui/faq/FAQList";
import FAQSection from "@/components/ui/faq/FAQSection";
import FAQSubSection from "@/components/ui/faq/FAQSubSection";

const missingVentureBullets= [ 
    "Use the search bar in the Company Dropdown to lookup the company’s legal name they may have been listed in our system under another name",
    "Double check with a program manager that the company you’re looking for is still in the program.",
    "If the company has just started in a new cohort, the program manager may not have updated their current cohort list. In this case, please reach out to the program manager."
]

const missingSupportType = [
    "Consider the existing Support Types <LINK>, which of these best describes the support that you provide",
    "Use the “Other” support type and provide more details in the description and notes section. Program managers have access to the database and may update these manually to match our funding criteria.",
    "Reach out to a program manager to clarify which Support Type is best for the work that is being completed"
]

export default function TroubleshootingFAQ() { 




    return (
        <FAQSection title="Troubleshooting Common Issues" id="troubleshooting-section">
            <FAQSubSection title="A venture is missing form the Venture Dropdown" id="missing-venture">
                <p>
                    The Company Dropdown in the Meeting Tracker is a dynamic list. 
                    The intent is to include all active companies in our program, and exclude companies that are inactive and have left the program. 
                    Therefore, if a company is missing it might be intentional. 
                    Here are some troubleshooting steps:
                    <FAQList list={missingVentureBullets}/>
                </p>
            </FAQSubSection>

            <FAQSubSection title="The Support Type I'm looking for doesn't exist" id="missing-support-type">
                <p>
                    The Support Types listed in the Meeting Tracker are intentionally defined. 
                    They reflect the various categories of funding buckets available to our programs. 
                    Therefore, if the Support Type doesn’t exist in the Meeting Track here are some troubleshooting steps: 
                    <FAQList list={missingSupportType} />
                </p>
            </FAQSubSection>

            <FAQSubSection title="I've found a bug while using the Foresight Advisor Portal" id="found-bug">
                <p>
                    If you experience issues while using the Foresight Advisor Portal please submit a ticket using this form (add link here). 
                    If the issue is urgent, you can contact Tyler Maksymiw directly. Thanks for your patience.
                </p>
            </FAQSubSection>
        </FAQSection>
    )
}