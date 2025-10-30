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
    name: "2025 Philippine Midterm Elections",
    date: new Date("2025-05-12"),
    positions: ["Senators (12 seats)", "House Representatives (316 seats)", "Party-List Representatives (63 seats)", "Provincial Governors", "Vice Governors", "Provincial Board Members", "City/Municipal Mayors", "City/Municipal Vice Mayors", "City/Municipal Councilors"],
    level: "national",
    description: "Official COMELEC 2025 National and Local Elections. All Filipinos registered by September 30, 2024 are eligible to vote. Election period: January 12 - June 11, 2025.",
    votingLocations: [
      {
        region: "NCR",
        cities: ["Manila", "Quezon City", "Makati", "Pasig", "Taguig", "Caloocan", "Las Piñas", "Parañaque", "Muntinlupa", "Mandaluyong", "Marikina", "Pasay", "Valenzuela", "Malabon", "Navotas", "San Juan", "Pateros"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "CALABARZON",
        cities: ["Cavite City", "Laguna", "Batangas", "Rizal", "Quezon"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Central Visayas",
        cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Tagbilaran", "Dumaguete"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Davao Region",
        cities: ["Davao City", "Tagum", "Panabo", "Mati", "Digos"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Ilocos Region",
        cities: ["Laoag", "Vigan", "Batac", "San Fernando"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Central Luzon",
        cities: ["Angeles", "San Fernando", "Olongapo", "Malolos", "Cabanatuan"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Western Visayas",
        cities: ["Iloilo City", "Bacolod", "Roxas", "Kalibo"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
      },
      {
        region: "Northern Mindanao",
        cities: ["Cagayan de Oro", "Butuan", "Iligan", "Valencia"],
        votingCenters: ["Schools", "Barangay Halls", "Community Centers"],
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
