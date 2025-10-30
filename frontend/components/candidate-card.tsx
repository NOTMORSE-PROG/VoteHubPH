"use client"

import { type Candidate, positions } from "@/lib/candidate-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Vote } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"
import { useTranslate } from "@/lib/use-translate"

interface CandidateCardProps {
  candidate: Candidate
  currentTab?: "local" | "national" | "partylist"
}

export function CandidateCard({ candidate, currentTab = "local" }: CandidateCardProps) {
  const position = positions.find((p) => p.id === candidate.positionId)
  const translatedBio = useTranslate(candidate.bio)
  const translatedPlatform = candidate.platform.slice(0, 3).map(p => useTranslate(p))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={candidate.imageUrl || "/placeholder.svg"} alt={candidate.name} />
            <AvatarFallback>
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{candidate.name}</CardTitle>
            <CardDescription className="mt-1"><T>Running for</T> {position?.name}</CardDescription>
            {candidate.partyList && (
              <Badge variant="secondary" className="mt-2">
                {candidate.partyList}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{translatedBio}</p>

        <div>
          <h4 className="font-semibold text-sm mb-2"><T>Key Platform Points</T>:</h4>
          <ul className="space-y-1">
            {translatedPlatform.map((point, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4" />
            <span>{candidate.votes.toLocaleString()} <T>votes</T></span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{candidate.commentCount} <T>comments</T></span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href={`/candidate/${candidate.id}?from=${currentTab}`}><T>View Profile</T></Link>
        </Button>
        <Button className="flex-1">
          <ThumbsUp className="h-4 w-4 mr-2" />
          <T>Vote</T>
        </Button>
      </CardFooter>
    </Card>
  )
}
