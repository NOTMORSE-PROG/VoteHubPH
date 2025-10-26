"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Link from "next/link"
import type { PartyListGroup } from "@/lib/candidate-data"
import { useTranslate } from "@/lib/use-translate"
import { T } from "@/components/auto-translate"

interface PartyListCardProps {
  partyList: PartyListGroup
  currentTab?: string
}

export function PartyListCard({ partyList, currentTab = "partylist" }: PartyListCardProps) {
  const translatedDescription = useTranslate(partyList.description)
  const translatedSector = useTranslate(partyList.sector)

  return (
    <Link href={`/partylist/${partyList.id}?from=${currentTab}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight line-clamp-2">{partyList.name}</h3>
              {partyList.acronym && <p className="text-sm text-muted-foreground mt-1">{partyList.acronym}</p>}
            </div>
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <Badge variant="secondary" className="w-fit">
            {translatedSector}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{translatedDescription}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{partyList.nominees.length} <T>members</T></span>
            <span className="text-primary font-medium"><T>View Details</T> →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
