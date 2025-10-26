"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, Lock, Globe, HelpCircle, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { T } from "@/components/auto-translate"

export default function SettingsPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [notifications, setNotifications] = useState(true)
  const [anonymousVoting, setAnonymousVoting] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications !== null) {
      setNotifications(JSON.parse(savedNotifications))
    }

    const savedAnonymousVoting = localStorage.getItem("anonymousVoting")
    if (savedAnonymousVoting !== null) {
      setAnonymousVoting(JSON.parse(savedAnonymousVoting))
    }
  }, [])

  const toggleNotifications = () => {
    const newValue = !notifications
    setNotifications(newValue)
    localStorage.setItem("notifications", JSON.stringify(newValue))
  }

  const toggleAnonymousVoting = () => {
    const newValue = !anonymousVoting
    setAnonymousVoting(newValue)
    localStorage.setItem("anonymousVoting", JSON.stringify(newValue))
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "en" | "fil")
  }

  const handleDeleteAccount = () => {
    // Clear all user data from localStorage
    localStorage.clear()
    // In a real app, you would also make an API call to delete the account from the backend
    // For now, we'll just redirect to the home page
    alert("Your account has been deleted. All data has been removed.")
    router.push("/")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold"><T>Settings</T></h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <T>Notifications</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium"><T>Election Alerts</T></p>
                  <p className="text-sm text-muted-foreground"><T>Get notified about upcoming elections and important dates</T></p>
                </div>
                <Button variant={notifications ? "default" : "outline"} onClick={toggleNotifications} className="gap-2">
                  {notifications ? <T>Enabled</T> : <T>Disabled</T>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <T>Language</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium"><T>Preferred Language</T></p>
                  <p className="text-sm text-muted-foreground">{language === "en" ? "English" : "Filipino"}</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="en">English</option>
                  <option value="fil">Filipino</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <T>Privacy & Security</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium"><T>Anonymous Voting</T></p>
                  <p className="text-sm text-muted-foreground"><T>Hide your identity when voting in community polls</T></p>
                </div>
                <Button
                  variant={anonymousVoting ? "default" : "outline"}
                  onClick={toggleAnonymousVoting}
                  className="gap-2"
                >
                  {anonymousVoting ? <T>Enabled</T> : <T>Disabled</T>}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive"><T>Delete Account</T></p>
                    <p className="text-sm text-muted-foreground"><T>Permanently delete your account and all data</T></p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <T>Delete</T>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <T>Help & Support</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong><T>Version</T>:</strong> 1.0.0
                </p>
                <p className="text-sm text-muted-foreground"><T>VoteHubPH - Your voice shapes the future of the Philippines</T></p>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <T>Contact Support</T>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-destructive"><T>Delete Account</T></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm"><T>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</T></p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <T>Cancel</T>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <T>Confirm Delete</T>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
