import Image from "next/image"

type ProfileNameProps = {
    data: any
}

export default function ProfileName( { data } : ProfileNameProps) {
    const profilePic = data.Photo && data.Photo[0].url

    return(
        <div className="flex flex-col gap-4 pt-24 relative">
            { data.Photo ? (
                <Image 
                    className="rounded-full h-[175px] w-[175px] bg-gray-400 mb-2"
                    src={profilePic ? data.Photo[0].url : "/images/user-icon.svg"}
                    alt="Profile Image"
                    width={175}
                    height={175}   
                />
            ) : (
                <div className="relative bg-white h-[170px] w-[170px] border border-fsGray border-8 rounded-full overflow-hidden">

                    <Image
                        className="absolute left-0 right-0 top-6"
                        src={"/images/person-icon.svg"}
                        alt="Profile Image"
                        width={175}
                        height={175}   
                    />
                </div>
            )}
            
            <div className="flex flex-col gap-2 z-10">
                <p className="text-fsGray">{data['Advisor Type']}</p>
                <h1 className ="text-4xl font-bold text-fsGray">
                    {data['Record_EIR/Mentor Name']}
                </h1>
                <div className="flex  gap-4 w-full">
                    <p className="text-fsGray text-sm">{data.Location}</p>
                    <p className="text-fsGray text-sm">Joined: {data.Joined}</p>
                </div>
            </div>
        </div>
    )
}