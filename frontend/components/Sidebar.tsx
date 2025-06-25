"use client";

import { useUser,useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  CheckSquare,
  FolderOpen,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const {signOut}=useClerk()
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Vital Task", icon: Zap, href: "/vital-tasks" },
    { label: "My Task", icon: CheckSquare, href: "/tasks" },
    { label: "Task Categories", icon: FolderOpen, href: "/categories" },
    { label: "Help", icon: HelpCircle, href: "/help" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 w-72 bg-gradient-to-b from-red-400 to-red-500 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:z-auto shadow-xl`}
    >
      {/* Top Close Button (Mobile only) */}
      <div className="flex justify-end lg:hidden p-4">
        <button onClick={onClose} aria-label="Close Sidebar">
          <X className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* User Info */}
        <div className="text-center mb-6">
          <img
            src={user?.imageUrl || "/avatar.png"}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white shadow-md"
          />
          <h2 className="font-semibold text-lg truncate">{user?.fullName || "Guest"}</h2>
          <p className="text-sm text-red-100 truncate">
            {user?.emailAddresses[0]?.emailAddress || "guest@example.com"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition font-medium group
                ${isActive(href)
                ? "bg-white text-red-500 shadow-lg"
                : "text-white hover:bg-white/10 hover:backdrop-blur-md"}`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="p-4 border-t border-red-300/30">
        <button onClick={() => signOut()} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/10 hover:backdrop-blur-md">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
