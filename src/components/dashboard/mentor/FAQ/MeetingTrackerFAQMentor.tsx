import FAQSection from "@/components/ui/faq/FAQSection";
import FAQSubSection from "@/components/ui/faq/FAQSubSection";
import FAQDetails from "@/components/ui/faq/FAQDetails";
import FAQHighlight from "@/components/ui/faq/FAQHighlight";
import SupportTypeTable from "./SupportTypeTable";
import Image from "next/image";

export default function MeetingTrackerFAQMentor() { 
    return(
        <FAQSection title={"Tracking Your Hours with Foresight"} id={"meeting-tracking-section"}>
            <p className="mb-8">
                One of the main features of the Foresight Advisor Portal is tracking the support you provide to the ventures in Foresight&rsquo;s programs. 
                The meeting data you provide allows our program managers to accurately track venture participation in programs, enhance our programs over time, and efficiently allocate our funding to the various programs. 
                Therefore, your support in providing you meeting data is greatly appreciated, please record your meetings on a regular basis.
            </p>

            <FAQSubSection title="Support Types" id="support-types">
                <p>
                    Support Types are the categories of EIR work at Foresight. 
                    You will be required to provide the Support Type while logging your work in the Meeting Tracker, 
                    so it is important that you understand when it is appropriate to use each type.
                </p>
                <p>
                    <strong>Example:</strong> If you have been assigned a new venture currently enrolled in Foresight&rsquo;s Launch & Deliver program. 
                    Any time that you spend working 1-on-1 coaching the founders of your assigned venture should be logged under &rsquo;Supporting a Company&rsquo; and <strong>not</strong> under
                    &rsquo;Program Moderation&rsquo;. 
                </p>
                <SupportTypeTable />
            </FAQSubSection>

            <FAQSubSection title="Entering Hours in the Meeting Tracker" id="entering-hours">
                <p>
                    With that in mind, we have made logging hours in the Meeting Tracker as simple as possible. 
                    As shown in the image below you can simply hit the “Add Meeting” button in the top-right corner and add the meeting details. 
                </p>
                <div>
                    ADD GIF HERE
                </div>
                <FAQDetails title="Company Dropdown" id="company-dropdown">
                    <p>
                        The ventures listed in the company dropdown are members of current and previous cohorts. 
                        Over time, companies that are no longer involved with our programs will be removed from this list. 
                        This is intentional to ensure that we do not allocate funds towards companies no longer in our programs. 
                    </p>
                    <FAQHighlight>
                        If you believe that a company is missing from our company dropdown list, please try using the search bar using the companies legal name. 
                        If you are certain you cannot find the company please contact a program manager for more information as there may be a reason they are not included in the list.
                    </FAQHighlight>
                </FAQDetails>
                <FAQDetails title="Meeting Notes" id="meeting-notes">
                    <p>
                        When you are logging your hours you will be asked to provide some notes on the meeting. 
                        <strong>Please keep your notes brief and do not include any sensitive information. </strong>
                    </p>
                </FAQDetails>
            </FAQSubSection>

            <FAQSubSection title="Editing and Deleting Records" id="editing-deleting-records">
                <p>
                    In the event that you want to update or remove one of the meetings that you have logged in the Meeting Tracker, you can click the <Image className="inline" src="/images/open-icon.svg" alt="Open icon" height={20} width={20} />
                    icon located on the right-hand side of the row of data that you would like to update. 
                </p>
                <div>
                    ADD GIF HERE
                </div>
            </FAQSubSection>
        </FAQSection>
    )
}