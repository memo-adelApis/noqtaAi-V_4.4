"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/subuser/Sidebar';
import Header from '@/components/subuser/Header'; 
import { MoonLoader } from "react-spinners"; // إضافة لودينج خفيف إذا احتجت

export default function SubuserLayoutClient({ children, user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false); // لتجنب مشاكل Hydration

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobile(false);
        setIsSidebarOpen(true);
      } else {
        setIsMobile(true);
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // تجنب الوميض عند التحميل
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100 flex" dir="rtl">
      
      {/* 1. الشريط الجانبي */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)} 
        user={user} // البيانات القادمة من السيرفر (تحتوي على اشتراك المدير)
      />

      {/* 2. المحتوى الرئيسي */}
      <div 
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${!isMobile && isSidebarOpen ? 'mr-64' : 'mr-0'} 
        `}
      >
        <div className="relative z-50">
            <Header user={user} onSidebarToggle={toggleSidebar} />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#14161f] text-gray-200">
          {children}
        </main>
      </div>

      {/* 3. طبقة التعتيم للموبايل */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}