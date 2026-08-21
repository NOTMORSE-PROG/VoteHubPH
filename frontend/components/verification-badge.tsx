"use client"

import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"

interface VerificationBadgeProps {
  status?: string | null
  verifiedAt?: string | null
  method?: string | null
  size?: "sm" | "md"
}

export function VerificationBadge({ status, verifiedAt, method, size = "md" }: VerificationBadgeProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
  const textSize = size === "sm" ? "text-xs" : "text-sm"

  if (status === "verified") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 font-medium ${textSize}`}>
        <ShieldCheck className={`${iconSize} flex-shrink-0`} />
        Verified Official Candidate
        {(method || verifiedAt) && (
          <span className="font-normal text-green-700">
            {method ? `· via ${method}` : ""}
            {verifiedAt ? ` · ${new Date(verifiedAt).toLocaleDateString("en-PH", { month: "short", year: "numeric" })}` : ""}
          </span>
        )}
      </span>
    )
  }

  if (status === "flagged") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 font-medium ${textSize}`}>
        <AlertTriangle className={`${iconSize} flex-shrink-0`} />
        Flagged for Review
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium ${textSize}`}>
      <ShieldAlert className={`${iconSize} flex-shrink-0`} />
      Not Yet Verified
    </span>
  )
}
