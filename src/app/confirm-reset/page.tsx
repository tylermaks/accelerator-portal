"use client"

import { useEffect, useState } from 'react'
import Image from "next/image";
import Link from "next/link";

export default function ConfirmReset() {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathName = window.location.search;
      const urlParams = new URLSearchParams(pathName);
      const pathUrl = urlParams?.get('url');
      if (typeof pathUrl === 'string') {
        setUrl(pathUrl);
      }
    }
  }, []);

  return (
    <main className="flex h-screen">
      <div className=" w-1/2 p-8">
        <Image 
          src="/images/company-logo.png"
          alt="Foresight Logo"
          width={100}
          height={50}
        />
        <div className="flex flex-col gap-8 pt-28 pb-8 px-32 items-center justify-center">
          <h1 className="text-xl font-semibold text-fsGray mb-2 text-center">Confirm password reset</h1>
          <p className="text-gray-600 mb-6 text-center">To proceed with resetting your password, please confirm by clicking the button below.</p>
          <Link 
            className="p-2 bg-orange text-white p-2 w-1/3 text-center rounded-md" 
            href={url}
          >
            Reset password
          </Link>
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