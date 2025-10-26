"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Calendar, ThumbsUp, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  // Mock user data (since auth is bypassed)
  const mockUser = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    location: {
      barangay: "Bagong Pag-asa",
      city: "Quezon City",
      region: "National Capital Region (NCR)",
    },
    joinedDate: "January 2025",
    votedCandidates: [
      { id: "cand1", name: "Maria Santos", position: "Barangay Chairman", date: "Jan 20, 2025" },
      { id: "cand5", name: "Joy Belmonte", position: "Mayor", date: "Jan 18, 2025" },
      { id: "cand19", name: "Risa Hontiveros", position: "Senator", date: "Jan 15, 2025" },
    ],
    comments: [
      {
        id: "com1",
        candidateName: "Maria Santos",
        content: "I support your platform on waste management. Our barangay really needs this!",
        date: "Jan 15, 2025",
        likes: 23,
      },
      {
        id: "com2",
        candidateName: "Risa Hontiveros",
        content: "I really appreciate the work on mental health legislation.",
        date: "Jan 14, 2025",
        likes: 156,
      },
    ],
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
                <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
                <CardDescription className="mt-1">{mockUser.email}</CardDescription>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {mockUser.location.barangay}, {mockUser.location.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {mockUser.joinedDate}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="votes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="votes">My Votes</TabsTrigger>
            <TabsTrigger value="comments">My Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="votes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voted Candidates</CardTitle>
                <CardDescription>Candidates you've voted for on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUser.votedCandidates.map((vote) => (
                  <div key={vote.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{vote.name}</h3>
                      <p className="text-sm text-muted-foreground">{vote.position}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{vote.date}</span>
                      <Link href={`/candidate/${vote.id}`}>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Comments</CardTitle>
                <CardDescription>Your discussions about candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUser.comments.map((comment) => (
                  <div key={comment.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{comment.candidateName}</Badge>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes} likes</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
