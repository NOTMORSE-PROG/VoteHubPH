export interface ElectionEvent {
  id: string
  name: string
  date: Date
  positions: string[]
  level: "national" | "local"
  description: string
  votingLocations: VotingLocation[]
}

export interface VotingLocation {
  region: string
  cities: string[]
  votingCenters: string[]
}

export const electionSchedule: ElectionEvent[] = [
  {
    id: "election1",
    name: "National Elections 2025",
    date: new Date("2025-05-12"),
    positions: ["President", "Vice President", "Senators", "House Representatives"],
    level: "national",
    description: "General national elections for all national positions",
    votingLocations: [
      {
        region: "NCR",
        cities: ["Manila", "Quezon City", "Makati", "Pasig", "Taguig"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "CALABARZON",
        cities: ["Cavite City", "Laguna", "Batangas", "Rizal", "Quezon"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Central Visayas",
        cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Bohol"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Davao Region",
        cities: ["Davao City", "Tagum", "Panabo", "Mati"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
    ],
  },
  {
    id: "election2",
    name: "Local Elections - Metro Manila",
    date: new Date("2025-10-13"),
    positions: ["Mayor", "Vice Mayor", "City Councilors", "Barangay Officials"],
    level: "local",
    description: "Local elections for Metro Manila cities and municipalities",
    votingLocations: [
      {
        region: "NCR",
        cities: ["Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Caloocan", "Las Piñas", "Parañaque"],
        votingCenters: ["Barangay Halls", "Schools", "Community Centers"],
      },
    ],
  },
  {
    id: "election3",
    name: "Local Elections - Visayas",
    date: new Date("2025-10-13"),
    positions: ["Mayor", "Vice Mayor", "City Councilors", "Barangay Officials"],
    level: "local",
    description: "Local elections for Visayas region",
    votingLocations: [
      {
        region: "Central Visayas",
        cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Bohol", "Negros Oriental"],
        votingCenters: ["Barangay Halls", "Schools", "Community Centers"],
      },
      {
        region: "Western Visayas",
        cities: ["Iloilo City", "Bacolod", "Capiz", "Antique"],
        votingCenters: ["Barangay Halls", "Schools", "Community Centers"],
      },
    ],
  },
  {
    id: "election4",
    name: "Local Elections - Mindanao",
    date: new Date("2025-10-13"),
    positions: ["Mayor", "Vice Mayor", "City Councilors", "Barangay Officials"],
    level: "local",
    description: "Local elections for Mindanao region",
    votingLocations: [
      {
        region: "Davao Region",
        cities: ["Davao City", "Tagum", "Panabo", "Mati"],
        votingCenters: ["Barangay Halls", "Schools", "Community Centers"],
      },
      {
        region: "Northern Mindanao",
        cities: ["Cagayan de Oro", "Butuan", "Surigao"],
        votingCenters: ["Barangay Halls", "Schools", "Community Centers"],
      },
    ],
  },
  {
    id: "election5",
    name: "Barangay Elections - NCR",
    date: new Date("2025-11-10"),
    positions: ["Barangay Chairman", "Barangay Kagawad", "SK Chairman"],
    level: "local",
    description: "Barangay level elections for National Capital Region",
    votingLocations: [
      {
        region: "NCR",
        cities: ["All NCR Cities and Municipalities"],
        votingCenters: ["Barangay Halls", "Community Centers"],
      },
    ],
  },
  {
    id: "election6",
    name: "Special Elections",
    date: new Date("2025-12-08"),
    positions: ["Various Positions"],
    level: "local",
    description: "Special elections for vacant positions",
    votingLocations: [
      {
        region: "Various",
        cities: ["Designated Areas"],
        votingCenters: ["Barangay Halls", "Schools"],
      },
    ],
  },
]

export const candidateStatistics = {
  national: {
    president: { total: 8, incumbent: 1, challenger: 7 },
    vicePresident: { total: 6, incumbent: 1, challenger: 5 },
    senator: { total: 64, incumbent: 12, challenger: 52 },
    representative: { total: 312, incumbent: 187, challenger: 125 },
  },
  local: {
    mayor: { total: 145, incumbent: 89, challenger: 56 },
    viceMayor: { total: 145, incumbent: 78, challenger: 67 },
    councilor: { total: 890, incumbent: 534, challenger: 356 },
    barangayChairman: { total: 1200, incumbent: 720, challenger: 480 },
    barangayKagawad: { total: 4800, incumbent: 2880, challenger: 1920 },
  },
}

export const partyDistribution = [
  { name: "Partido Federal ng Pilipinas", candidates: 234, color: "hsl(var(--chart-1))" },
  { name: "Lakas-CMD", candidates: 198, color: "hsl(var(--chart-2))" },
  { name: "Nacionalista Party", candidates: 187, color: "hsl(var(--chart-3))" },
  { name: "Liberal Party", candidates: 156, color: "hsl(var(--chart-4))" },
  { name: "PDP-Laban", candidates: 145, color: "hsl(var(--chart-5))" },
  { name: "Others", candidates: 80, color: "hsl(var(--chart-1))" },
]

export const regionalDistribution = [
  { region: "NCR", candidates: 234 },
  { region: "CALABARZON", candidates: 189 },
  { region: "Central Visayas", candidates: 167 },
  { region: "Davao Region", candidates: 145 },
  { region: "Ilocos Region", candidates: 123 },
  { region: "Cagayan Valley", candidates: 98 },
  { region: "Central Luzon", candidates: 156 },
  { region: "Bicol Region", candidates: 87 },
  { region: "Western Visayas", candidates: 134 },
  { region: "Zamboanga Peninsula", candidates: 76 },
  { region: "Northern Mindanao", candidates: 89 },
  { region: "Soccsksargen", candidates: 92 },
  { region: "Caraga", candidates: 65 },
  { region: "ARMM", candidates: 54 },
  { region: "Cordillera", candidates: 78 },
  { region: "CAR", candidates: 71 },
  { region: "MIMAROPA", candidates: 83 },
]

export const candidatesByPosition = [
  { position: "President", count: 8, percentage: 0.8 },
  { position: "Vice President", count: 6, percentage: 0.6 },
  { position: "Senator", count: 64, percentage: 6.4 },
  { position: "House Representative", count: 312, percentage: 31.2 },
  { position: "Mayor", count: 145, percentage: 14.5 },
  { position: "Vice Mayor", count: 145, percentage: 14.5 },
  { position: "City Councilor", count: 890, percentage: 89 },
  { position: "Barangay Chairman", count: 1200, percentage: 120 },
]
