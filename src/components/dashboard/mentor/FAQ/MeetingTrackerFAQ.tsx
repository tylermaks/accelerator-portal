import FAQSection from "@/components/ui/faq/FAQSection";
import FAQSubSection from "@/components/ui/faq/FAQSubSection";
import FAQDetails from "@/components/ui/faq/FAQDetails";
import FAQList from "@/components/ui/faq/FAQList";
import FAQHighlight from "@/components/ui/faq/FAQHighlight";
import SupportTypeTable from "./SupportTypeTable";
import Image from "next/image";

export default function MeetingTrackerFAQ() { 
    return(
        <FAQSection title={"Tracking Your Billable Hours with Foresight"} id={"meeting-tracking-section"}>
            <p className="mb-8">
                One of the main features of the Foresight Advisor Portal is tracking the support you provide to the ventures in Foresight's programs. 
                The meeting data you provide allows our program managers to accurately track venture participation in programs, enhance our programs overtime, and efficiently allocate our funding to the various programs. 
                Therefore, your support in providing you meeting data is greatly appreciated, please record your meetings on a regular basis.
            </p>

            <FAQSubSection title="Submitting an Invoice" id="submitting-an-invoice">
                <p>
                    At the end of each month you are entitled to submit an invoice to Foresight for your support of our ventures and programs. 
                    The invoice must be sent to accounting@foresightcac.com.
                </p>
                <FAQHighlight>
                    <p>
                        Invoices are due by the 10th of each month for work completed in the previous month. 
                        All invoices submitted after the 10th of the month will be deferred to the following month. 
                        Invoices submitted on time will be paid out on the last business day of the month.
                    </p>   
                </FAQHighlight>
                <p>
                    <strong>The hours on your invoice must match the hours that are logged in Meeting Tracker.</strong>
                    Otherwise, we are unable to allocate our program funding to pay out your invoice. 
                    To ensure that you are identifying the correct program in the Meeting Tracker, we have defined several Support Types help in this process.
                </p>
            </FAQSubSection>

            <FAQSubSection title="Support Types" id="support-types">
                <p>
                    Support Types are the categories of EIR work at Foresight. 
                    You will be required to provide the Support Type while logging your work in the Meeting Tracker, 
                    so it is important that you understand when it is appropriate to use each type.
                </p>
                <SupportTypeTable />
            </FAQSubSection>

            <FAQSubSection title="Entering Hours in the Meeting Tracker" id="entering-hours">
                <p>
                    In order to submit your invoice at the end of each month you must first log your hours in the Meeting Tracker. 
                    We appreciate that this may seem duplicative in some instances, but having an organized database of venture support allows us to maintain our records in case of an audit. 
                </p>
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
                        Overtime, companies that are no longer involved with our programs will be removed from this list. 
                        This is intentional to ensure that we do not allocate funds towards companies no longer in our programs. 
                    </p>
                    <FAQHighlight>
                        <p>
                            If you believe that a company is missing from our company dropdown list, please try using the search bar using the companies legal name. 
                            If you are certain you cannot find the company please contact a program manager for more information as there may be a reason they are not included in the list.
                        </p>
                    </FAQHighlight>
                </FAQDetails>
                <FAQDetails title="Meeting Notes" id="meeting-notes">
                    <p>
                        When you’re logging your hours you’ll be asked to provide some notes on the meeting. 
                        <strong>Please keep your notes brief and do not include any sensitive information. </strong>
                    </p>
                </FAQDetails>
            </FAQSubSection>

            <FAQSubSection title="Editing and Deleting Records" id="editing-deleting-records">
                <p>
                    In the event that you want to update or remove one of the meetings that you have logged in the Meeting Tracker, you can click the <Image className="inline" src="/images/open-icon.svg" alt="Open icon" height={20} width={20} />
                    icon located on the right-hand side of the row of data that you’d like to update. 
                </p>
                <div>
                    ADD GIF HERE
                </div>
            </FAQSubSection>
           
           <FAQSubSection title="Reports" id="reports">
                <p>
                    In the Reports tab you can view a monthly summary of the hours you have logged and an estimate for your invoice. 
                    Reviewing this summary each month before submitting your invoice will help ensure that you have provided accurate information; 
                    this helps our accounting team streamline their work. 
                </p>
                <FAQHighlight>
                    The invoice estimate is not a valid invoice. Please provide an invoice using your own invoicing system or use this template.
                </FAQHighlight>
           </FAQSubSection>
        </FAQSection>
    )
}