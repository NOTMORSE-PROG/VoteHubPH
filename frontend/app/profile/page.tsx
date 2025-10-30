"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Calendar, ThumbsUp, User, Loader2, FileText } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"

interface UserData {
  name: string
  email: string
  location: {
    barangay?: string
    city?: string
    region?: string
  }
  joinedDate: string
  votedCandidates: Array<{ id: string; name: string; position: string; date: string }>
  comments: Array<{ id: string; candidateName: string; content: string; date: string; likes: number }>
  posts: Array<{ id: string; title: string; content: string; date: string; likes: number; comments: number }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user) {
      // Fetch user data from API
      fetchUserData()
    }
  }, [status, session, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground"><T>Failed to load profile data</T></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">My Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your civic engagement</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription className="mt-1">{userData.email}</CardDescription>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {userData.location.barangay ? `${userData.location.barangay}, ` : ""}
                      {userData.location.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span><T>Joined</T> {userData.joinedDate}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="votes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="votes"><T>My Votes</T></TabsTrigger>
            <TabsTrigger value="comments"><T>My Comments</T></TabsTrigger>
            <TabsTrigger value="posts"><T>My Posts</T></TabsTrigger>
          </TabsList>

          <TabsContent value="votes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T>Voted Candidates</T></CardTitle>
                <CardDescription><T>Candidates you've voted for on the platform</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.votedCandidates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    <T>You haven't voted for any candidates yet</T>
                  </p>
                ) : (
                  userData.votedCandidates.map((vote) => (
                    <div key={vote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{vote.name}</h3>
                        <p className="text-sm text-muted-foreground">{vote.position}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{vote.date}</span>
                        <Link href={`/candidate/${vote.id}`}>
                          <Button variant="outline" size="sm">
                            <T>View Profile</T>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T>My Comments</T></CardTitle>
                <CardDescription><T>Your discussions about candidates</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    <T>You haven't posted any comments yet</T>
                  </p>
                ) : (
                  userData.comments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{comment.candidateName}</Badge>
                        <span className="text-sm text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes} <T>likes</T></span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T>My Posts</T></CardTitle>
                <CardDescription><T>Articles and discussions you've created</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    <T>You haven't created any posts yet</T>
                  </p>
                ) : (
                  userData.posts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{post.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes} <T>likes</T></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{post.comments} <T>comments</T></span>
                        </div>
                        <Link href={`/posts/${post.id}`} className="ml-auto">
                          <Button variant="ghost" size="sm">
                            <T>View Post</T>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
