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
      <div className="flex flex-col gap-4 py-16 w-1/3">
        <h1 className="text-xl font-semibold text-fsGray mb-2 ">You requested to update your password</h1>
        <p className="text-gray-600 mb-6 ">To proceed with resetting your password, please confirm by clicking the button below. If you did not request a password reset, you can safely ignore this message.</p>
        <Link 
          className="p-2 bg-orange text-white p-2 w-1/3 text-center rounded-md" 
          href={url}
        >
          Reset password
        </Link>
      </div>
    </main>
  );
}