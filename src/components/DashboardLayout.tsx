
import type { ReactNode } from 'react'
import { DashboardNavbar } from './DashboardNavbar'
import { Sidebar } from './Sidebar'
interface DashboardLayoutProps {
  children: ReactNode
  pageTitle?: string
}
export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <DashboardNavbar pageTitle={pageTitle} />
      <Sidebar />
      <main className="ml-64 pt-16 min-h-screen relative z-10 font-inter">
        <div className="p-8 pb-20 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
