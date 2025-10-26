"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LocationSelector } from "@/components/location-selector"
import { GovernmentNav } from "@/components/government-nav"
import { PositionFilter } from "@/components/position-filter"
import { PartyFilter } from "@/components/party-filter"
import { StatusFilter } from "@/components/status-filter"
import { CandidateCard } from "@/components/candidate-card"
import { PartyListCard } from "@/components/partylist-card"
import { ScrollToTop } from "@/components/scroll-to-top"
import { mockCandidates, getCandidatesByLocation, partyListGroups } from "@/lib/candidate-data"
import { getBarangaysByCity, getCityById, getRegionById } from "@/lib/ph-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
  Calendar,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"
import { useTranslate } from "@/lib/use-translate"

const CANDIDATES_PER_PAGE = 9

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab") || "local"
  const viewParam = searchParams.get("view") || "candidates"

  const [governmentLevel, setGovernmentLevel] = useState<"local" | "national" | "partylist">(
    tabParam as "local" | "national" | "partylist",
  )
  const [view, setView] = useState<"candidates" | "statistics" | "elections">(
    viewParam as "candidates" | "statistics" | "elections",
  )
  const [selectedLocation, setSelectedLocation] = useState<{
    regionId: string
    cityId: string
    barangayId: string
  } | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedParty, setSelectedParty] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    router.push(`/browse?tab=${governmentLevel}&view=${view}`, { scroll: false })
  }, [governmentLevel, view, router])

  const getCandidates = () => {
    if (governmentLevel === "partylist") {
      return []
    }

    if (governmentLevel === "national") {
      let nationalCandidates = mockCandidates.filter((c) => c.locationType === "national")

      if (selectedPosition !== "all") {
        nationalCandidates = nationalCandidates.filter((c) => c.positionId === selectedPosition)
      }
      if (selectedParty !== "all") {
        nationalCandidates = nationalCandidates.filter((c) => c.partyId === selectedParty)
      }
      if (selectedStatus !== "all") {
        nationalCandidates = nationalCandidates.filter((c) => c.status === selectedStatus)
      }

      return nationalCandidates
    }

    if (!selectedLocation) return []

    const barangayCandidates = getCandidatesByLocation(selectedLocation.barangayId, "barangay")
    const cityCandidates = getCandidatesByLocation(selectedLocation.cityId, "city")
    let allLocalCandidates = [...barangayCandidates, ...cityCandidates]

    if (selectedPosition !== "all") {
      allLocalCandidates = allLocalCandidates.filter((c) => c.positionId === selectedPosition)
    }
    if (selectedParty !== "all") {
      allLocalCandidates = allLocalCandidates.filter((c) => c.partyId === selectedParty)
    }
    if (selectedStatus !== "all") {
      allLocalCandidates = allLocalCandidates.filter((c) => c.status === selectedStatus)
    }

    return allLocalCandidates
  }

  const allCandidates = getCandidates().filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.platform.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredPartyLists = partyListGroups.filter((pl) => {
    const matchesSearch =
      pl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSector = selectedSector === "all" || pl.sector === selectedSector

    return matchesSearch && matchesSector
  })

  const totalPages = Math.ceil(allCandidates.length / CANDIDATES_PER_PAGE)
  const startIndex = (currentPage - 1) * CANDIDATES_PER_PAGE
  const endIndex = startIndex + CANDIDATES_PER_PAGE
  const candidates = allCandidates.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const locationInfo = selectedLocation
    ? {
        region: getRegionById(selectedLocation.regionId),
        city: getCityById(selectedLocation.cityId),
        barangay: getBarangaysByCity(selectedLocation.cityId).find((b) => b.id === selectedLocation.barangayId),
      }
    : null

  const sectors = ["all", ...Array.from(new Set(partyListGroups.map((pl) => pl.sector)))]

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    scrollToTop()
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <T>Back</T>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/posts/create">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <T>Create Post</T>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  <T>Profile</T>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <GovernmentNav value={governmentLevel} onValueChange={setGovernmentLevel} />
        </div>

        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant={view === "candidates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("candidates")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            <T>Candidates</T>
          </Button>
          <Button
            variant={view === "statistics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("statistics")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <T>Statistics</T>
          </Button>
          <Button
            variant={view === "elections" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("elections")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            <T>Elections</T>
          </Button>
        </div>

        {view === "candidates" && (
          <>
            {governmentLevel === "partylist" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold"><T>Party-List Groups</T></h2>
                  <p className="text-sm text-muted-foreground">
                    <T>Browse party-list organizations representing various sectors of Philippine society</T>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium mb-2 block"><T>Sector</T></label>
                    <select
                      value={selectedSector}
                      onChange={(e) => handleFilterChange(setSelectedSector)(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="all"><T>All Sectors</T></option>
                      {sectors.slice(1).map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search party-list groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPartyLists.map((partyList) => (
                    <PartyListCard key={partyList.id} partyList={partyList} currentTab={governmentLevel} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {governmentLevel === "local" && (
                  <div className="space-y-4">
                    <LocationSelector onLocationChange={setSelectedLocation} />

                    {selectedLocation && locationInfo && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium"><T>Your Location</T></p>
                        <p className="text-xs text-muted-foreground">
                          {locationInfo.barangay?.name}, {locationInfo.city?.name}, {locationInfo.region?.name}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {(governmentLevel === "national" || selectedLocation) && (
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <PositionFilter
                        level={governmentLevel === "national" ? "national" : "barangay"}
                        value={selectedPosition}
                        onValueChange={handleFilterChange(setSelectedPosition)}
                      />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <PartyFilter value={selectedParty} onValueChange={handleFilterChange(setSelectedParty)} />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <StatusFilter value={selectedStatus} onValueChange={handleFilterChange(setSelectedStatus)} />
                    </div>
                  </div>
                )}

                {governmentLevel === "local" && !selectedLocation && (
                  <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2"><T>Select Your Location</T></h3>
                    <p className="text-sm text-muted-foreground">
                      <T>Choose your region, city, and barangay to see local candidates</T>
                    </p>
                  </div>
                )}

                {(governmentLevel === "national" || selectedLocation) && (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search candidates by name or platform..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                          {governmentLevel === "national" ? <T>National Candidates</T> : <T>Local Candidates</T>}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {allCandidates.length} <T>candidates found</T>
                        </p>
                      </div>

                      {candidates.length === 0 ? (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                          <p className="text-muted-foreground"><T>No candidates found matching your criteria</T></p>
                        </div>
                      ) : (
                        <>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {candidates.map((candidate) => (
                              <CandidateCard key={candidate.id} candidate={candidate} currentTab={governmentLevel} />
                            ))}
                          </div>

                          {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                                <T>Previous</T>
                              </Button>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                    className="w-10"
                                  >
                                    {page}
                                  </Button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                              >
                                <T>Next</T>
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {view === "statistics" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold"><T>Candidate Statistics</T></h2>
              <p className="text-muted-foreground"><T>Insights and analytics about candidates and elections</T></p>
            </div>

            {/* Top Trending Now */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold"><T>Top Trending Now</T></h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2"><T>Most Discussed Election</T></div>
                    <div className="text-lg font-bold">Quezon City Mayor</div>
                    <p className="text-xs text-muted-foreground mt-2">234 <T>discussions</T></p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2"><T>Hottest Topic</T></div>
                    <div className="text-lg font-bold">Infrastructure & Development</div>
                    <p className="text-xs text-muted-foreground mt-2">567 <T>mentions</T></p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-2"><T>Most Viewed Candidate</T></div>
                    <div className="text-lg font-bold">Ferdinand Marcos Jr.</div>
                    <p className="text-xs text-muted-foreground mt-2">12,456 <T>views</T></p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold"><T>Platform Statistics</T></h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-4"><T>Total Registered Politicians</T></div>
                    <div className="text-4xl font-bold text-primary">1,247</div>
                    <p className="text-xs text-muted-foreground mt-2"><T>Across all levels and positions</T></p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-muted-foreground mb-4"><T>Total Discussions</T></div>
                    <div className="text-4xl font-bold text-primary">8,934</div>
                    <p className="text-xs text-muted-foreground mt-2"><T>Active community engagement</T></p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <MockElectionResults />

            {/* Regional Distribution */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold"><T>Candidate Distribution by Region</T></h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { region: "NCR", candidates: 234 },
                  { region: "CALABARZON", candidates: 189 },
                  { region: "Central Visayas", candidates: 167 },
                  { region: "Davao Region", candidates: 145 },
                  { region: "Central Luzon", candidates: 156 },
                  { region: "Western Visayas", candidates: 134 },
                ].map((item) => (
                  <Card key={item.region}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.region}</span>
                        <span className="text-lg font-bold text-primary">{item.candidates}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(item.candidates / 234) * 100}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Platform Accuracy */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold"><T>Mock Elections vs Actual Results</T></h3>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium"><T>Presidential Accuracy</T></span>
                        <span className="text-sm font-bold text-primary">87%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium"><T>Senatorial Accuracy</T></span>
                        <span className="text-sm font-bold text-primary">82%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium"><T>Local Elections Accuracy</T></span>
                        <span className="text-sm font-bold text-primary">79%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "79%" }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    <T>Based on comparison with actual election results from past elections</T>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {view === "elections" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold"><T>Election Schedule</T></h2>
              <p className="text-muted-foreground text-sm"><T>Upcoming Philippine elections and important dates</T></p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-sm"><T>National Elections</T></p>
                  <p className="text-xs text-muted-foreground">May 12, 2025</p>
                </div>
                <p className="text-xs font-medium"><T>President, Senate, House</T></p>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-sm"><T>Local Elections</T></p>
                  <p className="text-xs text-muted-foreground">May 12, 2025</p>
                </div>
                <p className="text-xs font-medium"><T>Mayor, Councilors, Barangay</T></p>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium text-sm"><T>Barangay Elections</T></p>
                  <p className="text-xs text-muted-foreground">May 12, 2025</p>
                </div>
                <p className="text-xs font-medium"><T>Captain, Kagawad, SK</T></p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <T>View full election schedule on our</T>{" "}
              <Link href="/elections" className="text-primary hover:underline">
                <T>Elections Page</T>
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MockElectionResults() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const partyColors: Record<string, string> = {
    PFP: "#0066cc",
    LP: "#ff0000",
    "Aksyon Demokratiko": "#0099ff",
    PROMDI: "#ffcc00",
    "PDP-Laban": "#003366",
    NPC: "#009900",
    "Lakas-CMD": "#ff6600",
    Akbayan: "#cc0099",
    NP: "#666666",
    PMP: "#ff9900",
    "Kabataan Partylist": "#ff3333",
    Gabriela: "#ff1493",
    "ACT Teachers": "#4169e1",
    ANAKALUSUGAN: "#228b22",
    "Serbisyo sa Bayan": "#8b4513",
  }

  const getPartyColor = (party: string) => {
    if (party === "-") return "#c4b5fd" // Light purple for "Others"
    return partyColors[party] || "#9ca3af" // Neutral gray for unknown parties
  }

  const sections = [
    {
      id: "president",
      title: "President",
      data: [
        { name: "Ferdinand Marcos Jr.", party: "PFP", votes: 45 },
        { name: "Leni Robredo", party: "LP", votes: 28 },
        { name: "Isko Moreno", party: "Aksyon Demokratiko", votes: 15 },
        { name: "Manny Pacquiao", party: "PROMDI", votes: 8 },
        { name: "Others", party: "-", votes: 4 },
      ],
    },
    {
      id: "vp",
      title: "Vice President",
      data: [
        { name: "Sara Duterte", party: "PDP-Laban", votes: 42 },
        { name: "Kiko Pangilinan", party: "LP", votes: 31 },
        { name: "Tito Sotto", party: "NPC", votes: 18 },
        { name: "Others", party: "-", votes: 9 },
      ],
    },
    {
      id: "senators",
      title: "Senators (Top 10)",
      data: [
        { name: "Risa Hontiveros", party: "Akbayan", votes: 32 },
        { name: "Raffy Tulfo", party: "NP", votes: 28 },
        { name: "Loren Legarda", party: "NPC", votes: 25 },
        { name: "Imee Marcos", party: "NP", votes: 22 },
        { name: "Bong Go", party: "PDP-Laban", votes: 20 },
        { name: "Cynthia Villar", party: "NPC", votes: 19 },
        { name: "Sherwin Gatchalian", party: "Lakas-CMD", votes: 18 },
        { name: "Pia Cayetano", party: "NP", votes: 17 },
        { name: "Sonny Angara", party: "NP", votes: 16 },
        { name: "Jinggoy Estrada", party: "PMP", votes: 15 },
      ],
    },
    {
      id: "partylist",
      title: "House Party-List",
      data: [
        { name: "Kabataan Partylist", party: "Kabataan Partylist", votes: 8 },
        { name: "Gabriela", party: "Gabriela", votes: 7 },
        { name: "ACT Teachers", party: "ACT Teachers", votes: 6 },
        { name: "ANAKALUSUGAN", party: "ANAKALUSUGAN", votes: 5 },
        { name: "Serbisyo sa Bayan", party: "Serbisyo sa Bayan", votes: 5 },
      ],
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold"><T>Mock Election Results</T></h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="pt-4">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-base"><T>{section.title}</T></h4>
                  <span className="text-xs text-muted-foreground">{expandedSection === section.id ? "▼" : "▶"}</span>
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="space-y-3 mt-3 pt-3 border-t">
                  {section.data.map((candidate, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground">{candidate.party}</p>
                        </div>
                        <span className="text-lg font-bold">{candidate.votes}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${candidate.votes}%`,
                            backgroundColor: getPartyColor(candidate.party),
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
