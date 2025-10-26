"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { electionSchedule } from "@/lib/election-data"
import { MapPin, ArrowLeft, Filter, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ElectionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const upcomingElections = electionSchedule.sort((a, b) => a.date.getTime() - b.date.getTime())

  const allPositions = Array.from(new Set(upcomingElections.flatMap((e) => e.positions)))
  const allRegions = Array.from(new Set(upcomingElections.flatMap((e) => e.votingLocations.map((l) => l.region))))
  const electionTypes = ["National", "Local"]

  const filteredElections = upcomingElections.filter((election) => {
    const matchesPosition = !selectedPosition || election.positions.includes(selectedPosition)
    const matchesRegion = !selectedRegion || election.votingLocations.some((l) => l.region === selectedRegion)
    const matchesType =
      !selectedType ||
      (selectedType === "National" && election.name.includes("National")) ||
      (selectedType === "Local" && !election.name.includes("National"))
    return matchesPosition && matchesRegion && matchesType
  })

  const hasActiveFilters = selectedPosition || selectedRegion || selectedType

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Election Schedule</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-bold">Upcoming Elections</h2>
          <p className="text-muted-foreground">Important dates and voting locations for Philippine elections</p>
        </div>

        <div className="mb-8 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filter Elections</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPosition(null)
                  setSelectedRegion(null)
                  setSelectedType(null)
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Position Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <select
                value={selectedPosition || ""}
                onChange={(e) => setSelectedPosition(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Positions</option>
                {allPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <select
                value={selectedRegion || ""}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Regions</option>
                {allRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Election Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Election Type</label>
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Types</option>
                {electionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Elections List */}
        <div className="space-y-3">
          {filteredElections.length > 0 ? (
            filteredElections.map((election) => (
              <Card key={election.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl font-bold text-primary min-w-fit">
                          {election.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div>
                          <h3 className="font-semibold">{election.name}</h3>
                          <p className="text-xs text-muted-foreground">{election.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {election.positions.map((position) => (
                          <span key={position} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {position}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {election.votingLocations.map((location, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>
                              {location.region}: {location.cities.join(", ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No elections found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
