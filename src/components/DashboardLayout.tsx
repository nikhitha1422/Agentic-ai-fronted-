import type { ReactNode } from 'react'
import { DashboardNavbar } from './DashboardNavbar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { Navigation } from './Navigation'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle?: string
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      <Navigation />
      {/* Ambient Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <DashboardNavbar pageTitle={pageTitle} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-64 pt-32 min-h-screen relative z-10 font-inter flex flex-col">
          <div className="p-8 pb-10 max-w-7xl mx-auto w-full flex-1">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
