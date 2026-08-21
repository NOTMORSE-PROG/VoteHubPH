"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { CheckCircle, XCircle, Clock, Loader2, User, Shield, ChevronDown, ChevronUp, RefreshCw, Users, AlertCircle, ShieldCheck, AlertTriangle, Flag, FileText, MessageSquare } from "lucide-react"

interface Post {
  id: number
  user_id: string
  name: string
  level: string
  position: string
  bio: string
  platform: string | null
  education: Array<{ level: string; school: string }> | null
  achievements: string[] | null
  images: Array<{ url: string; caption: string }> | null
  profile_photo?: string | null
  party?: string | null
  party_list_managed?: boolean | null
  status: "pending" | "approved" | "rejected"
  admin_notes: string | null
  verification_status?: string | null
  verified_at?: string | null
  verification_method?: string | null
  verification_document_type?: string | null
  verification_document_url?: string | null
  verification_document_notes?: string | null
  verification_requested_at?: string | null
  is_flagged?: boolean
  flag_reason?: string | null
  approved_at?: string | null
  user: {
    id: string
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Report {
  id: number
  reportable_type: "post" | "comment"
  reportable_id: number
  excerpt: string | null
  full_content: string | null
  reason: string
  description: string | null
  status: "pending" | "reviewed" | "dismissed"
  reporter_name: string
  created_at: string
}

interface FlaggedComment {
  id: number
  post_id: number
  post_name: string
  user_name: string
  content: string | null
  moderation_status: string
  removal_reason: string | null
  created_at: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<"posts" | "reports" | "comments">("posts")
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [rejectNotes, setRejectNotes] = useState<Record<number, string>>({})
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [partyListModals, setPartyListModals] = useState<Record<number, boolean>>({})
  const [existingPartyLists, setExistingPartyLists] = useState<Record<number, any[]>>({})
  const [searchPartyList, setSearchPartyList] = useState<Record<number, string>>({})
  const [isSearchingPartyList, setIsSearchingPartyList] = useState<Record<number, boolean>>({})
  const [selectedPartyListId, setSelectedPartyListId] = useState<Record<number, number | null>>({})
  const [isProcessingPartyList, setIsProcessingPartyList] = useState<Record<number, boolean>>({})
  // Verify / flag state
  const [verifyingIds, setVerifyingIds] = useState<Set<number>>(new Set())
  const [flagInputs, setFlagInputs] = useState<Record<number, boolean>>({})
  const [flagReasons, setFlagReasons] = useState<Record<number, string>>({})
  // Verify dialog state
  const [verifyDialogPostId, setVerifyDialogPostId] = useState<number | null>(null)
  const [verifyMethod, setVerifyMethod] = useState("COMELEC CoE")
  // Reports state
  const [reports, setReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const [processingReports, setProcessingReports] = useState<Set<number>>(new Set())
  // Flagged comments state
  const [flaggedComments, setFlaggedComments] = useState<FlaggedComment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [processingComments, setProcessingComments] = useState<Set<number>>(new Set())
  // Detail modals
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedComment, setSelectedComment] = useState<FlaggedComment | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchRef = useRef<number>(0)
  const isInitialMount = useRef(true)
  const searchTimeoutsRef = useRef<Record<number, NodeJS.Timeout>>({})

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true'
        && Boolean(localStorage.getItem('admin_token'))
      setIsAuthenticated(authenticated)
      if (!authenticated) {
        setIsLoading(false)
        // Redirect to login if not authenticated
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    } else {
      // Server-side: set to false to prevent loading state
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [])

  const fetchPosts = useCallback(async (silent = false) => {
    // Double-check authentication before fetching
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('admin_authenticated') === 'true'
      if (!authenticated) {
        setIsAuthenticated(false)
        window.location.href = '/login'
        return
      }
    }
    
    if (!isAuthenticated) {
      return
    }
    
    if (!silent) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      
      if (!adminToken) {
        console.error("Admin token not found")
        setIsLoading(false)
        setIsRefreshing(false)
        return
      }
      
      const response = await fetch(`${apiUrl}/admin/posts`, {
        credentials: "include",
        cache: 'no-store', // Prevent caching
        headers: getAdminHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setPosts(data)
          lastFetchRef.current = Date.now()
        } else {
          console.error("Invalid response format - expected array, got:", data)
          setPosts([])
        }
      } else {
        // Try to parse error message
        try {
          const errorData = await response.json()
          console.error("Failed to fetch posts:", errorData)
        } catch (e) {
          console.error("Failed to fetch posts: HTTP", response.status)
        }
        setPosts([])
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      setPosts([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isAuthenticated])

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated === true) {
      fetchPosts()
      isInitialMount.current = false
    }
  }, [isAuthenticated, fetchPosts])

  // Auto-refresh every 30 seconds when tab is visible
  useEffect(() => {
    const setupAutoRefresh = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        // Only refresh if tab is visible
        if (document.visibilityState === 'visible') {
          const now = Date.now()
          // Don't refresh if we just fetched (within last 10 seconds)
          if (now - lastFetchRef.current > 10000) {
            fetchPosts(true) // Silent refresh
          }
        }
      }, 60000) // 60 seconds (reduced frequency for better performance)
    }

    setupAutoRefresh()

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh immediately when tab becomes visible (if enough time has passed)
        const now = Date.now()
        if (now - lastFetchRef.current > 10000) {
          fetchPosts(true)
        }
        setupAutoRefresh()
      } else {
        // Clear interval when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchPosts])

  // Update filtered posts when filter or posts change
  useEffect(() => {
    if (filter === "all") {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter((p) => p.status === filter))
    }
  }, [filter, posts])

  // Auto-refresh when filter changes (but not on initial mount)
  useEffect(() => {
    // Skip refresh on initial mount
    if (!isInitialMount.current && posts.length > 0) {
      fetchPosts(true)
    }
  }, [filter, fetchPosts, posts.length])

  const getAdminHeaders = () => {
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    }
  }

  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/reports`, { credentials: "include", headers: getAdminHeaders() })
      if (res.ok) setReports(await res.json())
    } catch (e) {
      console.error("Failed to fetch reports:", e)
    } finally {
      setIsLoadingReports(false)
    }
  }, [])

  const handleReportStatus = async (reportId: number, status: "reviewed" | "dismissed") => {
    setProcessingReports((prev) => new Set(prev).add(reportId))
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/reports/${reportId}`, {
        method: "PATCH",
        credentials: "include",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)))
      }
    } catch (e) {
      console.error("Failed to update report:", e)
    } finally {
      setProcessingReports((prev) => { const s = new Set(prev); s.delete(reportId); return s })
    }
  }

  const fetchFlaggedComments = useCallback(async () => {
    setIsLoadingComments(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/comments/flagged`, { credentials: "include", headers: getAdminHeaders() })
      if (res.ok) setFlaggedComments(await res.json())
    } catch (e) {
      console.error("Failed to fetch flagged comments:", e)
    } finally {
      setIsLoadingComments(false)
    }
  }, [])

  const handleCommentModerate = async (commentId: number, action: "remove" | "restore") => {
    setProcessingComments((prev) => new Set(prev).add(commentId))
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/comments/${commentId}/moderate`, {
        method: "POST",
        credentials: "include",
        headers: getAdminHeaders(),
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setFlaggedComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, moderation_status: action === "remove" ? "removed" : "visible" }
              : c
          )
        )
      }
    } catch (e) {
      console.error("Failed to moderate comment:", e)
    } finally {
      setProcessingComments((prev) => { const s = new Set(prev); s.delete(commentId); return s })
    }
  }

  const handleVerify = async (postId: number, method: string) => {
    setVerifyingIds((prev) => new Set(prev).add(postId))
    setVerifyDialogPostId(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/posts/${postId}/verify`, {
        method: "POST",
        credentials: "include",
        headers: getAdminHeaders(),
        body: JSON.stringify({ verification_method: method }),
      })
      if (res.ok) {
        const data = await res.json()
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, verification_status: "verified", verified_at: new Date().toISOString(), verification_method: method } : p))
        )
      }
    } catch (e) {
      console.error("Failed to verify post:", e)
    } finally {
      setVerifyingIds((prev) => { const s = new Set(prev); s.delete(postId); return s })
    }
  }

  const handleFlag = async (postId: number, reason: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const res = await fetch(`${apiUrl}/admin/posts/${postId}/flag`, {
        method: "POST",
        credentials: "include",
        headers: getAdminHeaders(),
        body: JSON.stringify({ flag_reason: reason }),
      })
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, is_flagged: true, flag_reason: reason } : p))
        )
        setFlagInputs((prev) => ({ ...prev, [postId]: false }))
      }
    } catch (e) {
      console.error("Failed to flag post:", e)
    }
  }

  const handleManualRefresh = () => {
    if (activeTab === "posts") fetchPosts(false)
    else if (activeTab === "reports") fetchReports()
    else if (activeTab === "comments") fetchFlaggedComments()
  }

  useEffect(() => {
    if (isAuthenticated === true) {
      if (activeTab === "reports") fetchReports()
      else if (activeTab === "comments") fetchFlaggedComments()
    }
  }, [activeTab, isAuthenticated, fetchReports, fetchFlaggedComments])

  const handleApprove = async (postId: number) => {
    // Prevent multiple clicks
    if (processingIds.has(postId)) {
      return
    }
    
    setProcessingIds(new Set(processingIds).add(postId))
    
    // Optimistic update: update UI immediately
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, status: 'approved' as const }
          : post
      )
    )
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${apiUrl}/admin/posts/${postId}/approve`, {
        method: "POST",
        headers: {
          ...getAdminHeaders(),
        },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        const partyListAction = data.party_list_action
        if (partyListAction?.type === 'created') {
          alert(`Post approved. A new party list "${partyListAction.name}" was created with this candidate as its first member.`)
        } else if (partyListAction?.type === 'added') {
          alert(`Post approved. This candidate was added to the existing party list "${partyListAction.name}" (now ${partyListAction.member_count} members).`)
        }

        // Sync with server (silent refresh to avoid loading state)
        await fetchPosts(true)
      } else {
        // Revert on error
        await fetchPosts(true)
      }
    } catch (error) {
      console.error("Failed to approve post:", error)
      // Revert on error
      await fetchPosts(true)
    } finally {
      const newProcessingIds = new Set(processingIds)
      newProcessingIds.delete(postId)
      setProcessingIds(newProcessingIds)
    }
  }

  const handleReject = async (postId: number) => {
    // Prevent multiple clicks
    if (processingIds.has(postId)) {
      return
    }
    
    setProcessingIds(new Set(processingIds).add(postId))
    const adminNotes = rejectNotes[postId] || "Post rejected by admin"
    
    // Optimistic update: update UI immediately
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, status: 'rejected' as const, admin_notes: adminNotes }
          : post
      )
    )
    
    // Clear reject notes immediately
    setRejectNotes((prev) => {
      const newNotes = { ...prev }
      delete newNotes[postId]
      return newNotes
    })
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${apiUrl}/admin/posts/${postId}/reject`, {
        method: "POST",
        headers: {
          ...getAdminHeaders(),
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
        credentials: "include",
      })
      if (response.ok) {
        // Sync with server (silent refresh to avoid loading state)
        await fetchPosts(true)
      } else {
        // Revert on error
        await fetchPosts(true)
      }
    } catch (error) {
      console.error("Failed to reject post:", error)
      // Revert on error
      await fetchPosts(true)
    } finally {
      const newProcessingIds = new Set(processingIds)
      newProcessingIds.delete(postId)
      setProcessingIds(newProcessingIds)
    }
  }

  // Show loading only while checking authentication or fetching initial data
  if (isAuthenticated === null || (isAuthenticated === true && isLoading && posts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (handled in useEffect, but show loading briefly)
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: posts.length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VoteHubPH Admin</h1>
                <p className="text-sm text-gray-500">Post Moderation Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <a
                href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Main Site →
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === "posts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === "reports"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Flag className="h-4 w-4" />
            Reports
            {reports.filter((r) => r.status === "pending").length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {reports.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === "comments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Comments
          </button>
        </div>

        {/* ── POSTS TAB ── */}
        {activeTab === "posts" && <>
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-500 mt-1">Total Posts</p>
          </div>
          <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => setFilter("pending")}
          >
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-gray-500 mt-1">Pending Review</p>
          </div>
          <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => setFilter("approved")}
          >
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-sm text-gray-500 mt-1">Approved</p>
          </div>
          <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => setFilter("rejected")}
          >
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-gray-500 mt-1">Rejected</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">No posts found</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow">
                {/* Post Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    {/* Profile Photo - Always prioritize profile_photo, never replace with campaign images */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          post.profile_photo 
                            ? post.profile_photo 
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.name)}&size=96&background=random`
                        }
                        alt={post.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{post.name}</h3>
                        {post.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {post.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </span>
                        )}
                        {post.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="h-4 w-4" />
                        <span>{post.user.name} ({post.user.email})</span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="font-medium">{post.position}</span>
                        <span>•</span>
                        <span>{post.level}</span>
                        {post.party && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-blue-600">{post.party}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 flex-shrink-0">
                      <div>Submitted</div>
                      <div className="font-medium">{new Date(post.created_at).toLocaleDateString()}</div>
                      <div className="text-xs">{new Date(post.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 space-y-4">
                  {/* Bio Section with Expandable Summary */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Bio</h4>
                    {(() => {
                      const bioKey = `bio-${post.id}`
                      const isExpanded = expandedSections[bioKey] || false
                      const shouldTruncate = post.bio && post.bio.length > 200
                      const displayText = shouldTruncate && !isExpanded 
                        ? post.bio.substring(0, 200) + '...' 
                        : post.bio
                      
                      return (
                        <div>
                          <p className="text-gray-600 whitespace-pre-wrap break-words">{displayText}</p>
                          {shouldTruncate && (
                            <button
                              onClick={() => setExpandedSections(prev => ({ ...prev, [bioKey]: !isExpanded }))}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  Show More
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Platform & Advocacy Section with Expandable Summary */}
                  {post.platform && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Platform & Advocacy</h4>
                      {(() => {
                        const platformKey = `platform-${post.id}`
                        const isExpanded = expandedSections[platformKey] || false
                        const shouldTruncate = post.platform && post.platform.length > 200
                        const displayText = shouldTruncate && !isExpanded 
                          ? post.platform.substring(0, 200) + '...' 
                          : post.platform
                        
                        return (
                          <div>
                            <p className="text-gray-600 whitespace-pre-wrap break-words">{displayText}</p>
                            {shouldTruncate && (
                              <button
                                onClick={() => setExpandedSections(prev => ({ ...prev, [platformKey]: !isExpanded }))}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="h-4 w-4" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4" />
                                    Show More
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {post.education && post.education.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Education</h4>
                      <ul className="space-y-1">
                        {post.education.map((edu, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">
                            • {edu.level} - {edu.school}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {post.achievements && post.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Achievements</h4>
                      <ul className="space-y-1">
                        {post.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">
                            ✓ {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {post.images && post.images.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Campaign Images ({post.images.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {post.images.map((img, idx) => {
                          const captionKey = `caption-${post.id}-${idx}`
                          const isExpanded = expandedSections[captionKey] || false
                          const shouldTruncate = img.caption && img.caption.length > 100
                          const displayCaption = shouldTruncate && !isExpanded 
                            ? img.caption.substring(0, 100) + '...' 
                            : img.caption
                          
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                  src={img.url}
                                  alt={img.caption || `Image ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {img.caption && (
                                <div>
                                  <p className="text-xs text-gray-600 italic whitespace-pre-wrap break-words">
                                    {displayCaption}
                                  </p>
                                  {shouldTruncate && (
                                    <button
                                      onClick={() => setExpandedSections(prev => ({ ...prev, [captionKey]: !isExpanded }))}
                                      className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="h-3 w-3" />
                                          Show Less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="h-3 w-3" />
                                          Show More
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Party List Notification - Only show if party list hasn't been managed yet */}
                  {post.party && post.status === "pending" && !post.party_list_managed && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-yellow-800 mb-1 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Party List Detected
                          </h4>
                          <p className="text-sm text-yellow-700 mb-3">
                            This candidate has specified a party list: <strong>{post.party}</strong>
                          </p>
                          <button
                            onClick={() => setPartyListModals(prev => ({ ...prev, [post.id]: true }))}
                            className="text-sm bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 font-medium"
                          >
                            Manage Party List
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.admin_notes && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-red-800 mb-1">Admin Notes</h4>
                      <p className="text-sm text-red-700">{post.admin_notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {post.status === "pending" && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <textarea
                          placeholder="Add notes for rejection (optional)..."
                          value={rejectNotes[post.id] || ""}
                          onChange={(e) =>
                            setRejectNotes((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleApprove(post.id)
                          }}
                          disabled={processingIds.has(post.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {processingIds.has(post.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleReject(post.id)
                          }}
                          disabled={processingIds.has(post.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {processingIds.has(post.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verify / Flag controls (approved posts only) */}
                {post.status === "approved" && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-3">
                      <strong>Note:</strong> Admin notes are publicly visible to voters on rejected or flagged posts.
                    </p>
                    <div className="flex gap-3 flex-wrap items-center">
                      {/* Verify */}
                      {(!post.verification_status || post.verification_status === "unverified") ? (
                        <button
                          onClick={() => { setVerifyDialogPostId(post.id); setVerifyMethod("COMELEC CoE") }}
                          disabled={verifyingIds.has(post.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 text-green-700 rounded-md hover:bg-green-50 text-sm font-medium disabled:opacity-50"
                        >
                          {verifyingIds.has(post.id) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                          {verifyingIds.has(post.id) ? "Verifying..." : "Verify Official"}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified {post.verification_method ? `via ${post.verification_method}` : ""}
                        </span>
                      )}

                      {/* Flag */}
                      {!post.is_flagged ? (
                        flagInputs[post.id] ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Reason (optional)"
                              value={flagReasons[post.id] || ""}
                              onChange={(e) => setFlagReasons((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              className="px-2 py-1 border border-orange-300 rounded-md text-sm w-44"
                            />
                            <button
                              onClick={() => handleFlag(post.id, flagReasons[post.id] || "")}
                              className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setFlagInputs((prev) => ({ ...prev, [post.id]: false }))}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setFlagInputs((prev) => ({ ...prev, [post.id]: true }))}
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-orange-500 text-orange-600 rounded-md hover:bg-orange-50 text-sm font-medium"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Flag Content
                          </button>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-md text-sm font-medium">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Flagged {post.flag_reason ? `(${post.flag_reason})` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        </> /* end Posts tab */}

        {/* ── REPORTS TAB ── */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Reports</h2>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">No reports submitted yet.</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Content</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Reason</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Reporter</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedReport(report)}>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${report.reportable_type === "post" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                            {report.reportable_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-gray-800 truncate">{report.excerpt ?? "(no preview)"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-800">{report.reason}</span>
                          {report.description && (
                            <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{report.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{report.reporter_name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            report.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            report.status === "reviewed" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {report.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReportStatus(report.id, "reviewed")}
                                disabled={processingReports.has(report.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                Mark Reviewed
                              </button>
                              <button
                                onClick={() => handleReportStatus(report.id, "dismissed")}
                                disabled={processingReports.has(report.id)}
                                className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── COMMENTS TAB ── */}
        {activeTab === "comments" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comment Moderation</h2>
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : flaggedComments.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">No moderated comments found.</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Post</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Author</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Content</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {flaggedComments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => setSelectedComment(comment)}>
                        <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">{comment.post_name}</td>
                        <td className="px-4 py-3 text-gray-600">{comment.user_name}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-gray-600 truncate">{comment.content ?? "(content removed)"}</p>
                          {comment.removal_reason && (
                            <p className="text-xs text-red-500 mt-0.5">Reason: {comment.removal_reason}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            comment.moderation_status === "removed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {comment.moderation_status}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            {comment.moderation_status !== "removed" && (
                              <button
                                onClick={() => handleCommentModerate(comment.id, "remove")}
                                disabled={processingComments.has(comment.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            )}
                            {comment.moderation_status === "removed" && (
                              <button
                                onClick={() => handleCommentModerate(comment.id, "restore")}
                                disabled={processingComments.has(comment.id)}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── VERIFY METHOD DIALOG ── */}
      {verifyDialogPostId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setVerifyDialogPostId(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Verify Official Candidate
              </h3>
              <p className="text-sm text-gray-500 mt-1">Select how you verified this candidate's identity.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Method</label>
                <div className="space-y-2">
                  {["COMELEC CoE", "Official Gov Website", "Government ID", "Manual Review"].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="verifyMethod"
                        value={method}
                        checked={verifyMethod === method}
                        onChange={() => setVerifyMethod(method)}
                        className="text-green-600"
                      />
                      <span className="text-sm font-medium text-gray-800">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setVerifyDialogPostId(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >Cancel</button>
              <button
                onClick={() => handleVerify(verifyDialogPostId, verifyMethod)}
                disabled={verifyingIds.has(verifyDialogPostId)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {verifyingIds.has(verifyDialogPostId) ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT DETAIL MODAL ── */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Report Details</h3>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-semibold ${selectedReport.reportable_type === "post" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                  {selectedReport.reportable_type}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedReport.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  selectedReport.status === "reviewed" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-600"
                }`}>{selectedReport.status}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Content</p>
                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{selectedReport.full_content ?? selectedReport.excerpt ?? "(no preview available)"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reason</p>
                <p className="text-sm font-medium text-gray-900">{selectedReport.reason}</p>
              </div>
              {selectedReport.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Additional Details</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{selectedReport.description}</p>
                </div>
              )}
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Reporter</p>
                  <p className="text-gray-800">{selectedReport.reporter_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Submitted</p>
                  <p className="text-gray-800">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            {selectedReport.status === "pending" && (
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => { handleReportStatus(selectedReport.id, "dismissed"); setSelectedReport(null) }}
                  disabled={processingReports.has(selectedReport.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50"
                >Dismiss</button>
                <button
                  onClick={() => { handleReportStatus(selectedReport.id, "reviewed"); setSelectedReport(null) }}
                  disabled={processingReports.has(selectedReport.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                >Mark Reviewed</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COMMENT DETAIL MODAL ── */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedComment(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Comment Details</h3>
              <button onClick={() => setSelectedComment(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedComment.moderation_status === "removed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                }`}>{selectedComment.moderation_status}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Post</p>
                  <p className="text-gray-800 font-medium">{selectedComment.post_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Author</p>
                  <p className="text-gray-800">{selectedComment.user_name}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Comment</p>
                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{selectedComment.content ?? "(content removed)"}</p>
              </div>
              {selectedComment.removal_reason && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Removal Reason</p>
                  <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">{selectedComment.removal_reason}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Date</p>
                <p className="text-sm text-gray-700">{new Date(selectedComment.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              {selectedComment.moderation_status !== "removed" && (
                <button
                  onClick={() => { handleCommentModerate(selectedComment.id, "remove"); setSelectedComment(null) }}
                  disabled={processingComments.has(selectedComment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                >Remove Comment</button>
              )}
              {selectedComment.moderation_status === "removed" && (
                <button
                  onClick={() => { handleCommentModerate(selectedComment.id, "restore"); setSelectedComment(null) }}
                  disabled={processingComments.has(selectedComment.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                >Restore Comment</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Party List Management Modal */}
      {filteredPosts.map((post) => (
        partyListModals[post.id] && post.party && (
          <div key={`modal-${post.id}`} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Manage Party List</h3>
                  <button
                    onClick={() => setPartyListModals(prev => ({ ...prev, [post.id]: false }))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Candidate:</strong> {post.name}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Party List:</strong> {post.party}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search for existing party list
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name or acronym..."
                        value={searchPartyList[post.id] || ""}
                        onChange={(e) => {
                          const query = e.target.value
                          setSearchPartyList(prev => ({ ...prev, [post.id]: query }))
                          setSelectedPartyListId(prev => ({ ...prev, [post.id]: null }))
                          
                          // Clear any existing timeout for this post
                          if (searchTimeoutsRef.current[post.id]) {
                            clearTimeout(searchTimeoutsRef.current[post.id])
                            delete searchTimeoutsRef.current[post.id]
                          }
                          
                          // Clear results if query is too short
                          if (query.length < 1) {
                            setExistingPartyLists(prev => ({ ...prev, [post.id]: [] }))
                            setIsSearchingPartyList(prev => ({ ...prev, [post.id]: false }))
                            return
                          }
                          
                          // Debounce the search - wait 300ms after user stops typing
                          setIsSearchingPartyList(prev => ({ ...prev, [post.id]: true }))
                          
                          // Set new timeout
                          const timeoutId = setTimeout(async () => {
                            try {
                              const response = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/partylists/search?q=${encodeURIComponent(query)}`,
                                {
                                  credentials: "include",
                                  headers: getAdminHeaders(),
                                }
                              )
                              if (response.ok) {
                                const data = await response.json()
                                setExistingPartyLists(prev => ({ ...prev, [post.id]: data }))
                              }
                            } catch (error) {
                              console.error("Failed to search party lists:", error)
                            } finally {
                              setIsSearchingPartyList(prev => ({ ...prev, [post.id]: false }))
                              delete searchTimeoutsRef.current[post.id]
                            }
                          }, 300)
                          
                          // Store timeout ID
                          searchTimeoutsRef.current[post.id] = timeoutId
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {isSearchingPartyList[post.id] && (
                        <div className="absolute right-3 top-2.5">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Search Results */}
                    {existingPartyLists[post.id] && existingPartyLists[post.id].length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                        {existingPartyLists[post.id].map((pl: any) => (
                          <button
                            key={pl.id}
                            onClick={() => setSelectedPartyListId(prev => ({ ...prev, [post.id]: pl.id }))}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                              selectedPartyListId[post.id] === pl.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-gray-900">{pl.name}</p>
                                {pl.acronym && (
                                  <p className="text-xs text-gray-500">{pl.acronym}</p>
                                )}
                                {pl.sector && (
                                  <p className="text-xs text-gray-400 mt-0.5">Sector: {pl.sector}</p>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {pl.member_count || 0} members
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchPartyList[post.id] && searchPartyList[post.id].length >= 2 && 
                     existingPartyLists[post.id] && existingPartyLists[post.id].length === 0 && 
                     !isSearchingPartyList[post.id] && (
                      <p className="text-xs text-gray-500 mt-2">No party lists found matching "{searchPartyList[post.id]}"</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Search for an existing party list to add this candidate to, or create a new one below.
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          const partyListId = selectedPartyListId[post.id]
                          if (!partyListId) {
                            alert("Please select a party list from the search results first")
                            return
                          }
                          
                          setIsProcessingPartyList(prev => ({ ...prev, [post.id]: true }))
                          try {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
                            const response = await fetch(
                              `${apiUrl}/admin/partylists/${partyListId}/members`,
                              {
                                method: "POST",
                                headers: {
                                  ...getAdminHeaders(),
                                },
                                credentials: "include",
                                body: JSON.stringify({ post_id: post.id }),
                              }
                            )
                            
                            if (response.ok) {
                              alert(`Successfully added "${post.name}" to the party list!`)
                              setPartyListModals(prev => ({ ...prev, [post.id]: false }))
                              setSearchPartyList(prev => ({ ...prev, [post.id]: "" }))
                              setSelectedPartyListId(prev => ({ ...prev, [post.id]: null }))
                              // Mark party list as managed by updating the post
                              setPosts(prev => prev.map(p => 
                                p.id === post.id ? { ...p, party_list_managed: true } : p
                              ))
                              await fetchPosts()
                            } else {
                              const error = await response.json()
                              const fieldError = error.errors ? (Object.values(error.errors)[0] as any)?.[0] : null
                              alert(fieldError || error.message || "Failed to add member to party list")
                            }
                          } catch (error) {
                            console.error("Failed to add member:", error)
                            alert("Failed to add member to party list")
                          } finally {
                            setIsProcessingPartyList(prev => ({ ...prev, [post.id]: false }))
                          }
                        }}
                        disabled={!selectedPartyListId[post.id] || isProcessingPartyList[post.id]}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
                      >
                        {isProcessingPartyList[post.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add to Existing Party List"
                        )}
                      </button>
                      <button
                        onClick={async () => {
                          setIsProcessingPartyList(prev => ({ ...prev, [post.id]: true }))
                          try {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
                            const response = await fetch(
                              `${apiUrl}/admin/partylists`,
                              {
                                method: "POST",
                                headers: {
                                  ...getAdminHeaders(),
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                  name: post.party,
                                  post_id: post.id,
                                  platform: post.platform ? (typeof post.platform === 'string' ? [post.platform] : post.platform) : [],
                                }),
                              }
                            )
                            
                            if (response.ok) {
                              alert(`Successfully created party list "${post.party}" and added "${post.name}" as a member!`)
                              setPartyListModals(prev => ({ ...prev, [post.id]: false }))
                              setSearchPartyList(prev => ({ ...prev, [post.id]: "" }))
                              // Mark party list as managed by updating the post
                              setPosts(prev => prev.map(p => 
                                p.id === post.id ? { ...p, party_list_managed: true } : p
                              ))
                              await fetchPosts()
                            } else {
                              const error = await response.json()
                              const fieldError = error.errors ? (Object.values(error.errors)[0] as any)?.[0] : null
                              alert(fieldError || error.message || "Failed to create party list")
                            }
                          } catch (error) {
                            console.error("Failed to create party list:", error)
                            alert("Failed to create party list")
                          } finally {
                            setIsProcessingPartyList(prev => ({ ...prev, [post.id]: false }))
                          }
                        }}
                        disabled={isProcessingPartyList[post.id]}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
                      >
                        {isProcessingPartyList[post.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create New Party List"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  )
}
