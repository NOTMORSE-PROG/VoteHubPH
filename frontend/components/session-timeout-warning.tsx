"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { Clock } from "lucide-react"

const WARNING_MS = 25 * 60 * 1000  // 25 min
const LOGOUT_MS  = 30 * 60 * 1000  // 30 min
const POLL_MS    = 60 * 1000       // check every 60s
const STORAGE_KEY = "lastActivity"

export function SessionTimeoutWarning() {
  const { status } = useSession()
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(5 * 60)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const resetActivity = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    }
  }, [])

  const getIdleMs = useCallback(() => {
    if (typeof window === "undefined") return 0
    const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10)
    if (!last) return 0
    return Date.now() - last
  }, [])

  const handleStaySignedIn = () => {
    resetActivity()
    setShowWarning(false)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  // Register activity listeners
  useEffect(() => {
    if (status !== "authenticated") return
    resetActivity()
    const events = ["mousemove", "keydown", "click", "touchstart"]
    const onActivity = () => resetActivity()
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    return () => events.forEach((e) => window.removeEventListener(e, onActivity))
  }, [status, resetActivity])

  // Poll for idle state
  useEffect(() => {
    if (status !== "authenticated") return

    pollRef.current = setInterval(async () => {
      const idle = getIdleMs()
      if (idle >= LOGOUT_MS) {
        if (countdownRef.current) clearInterval(countdownRef.current)
        await signOut({ callbackUrl: "/login" })
        return
      }
      if (idle >= WARNING_MS && !showWarning) {
        const remaining = Math.ceil((LOGOUT_MS - idle) / 1000)
        setSecondsLeft(remaining)
        setShowWarning(true)
        countdownRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              if (countdownRef.current) clearInterval(countdownRef.current)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }, POLL_MS)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [status, showWarning, getIdleMs])

  if (!showWarning || status !== "authenticated") return null

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const countdown = `${mins}:${String(secs).padStart(2, "0")}`

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl shadow-lg px-5 py-3 max-w-sm w-full">
      <Clock className="h-5 w-5 flex-shrink-0 text-amber-600" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Session expiring in {countdown}</p>
        <p className="text-xs text-amber-700">You'll be logged out due to inactivity.</p>
      </div>
      <button
        onClick={handleStaySignedIn}
        className="flex-shrink-0 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700"
      >
        Stay signed in
      </button>
    </div>
  )
}
