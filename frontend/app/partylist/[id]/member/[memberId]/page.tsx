"use client"

import { partyListGroups } from "@/lib/candidate-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function PartyListMemberPage({ params }: { params: { id: string; memberId: string } }) {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("from") || "partylist"

  const partyList = partyListGroups.find((pl) => pl.id === params.id)
  const member = partyList?.nominees.find((n) => n.id === params.memberId)

  const [newComment, setNewComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isVoteAnonymous, setIsVoteAnonymous] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)

  if (!partyList || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
          <Button asChild>
            <Link href="/browse?tab=partylist">Return to Party-List</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleVote = () => {
    setHasVoted(true)
    const voterName = isVoteAnonymous ? "anonymously" : "as Juan Dela Cruz"
    alert(`Vote recorded ${voterName}! (This is a mock action)`)
  }

  const handleComment = () => {
    if (newComment.trim()) {
      alert(`Comment posted ${isAnonymous ? "anonymously" : "publicly"}! (This is a mock action)`)
      setNewComment("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href={`/browse?tab=${returnTo}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <Avatar className="h-40 w-40 border-4 border-primary/10">
                      <AvatarImage src={member.imageUrl || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-3xl bg-primary/5">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h1 className="text-4xl font-bold text-balance">{member.name}</h1>
                      <p className="text-xl text-muted-foreground mt-2">
                        {partyList.name} - Position #{member.position}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {partyList.name}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <Users className="h-3 w-3 mr-1" />
                        {partyList.sector}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">{member.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Background & Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {member.background.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-primary font-bold text-xl mt-0.5">•</span>
                      <span className="text-foreground leading-relaxed flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Party-List Platform</CardTitle>
                <CardDescription>What {partyList.name} stands for</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {partyList.platform.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-primary font-bold text-xl mt-0.5">•</span>
                      <span className="text-foreground leading-relaxed flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Community Discussion</CardTitle>
                <CardDescription>What voters are saying about this member</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this party-list member..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      Post anonymously
                    </label>
                    <Button onClick={handleComment} disabled={!newComment.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Support This Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleVote} disabled={hasVoted}>
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    {hasVoted ? "Vote Recorded" : `Vote for ${member.name.split(" ")[0]}`}
                  </Button>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVoteAnonymous}
                      onChange={(e) => setIsVoteAnonymous(e.target.checked)}
                      className="rounded"
                      disabled={hasVoted}
                    />
                    Vote anonymously
                  </label>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  This is a community poll to gauge voter sentiment.{" "}
                  {isVoteAnonymous ? "Your vote will be anonymous" : "Your name will be shown with your vote"} and helps
                  others understand public opinion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Party-List Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Party-List</p>
                  <p className="text-base font-semibold">{partyList.name}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Sector</p>
                  <p className="text-base font-semibold">{partyList.sector}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p className="text-base font-semibold">#{member.position}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">About</p>
                  <p className="text-sm leading-relaxed">{partyList.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About This Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Party-list member profiles are created and maintained by community members. All information should be
                  verified through official sources.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
