"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Demo Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Since this app uses localStorage (no external integrations), you can reset all data here.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.clear()
                toast({ title: "Reset complete", description: "All local data cleared." })
              }}
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
