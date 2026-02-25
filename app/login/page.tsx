"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { auth } from "@/lib/local-storage"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "signin") {
        const { user, error } = await auth.signIn(email, password)
        if (error) throw new Error(error)
        toast({ title: "Welcome back!", description: "Signed in successfully." })
        router.push("/dashboard")
      } else {
        const { user, error } = await auth.signUp(email, password)
        if (error) throw new Error(error)
        toast({
          title: "Account created!",
          description: "You can now access the dashboard.",
        })
        router.push("/dashboard")
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-balance">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
          <CardDescription>College Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" disabled={loading} className="bg-teal-600 text-white hover:bg-teal-700">
              {loading
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating..."
                : mode === "signin"
                  ? "Sign in"
                  : "Sign up"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
