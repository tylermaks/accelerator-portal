import HomeForm from "@/components/home/home-form";
import Image from "next/image";


export default function Home() {
  return (
    <main className="flex h-screen">
      <div className="flex flex-col items-center w-1/2 p-8">
        <HomeForm />
      </div>
   
      <div className="relative w-1/2">
        <Image 
          src="/images/wind-turbine.jpg" 
          alt="Wind Turbine" 
          layout="fill"
          objectFit="cover"
          className="opacity-80"
        />
      </div>
    </main>
  );
}