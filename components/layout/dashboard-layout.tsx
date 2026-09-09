"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import UserMenu from "./user-menu";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-slate-900">Forester Licensure Reviewer</h1>
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
