"use client"

import { mockCandidates, positions, getCommentsByCandidate } from "@/lib/candidate-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, Vote, ArrowLeft, Heart, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { T } from "@/components/auto-translate"
import { useTranslate } from "@/lib/use-translate"

export default function CandidatePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("from") || "local"

  const candidate = mockCandidates.find((c) => c.id === params.id)
  const [newComment, setNewComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isVoteAnonymous, setIsVoteAnonymous] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2"><T>Candidate Not Found</T></h2>
          <Button asChild>
            <Link href="/"><T>Return Home</T></Link>
          </Button>
        </div>
      </div>
    )
  }

  const position = positions.find((p) => p.id === candidate.positionId)
  const comments = getCommentsByCandidate(candidate.id)

  const translatedBio = useTranslate(candidate.bio)
  const translatedPlatform = candidate.platform.map(p => useTranslate(p))
  const translatedAchievements = candidate.achievements?.map(a => useTranslate(a)) || []
  const translatedContributions = candidate.contributions.map(c => useTranslate(c))
  const translatedEducation = candidate.education?.map(e => ({ level: useTranslate(e.level), school: useTranslate(e.school) })) || []

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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href={`/browse?tab=${returnTo}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <T>Back to Candidates</T>
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <Avatar className="h-40 w-40 border-4 border-primary/10">
                      <AvatarImage src={candidate.imageUrl || "/placeholder.svg"} alt={candidate.name} />
                      <AvatarFallback className="text-3xl bg-primary/5">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h1 className="text-4xl font-bold text-balance">{candidate.name}</h1>
                      <p className="text-xl text-muted-foreground mt-2"><T>Running for</T> {position?.name}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {candidate.partyList && (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {candidate.partyList}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {candidate.locationType === "national"
                          ? <T>National</T>
                          : candidate.locationType === "city"
                            ? <T>City Level</T>
                            : <T>Barangay Level</T>}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Vote className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{candidate.votes.toLocaleString()}</span>
                        <span><T>votes</T></span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{candidate.commentCount}</span>
                        <span><T>comments</T></span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl"><T>Biography</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">{translatedBio}</p>
              </CardContent>
            </Card>

            {candidate.education && candidate.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl"><T>Education</T></CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {translatedEducation.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl mt-0.5">•</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.level}</p>
                          <p className="text-sm text-muted-foreground">{item.school}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {candidate.achievements && candidate.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl"><T>Key Achievements</T></CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {translatedAchievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl mt-0.5">✓</span>
                        <span className="text-foreground leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Platform */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl"><T>Platform & Advocacies</T></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {translatedPlatform.map((point, idx) => (
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
                <CardTitle className="text-2xl"><T>Key Contributions</T></CardTitle>
                <CardDescription><T>Documented achievements and community projects</T></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {translatedContributions.map((contribution, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl mt-0.5">✓</span>
                        <span className="text-foreground leading-relaxed flex-1">{contribution}</span>
                      </div>
                      {/* Sample contribution images */}
                      {idx === 0 && (
                        <div className="grid grid-cols-2 gap-3 pl-9">
                          <img
                            src="/community-project-completion.jpg"
                            alt="Contribution evidence"
                            className="rounded-lg border w-full h-40 object-cover"
                          />
                          <img
                            src="/ribbon-cutting-ceremony.jpg"
                            alt="Contribution evidence"
                            className="rounded-lg border w-full h-40 object-cover"
                          />
                        </div>
                      )}
                      {idx === 1 && (
                        <div className="pl-9">
                          <img
                            src="/community-gathering-event.jpg"
                            alt="Contribution evidence"
                            className="rounded-lg border w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl"><T>Community Discussion</T></CardTitle>
                <CardDescription><T>What voters are saying</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this candidate..."
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
                      <T>Post anonymously</T>
                    </label>
                    <Button onClick={handleComment} disabled={!newComment.trim()}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <T>Post Comment</T>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    <T>Recent Comments</T> ({comments.length})
                  </h3>
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                        <Avatar className="h-10 w-10 border-2">
                          <AvatarFallback className="bg-primary/10">
                            {comment.isAnonymous ? "?" : comment.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                          <Button variant="ghost" size="sm" className="h-8 -ml-2">
                            <Heart className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle><T>Support This Candidate</T></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleVote} disabled={hasVoted}>
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    {hasVoted ? <T>Vote Recorded</T> : <><T>Vote for</T> {candidate.name.split(" ")[0]}</>}
                  </Button>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVoteAnonymous}
                      onChange={(e) => setIsVoteAnonymous(e.target.checked)}
                      className="rounded"
                      disabled={hasVoted}
                    />
                    <T>Vote anonymously</T>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  <T>This is a community poll to gauge voter sentiment.</T>{" "}
                  {isVoteAnonymous ? <T>Your vote will be anonymous</T> : <T>Your name will be shown with your vote</T>} <T>and helps others understand public opinion.</T>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle><T>Position Details</T></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground"><T>Position</T></p>
                  <p className="text-base font-semibold">{position?.name}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground"><T>Level</T></p>
                  <p className="text-base font-semibold capitalize">{position?.level}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground"><T>Description</T></p>
                  <p className="text-sm leading-relaxed">{position?.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base"><T>About This Profile</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <T>Candidate profiles are created and maintained by community members. All information should be verified through official sources.</T>
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
