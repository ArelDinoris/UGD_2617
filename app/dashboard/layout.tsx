'use client';
import { useEffect } from "react";
import CenterNav from '@/app/ui/dashboard/centernav';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.background = "linear-gradient(#0D1043, #323693)";
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative"> 
      {/* Sidebar/Navbar */}
      <header className="w-full sticky top-0 z-50 shadow-md">
        <div className="mx-auto h-full px-8 ">
          <CenterNav />
          <div className="border-b border-gray-300 " /> 
        </div>
      </header>

      {/* Konten Utama */}
      <div className="flex-grow pt-6 pb-6 px-6 md:pt-8 md:px-12 overflow-y-auto"> {/* Tambahkan relative dan z-0 */}
        {children}
      </div>
    </div>
  );
}