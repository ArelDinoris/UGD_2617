'use client';
import { useEffect, useState } from "react";
import SideNav from '@/app/ui/dashboard/sidenav';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    document.body.style.background = "linear-gradient(#0D1043, #323693)";

    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

      setCurrentDate(now.toLocaleDateString('en-US', options));
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateDateTime(); // Update immediately
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []); 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Horizontal Top Bar */}
      <div className="bg-[#303477] px-3 py-4 shadow-sm">
        <div className="flex items-center justify-between w-full"> {/* Container utama */}
            {/* Bagian Kiri */}
            <div className="flex items-center gap-6">
              <h1 className="text-4xl font-bold text-white">Bazeus</h1> 
            </div>
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-white">Hi Cashier, Have a nice day!</p>
            </div>
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-white">{currentDate}</p>
            </div>
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-white">{currentTime}</p>
            </div>
            {/* Bagian Kanan */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-8">
                <div className="relative w-20 h-16 rounded-lg bg-gray-200 overflow-hidden">
                  <Image
                    src="/team.png"
                    alt="Profile"
                    width={80}  
                    height={64} 
                    className="object-cover rounded-lg mt-0" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-medium text-white">Dinoris Dinoris</span>
                <span className="text-xl text-white">Cashier</span>
              </div>
            </div>
        </div>
        {/* Border full width below the text */}
        <div className="w-full border-b-2 border-white mt-2"></div>
      </div>

      {/* Main Content with SideNav */}
      <div className="flex flex-1">
        {/* Vertical Side Navigation */}
        <div className="hidden md:block w-64 bg-[#303477] shadow-sm rounded-lg">
          <SideNav />
        </div>   
        {/* Page Content */}
        <div className="flex-1 p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}