import Image from "next/image"
type ProfileNameProps = {
    data: any
}

export default function ProfileName( { data } : ProfileNameProps) {
    return(
        <div className="flex flex-col gap-4 pt-24 relative">
            <img 
                className="rounded-full bg-white z-10 mb-2"
                src={data.Photo[0].url}
                alt="Profile Image"
                width={175}
                height={175}    
            />
            <div className="flex flex-col gap-2 z-10">
                <p className="text-fsGray">{data['EIR Type']}</p>
                <h1 className ="text-4xl font-bold text-fsGray">
                    {data['First Name']} {data['Last Name']}
                </h1>
                <div className="flex  gap-4 w-full">
                    <p className="text-fsGray text-sm">{data.Location}</p>
                    <p className="text-fsGray text-sm">Joined: June 2021</p>
                </div>
            </div>
            <StarComponent />
        </div>
    )
}

const StarComponent = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Image 
          key={i}
          src="/images/star.svg"
          alt="star"
          width={20}
          height={20}
        />
      );
    }
  
    return (
      <div className="flex gap-1 items-end">
        {stars}
        <p className="text-fsGray text-xs">(4.96)</p>
      </div>
    );
  };