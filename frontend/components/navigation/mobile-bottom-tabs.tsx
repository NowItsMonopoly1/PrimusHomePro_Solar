'use client'

// PRIMUS HOME PRO - Mobile Tab Navigation Component
// Bottom tab bar for one-handed operation on mobile devices

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, Sun } from 'lucide-react'

export function MobileBottomTabs() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="grid grid-cols-4 h-16">
        <MobileTabLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <MobileTabLink href="/dashboard/map" icon={<Sun />} label="Map" />
        <MobileTabLink href="/dashboard/leads" icon={<Users />} label="Leads" />
        <MobileTabLink href="/dashboard/settings" icon={<Settings />} label="Settings" />
      </div>
    </nav>
  )
}

function MobileTabLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
        isActive 
          ? 'text-solar-secondary' 
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      <span className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
        {label}
      </span>
      {isActive && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-solar-secondary rounded-b-full"></span>
      )}
    </Link>
  )
}
