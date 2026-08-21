"use client"

import { useState } from "react"
import { Flag, X } from "lucide-react"
import { authenticatedFetch } from "@/lib/api-client"

interface ReportModalProps {
  type: "post" | "comment"
  targetId: number
  onClose: () => void
}

const REASONS = ["Misinformation", "Offensive", "Spam", "Impersonation", "Other"] as const

export function ReportModal({ type, targetId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<string>("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await authenticatedFetch(`${apiUrl}/reports`, {
        method: "POST",
        body: JSON.stringify({
          reportable_type: type,
          reportable_id: targetId,
          reason,
          description: description.trim() || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        setTimeout(onClose, 2500)
      } else {
        setError(data.message || "Failed to submit report.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Report {type === "post" ? "Candidate Profile" : "Comment"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">Thank you for reporting.</p>
            <p className="text-sm text-gray-500 mt-1">Our moderators will review this content.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Reason *</p>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="report-reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="h-4 w-4 text-red-600 border-gray-300"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Additional details <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in more detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !reason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
