import Image from "next/image";
import VerifyOTPForm from "@/components/home/verify-otp-form";

export default function ResetPassword() {
    return (
      <main className="flex flex-col items-center h-screen">
        <div className="w-1/3">
          <Image 
            className="pt-8"
            src="/images/company-logo.png" 
            width={175} 
            height={175} 
            alt="logo" 
          />
        </div>
       <VerifyOTPForm />
      </main>
    );
}