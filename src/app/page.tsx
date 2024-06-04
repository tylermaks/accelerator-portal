import SignIn from "@/components/home/signin";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen">
      <SignIn />
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