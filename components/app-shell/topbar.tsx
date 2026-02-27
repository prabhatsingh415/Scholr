"use client"
import { useEffect, useState } from "react"
import { auth, User } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
// Note: Lucide ke 'User' icon ko 'UserIcon' ka naam de diya hai taaki type User se clash na ho
import { Bell, Search, User as UserIcon } from "lucide-react" 

export default function Topbar() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Safe way to load user from local storage in Next.js
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(auth.getUser())
  }, [])

  const signOut = async () => {
    const { error } = await auth.signOut()
    if (error) {
      toast({ title: "Sign out failed", description: error, variant: "destructive" })
      return
    }
    toast({ title: "Signed out", description: "See you soon!" })
    router.push("/login")
  }

  // Role ko format karna
  const displayRole = user?.role === "teacher" 
    ? "Faculty" 
    : user?.role === "student" 
      ? "Student" 
      : "Admin"

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Dynamic Welcome Message */}
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome back, {user ? displayRole : "..."}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-teal-600" />
              </div>
              {/* Dynamic Email */}
              <span className="text-sm font-medium text-gray-700">
                {user?.email || "..."}
              </span>
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 bg-transparent"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}