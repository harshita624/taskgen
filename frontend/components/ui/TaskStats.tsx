"use client";

import { useState, useEffect } from "react";
import { Calendar, List, Users, Bell } from "lucide-react";

interface TaskStatsProps {
  todayCount?: number;
  nextSevenDaysCount?: number;
  allTasksCount?: number;
  personalCount?: number;
}

export default function TaskStats({ 
  todayCount = 20,
  nextSevenDaysCount = 0,
  allTasksCount = 0,
  personalCount = 20
}: TaskStatsProps) {
  const [stats, setStats] = useState({
    personal: personalCount,
    work: 0,
    errands: 0,
    wishlist: 0
  });

  const menuItems = [
    {
      icon: Calendar,
      label: "Today",
      count: todayCount,
      id: "today"
    },
    {
      icon: Calendar,
      label: "Next 7 days",
      count: nextSevenDaysCount,
      id: "next7days"
    },
    {
      icon: List,
      label: "All my tasks",
      count: allTasksCount,
      id: "alltasks"
    },
    {
      icon: Settings,
      label: "Settings",
      count: null,
      id: "settings"
    },
    {
      icon: List,
      label: "Lists",
      count: null,
      id: "lists"
    },
    {
      icon: Users,
      label: "Teammates",
      count: null,
      id: "teammates"
    },
    {
      icon: Bell,
      label: "Integrations",
      count: null,
      id: "integrations"
    },
    {
      icon: GraduationCap,
      label: "Learning",
      count: null,
      id: "learning"
    }
  ];

  const listItems = [
    {
      label: "Personal",
      count: stats.personal,
      color: "bg-purple-600",
      id: "personal"
    },
    {
      label: "Work", 
      count: stats.work,
      color: "bg-orange-500",
      id: "work"
    },
    {
      label: "Errands",
      count: stats.errands,
      color: "bg-gray-600",
      id: "errands"
    },
    {
      label: "Wishlist",
      count: stats.wishlist,
      color: "bg-gray-600",
      id: "wishlist"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-red-400/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-red-100" />
              <span className="text-sm text-red-50">{item.label}</span>
            </div>
            {item.count !== null && (
              <span className="bg-red-300/30 text-red-50 text-xs px-2 py-1 rounded-full min-w-[24px] text-center">
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* My Lists Section */}
      <div className="border-t border-red-300/30 pt-4">
        <h4 className="text-red-100 text-sm font-medium mb-3 flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300/30 rounded"></div>
          My Lists
        </h4>
        <div className="space-y-1">
          {listItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-red-400/20 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-red-50">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="text-red-100 text-xs">({item.count})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Missing import fix
import { Settings, GraduationCap } from "lucide-react";