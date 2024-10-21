import FAQSection from "@/components/ui/faq/FAQSection";
import FAQDirectoryList from "./FAQDirectoryList";

export default function WelcomeFAQ(){ 
    return ( 
        <FAQSection title={"Welcome!"} id={"welcome"}>
            <p>
                Welcome to the Foresight Advisor Portal! As a Foresight advisor, this platform offers you the opportunity to engage with the ventures within Foresight's program. 
                You will have access to a range of key features designed to facilitate collaboration and enhance your experience. 
                This includes: 
            </p>
            <p>
                The purpose of this FAQ is to equip you with the knowledge you need to effectively utilize these tools. 
                Throughout the text, you’ll find highlighted links that will guide you to relevant sections for easy navigation.
            </p>
        </FAQSection>
    )
}