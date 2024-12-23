import Image from "next/image";
import { Suspense } from 'react'
import ResetPasswordForm from "@/components/home/reset-password-form";


export default function ResetPassword() {
    return (
      <main className="flex h-screen">
        <div className="w-1/2 p-8">
          <Image 
            src="/images/company-logo.png" 
            width={100} 
            height={50} 
            alt="logo" 
          />
          <div className="flex flex-col gap-8 p-20 items-center justify-center">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
        <div className="relative w-1/2">
          <Image 
            src="/images/wind-turbine.jpg"
            alt="Wind Turbine" 
            fill={true}
            style={{objectFit: "cover"}}
            className="opacity-80"
          />
        </div>
      </main>
    );
}