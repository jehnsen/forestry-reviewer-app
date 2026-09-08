"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import { TreePine, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <TreePine className="w-8 h-8 text-green-700 group-hover:text-green-800 transition-colors" />
            <span className="text-xl font-bold text-slate-900">ForestGuro</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/features"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              About
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">
                Get Board Pass
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/features"
              className="block py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              About
            </Link>
            <div className="pt-3 space-y-2">
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  Get Board Pass
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
