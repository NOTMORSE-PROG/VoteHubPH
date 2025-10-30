"use client"

import { useParams, useRouter } from "next/navigation"
import { partyListGroups } from "@/lib/candidate-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PartyListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const partyList = partyListGroups.find((pl) => pl.id === params.id)

  if (!partyList) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Party-List Not Found</h2>
          <Button onClick={() => router.push("/browse?tab=partylist")}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse?tab=partylist">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Party-List
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{partyList.name}</h1>
                {partyList.acronym && <p className="text-xl text-muted-foreground mb-3">{partyList.acronym}</p>}
                <Badge variant="secondary" className="text-sm">
                  <Users className="h-3 w-3 mr-1" />
                  {partyList.sector}
                </Badge>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{partyList.description}</p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Platform</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {partyList.platform.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Members</h2>
            <div className="grid gap-4">
              {partyList.nominees.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={member.imageUrl || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">Position #{member.position}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/partylist/${partyList.id}/member/${member.id}?from=partylist`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.bio}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Background:</p>
                          <ul className="space-y-1">
                            {member.background.map((item, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
