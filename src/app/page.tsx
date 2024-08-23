import SignIn from "@/components/home/signin";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen">
      <div className="flex flex-col items-center w-1/2 p-8">
        <SignIn />
        <Link href="/forgotpassword" className="text-fsGray text-sm hover:underline">Forgot password?</Link>
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