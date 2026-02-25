"use client"
import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/local-storage"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const user = auth.getUser()
    if (!user) {
      router.push("/login")
    }
  }, [router])

  return <>{children}</>
}
