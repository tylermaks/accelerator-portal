import Image from "next/image";
import FAQHighlight from "@/components/ui/faq/FAQHighlight";
import FAQSection from "@/components/ui/faq/FAQSection";
import FAQSubSection from "@/components/ui/faq/FAQSubSection";

export default function ProfileFAQ() { 
    return (
        <FAQSection title="Showcasing your Skills and Expertise" id="profile-section"> 
            <p className="mb-8">
                The Foresight Advisory Platform’s newest feature is the Profile section. 
                This feature will allow you to add, update, and delete your skills and expertise in our database. 
                We use this information while matching you with ventures with our programs. 
            </p>

            <FAQSubSection title="Adding a New Skill or Expertise" id="add-new-skill-expertise"> 
                <p>
                    To add a new skill or expertise to your profile, navigate to the bottom of the page and click on “Add Category”. 
                    This will reveal all the categories that are in our database. 
                    Click on the desired skill or expertise and add the subskills to your profile. 
                    See the image below: 
                </p>
                <div>
                    {/* <Image 
                        className="w-full"
                        src={`https://drive.google.com/uc?export=view&id=${process.env.ADD_SKILL_GIF_ID}`}
                        alt="Add skills example"
                        width={500}
                        height={200}
                    /> */}
                </div>
            </FAQSubSection>

            <FAQSubSection title="Editing or Removing Skills and Expertise" id="edit-remove-skills-expertise">
                <p>
                    Updating your skills and expertise is just as simple. 
                    Hover over the section that you’re interested in updating, and click on “Edit”. 
                    This will allow you to add or remove the subskills from the category. 
                    If you want to remove the category entirely, you may click on the X icon on the left hand side.  
                    See the image below: 
                </p>
                <div>
                    {/* <Image 
                        className="w-full"
                        src={`https://drive.google.com/uc?export=view&id=${process.env.DELETE_SKILL_GIF_ID}`}
                        alt="Add skills example"
                        width={500}
                        height={200}
                    /> */}
                </div>
            </FAQSubSection>

            <FAQHighlight>
                At this time you are unable to update your profile photo in the Foresight Advisor Portal, please contact a program manager if you’d like to submit a new profile photo.
            </FAQHighlight>
        </FAQSection>
    )
}