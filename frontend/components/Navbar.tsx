"use client";

import { LayoutDashboard, Search, Bell, MessageSquare, Menu } from "lucide-react";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isSignedIn } = useUser();

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <nav className="bg-white shadow-sm border-b px-4 py-3 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-red-500">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-red-500 hidden sm:flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm text-gray-600 text-right">
          <span className="font-medium">{currentDate.split(",")[0]}</span>
          <br />
          <span className="text-xs">{currentDate.split(", ")[1]}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Buttons */}
        {!isSignedIn ? (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        ) : (
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        )}
      </div>
    </nav>
  );
}
