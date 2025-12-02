// PRIMUS HOME PRO - Dashboard Layout
// M.P.A. (Modern Professional Aesthetic) protected layout

export const dynamic = 'force-dynamic'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutDashboard, Users, Inbox, Settings, Zap, CreditCard, HardHat, Sun, Bell, Search } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - M.P.A. Dark Gray with Amber Accent */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-10 h-10 bg-solar-primary rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold">Primus<span className="text-solar-primary">Home</span>Pro</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <NavLink href="/dashboard/leads" icon={<Users />} label="Leads" />
          <NavLink href="/dashboard/projects" icon={<HardHat />} label="Projects" />
          <NavLink href="/dashboard/automations" icon={<Zap />} label="Automations" />
          <NavLink href="/dashboard/inbox" icon={<Inbox />} label="Inbox" />
          
          <div className="pt-6 mt-6 border-t border-gray-800">
            <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Account</p>
            <NavLink href="/dashboard/billing" icon={<CreditCard />} label="Billing" />
            <NavLink href="/dashboard/settings" icon={<Settings />} label="Settings" />
          </div>
        </nav>
        
        {/* Upgrade Card */}
        <div className="p-4 m-4 bg-gray-800 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-solar-primary" />
            <span className="font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Get unlimited leads and advanced AI features.</p>
          <Link href="/dashboard/billing">
            <button className="w-full py-2 text-sm font-semibold text-white bg-solar-primary hover:bg-solar-primary-dark rounded-lg transition-all duration-200">
              Upgrade Now
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header - M.P.A. Clean */}
        <header className="sticky top-0 z-40 bg-white border-b border-solar-gray-100">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-solar-primary rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-solar-gray-900">Primus<span className="text-solar-primary">Home</span>Pro</span>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-solar-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search leads, projects..." 
                  className="w-full pl-10 pr-4 py-2 bg-solar-gray-50 border border-solar-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-solar-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button 
                className="relative p-2 text-solar-gray-500 hover:text-solar-gray-900 hover:bg-solar-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-solar-danger rounded-full"></span>
              </button>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-solar-gray-100"
                  }
                }}
              />
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-solar-gray-100">
            <MobileNavLink href="/dashboard" label="Dashboard" />
            <MobileNavLink href="/dashboard/leads" label="Leads" />
            <MobileNavLink href="/dashboard/projects" label="Projects" />
            <MobileNavLink href="/dashboard/automations" label="Automations" />
            <MobileNavLink href="/dashboard/billing" label="Billing" />
          </nav>
        </header>

        {/* Page Content */}
        <main className="bg-solar-bg min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}

// Sidebar Navigation Link Component - M.P.A. with Amber Accent Border
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 border-l-2 border-transparent hover:border-solar-primary rounded-r-lg transition-all duration-200 group"
    >
      <span className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      {label}
    </Link>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-1.5 text-sm font-medium text-solar-gray-600 hover:text-solar-primary hover:bg-solar-gray-100 rounded-full whitespace-nowrap transition-colors"
    >
      {label}
    </Link>
  )
}
