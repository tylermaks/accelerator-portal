import PageHeader from "@/components/ui/page-header";
import WelcomeFAQ from "@/components/dashboard/mentor/FAQ/WelcomeFAQ";
import MeetingTrackerFAQ from "@/components/dashboard/mentor/FAQ/MeetingTrackerFAQ";
import ProfileFAQ from "@/components/dashboard/mentor/FAQ/ProfileFAQ";
import SupportRequestFAQ from "@/components/dashboard/mentor/FAQ/SupportRequestsFAQ";
import TroubleshootingFAQ from "@/components/dashboard/mentor/FAQ/TroubleshootingFAQ";
import FAQDirectoryList from "@/components/dashboard/mentor/FAQ/FAQDirectoryList";

export default async function FAQ() {
    return ( 
        <main className="flex relative">
            <div className="w-[500px] sticky top-0 h-screen overflow-y-auto px-8 py-10">
                <h2>
                    Quick Links
                </h2>
                <FAQDirectoryList />
            </div>

            <div className="w-full mx-auto px-16 shadow-inner-left py-10">
                <PageHeader 
                    title= {"Foresight Advisor Portal Handbook"}
                    subTitle=""
                />
                <WelcomeFAQ />
                <MeetingTrackerFAQ />
                <ProfileFAQ />
                <SupportRequestFAQ />
                <TroubleshootingFAQ />
            </div>
            
        </main>
    );
}