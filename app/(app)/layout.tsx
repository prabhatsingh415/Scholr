"use client"

import type { ReactNode } from "react"
import Sidebar from "@/components/app-shell/sidebar"
import Topbar from "@/components/app-shell/topbar"
import { Toaster } from "@/components/ui/toaster"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Topbar />
          <main className="p-6 bg-gray-50 min-h-[calc(100vh-73px)]">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
