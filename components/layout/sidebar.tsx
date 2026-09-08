"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  TreePine,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice Mode", href: "/practice", icon: BookOpen },
  { name: "Mock Exam", href: "/mock-exam", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-green-950 text-white transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-green-900">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <TreePine className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
            <span className="text-xl font-bold">ForestGuro</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-green-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all",
                  isActive
                    ? "bg-green-700 text-white shadow-md"
                    : "text-slate-300 hover:bg-green-900 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-900">
          <div className="bg-green-900 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-300 mb-1">Board Pass</p>
            <p className="text-xs text-slate-400">Active until Dec 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}
