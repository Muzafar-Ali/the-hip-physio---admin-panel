// app/dashboard/layout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Dumbbell, FileVideo, Send, Settings, Menu, X, BookHeadphones } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/users', label: 'User Management', icon: Users },
  { href: '/dashboard/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/dashboard/exercise-categories', label: 'Exercise Categories', icon: Dumbbell },
  { href: '/dashboard/educational-videos', label: 'Educational Videos', icon: BookHeadphones },
  { href: '/dashboard/educational-categories', label: 'Educational Categories', icon: BookHeadphones },
  { href: '/dashboard/plans', label: 'Rehab Plans', icon: FileVideo },
  { href: '/dashboard/plan-categories', label: 'Rehab Plan Categories', icon: FileVideo},
  { href: '/dashboard/notifications', label: 'Notifications', icon: Send },
  { href: '/dashboard/settings', label: 'Content', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Image 
          src={"/logo.png"}
          alt="Logo"
          width={40}
          height={40}
          className="mb-2"
        />
        <h1 className="text-xl font-bold  text-[#72B8BE] absolute top-5 left-15">THE HIP PHYSIO</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-brand text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 ">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-800 md:hidden`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 bg-gray-800 text-white md:flex md:flex-col">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white md:hidden">
            Dashboard
          </h2>
          <div className="flex-1" /> {/* Spacer */}
          {/* Add user profile dropdown here later */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}