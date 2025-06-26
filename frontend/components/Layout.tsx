"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-h-screen w-full lg:w-auto">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 bg-gray-50 w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}