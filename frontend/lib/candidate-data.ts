// Candidate and election data
export type PositionLevel = "barangay" | "city" | "national"

export type PositionType =
  | "barangay-chairman"
  | "barangay-kagawad"
  | "mayor"
  | "vice-mayor"
  | "councilor"
  | "president"
  | "vice-president"
  | "senator"
  | "representative"

export interface Position {
  id: string
  name: string
  type: PositionType
  level: PositionLevel
  description: string
}

export interface Candidate {
  id: string
  name: string
  positionId: string
  imageUrl: string
  bio: string
  fullBiography?: string
  education?: Array<{ level: string; school: string }>
  achievements?: string[]
  platform: string[]
  contributions: string[]
  contributionImages?: string[]
  partyList?: string
  partyId?: string
  status?: "first-time" | "running-again"
  locationId: string
  locationType: "barangay" | "city" | "national"
  votes: number
  commentCount: number
}

export interface Comment {
  id: string
  candidateId: string
  userId: string
  userName: string
  content: string
  isAnonymous: boolean
  createdAt: Date
  likes: number
}

export interface Party {
  id: string
  name: string
  abbreviation?: string
}

export interface PartyListGroup {
  id: string
  name: string
  acronym?: string
  sector: string
  description: string
  platform: string[]
  nominees: PartyListNominee[]
}

export interface PartyListNominee {
  id: string
  name: string
  position: number
  imageUrl: string
  bio: string
  background: string[]
}

export const positions: Position[] = [
  // Barangay Level
  {
    id: "pos1",
    name: "Barangay Chairman",
    type: "barangay-chairman",
    level: "barangay",
    description: "Chief executive of the barangay",
  },
  {
    id: "pos2",
    name: "Barangay Kagawad",
    type: "barangay-kagawad",
    level: "barangay",
    description: "Member of the Sangguniang Barangay",
  },

  // City Level
  {
    id: "pos3",
    name: "Mayor",
    type: "mayor",
    level: "city",
    description: "Chief executive of the city/municipality",
  },
  {
    id: "pos4",
    name: "Vice Mayor",
    type: "vice-mayor",
    level: "city",
    description: "Presiding officer of the Sangguniang Panlungsod",
  },
  {
    id: "pos5",
    name: "City Councilor",
    type: "councilor",
    level: "city",
    description: "Member of the Sangguniang Panlungsod",
  },

  // National Level
  {
    id: "pos6",
    name: "President",
    type: "president",
    level: "national",
    description: "Head of State and Government of the Philippines",
  },
  {
    id: "pos7",
    name: "Vice President",
    type: "vice-president",
    level: "national",
    description: "First in line to succeed the President",
  },
  {
    id: "pos8",
    name: "Senator",
    type: "senator",
    level: "national",
    description: "Member of the Senate of the Philippines",
  },
  {
    id: "pos9",
    name: "House Representative",
    type: "representative",
    level: "national",
    description: "Member of the House of Representatives",
  },
]

export const parties: Party[] = [
  { id: "party1", name: "Partido Federal ng Pilipinas", abbreviation: "PFP" },
  { id: "party2", name: "Lakas-CMD" },
  { id: "party3", name: "Nacionalista Party", abbreviation: "NP" },
  { id: "party4", name: "Nationalist People's Coalition", abbreviation: "NPC" },
  { id: "party5", name: "Liberal Party", abbreviation: "LP" },
  { id: "party6", name: "PDP-Laban" },
  { id: "party7", name: "Akbayan Citizens Action Party" },
  { id: "party8", name: "Independent" },
  { id: "party9", name: "Serbisyo sa Bayan Party" },
  { id: "party10", name: "Hugpong ng Pagbabago" },
  { id: "party11", name: "Barug Team Rama" },
  { id: "party12", name: "Bando Osmeña Pundok Kauswagan", abbreviation: "BOPK" },
  { id: "party13", name: "Asenso Manileño" },
  { id: "party14", name: "ANAKALUSUGAN Party-List" },
]

export const partyListGroups: PartyListGroup[] = [
  {
    id: "pl1",
    name: "Kabataan Party-List",
    acronym: "KABATAAN",
    sector: "Youth",
    description: "Represents the interests of Filipino youth in education, employment, and social issues",
    platform: [
      "Free quality education for all",
      "Job creation and fair wages for youth",
      "Mental health support programs",
      "Climate justice and environmental protection",
    ],
    nominees: [
      {
        id: "pln1",
        name: "Raoul Manuel",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Youth leader and education advocate",
        background: ["Former student leader", "Education reform advocate", "Community organizer"],
      },
      {
        id: "pln2",
        name: "Sarah Elago",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and youth advocate",
        background: ["Former Kabataan representative", "Education bills author", "Youth rights advocate"],
      },
    ],
  },
  {
    id: "pl2",
    name: "Gabriela Women's Party",
    acronym: "GABRIELA",
    sector: "Women",
    description: "Advocates for women's rights, gender equality, and protection against violence",
    platform: [
      "End violence against women",
      "Equal pay and job opportunities",
      "Reproductive health rights",
      "Support for women workers and mothers",
    ],
    nominees: [
      {
        id: "pln3",
        name: "Arlene Brosas",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Women's rights advocate and legislator",
        background: ["Women's rights advocate", "Anti-violence legislation author", "Community organizer"],
      },
      {
        id: "pln4",
        name: "Luzviminda Ilagan",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and women's advocate",
        background: ["Former Gabriela representative", "Women's welfare bills", "Gender equality advocate"],
      },
    ],
  },
  {
    id: "pl3",
    name: "ACT Teachers Party-List",
    acronym: "ACT",
    sector: "Teachers",
    description: "Represents public school teachers and advocates for education reform",
    platform: [
      "Higher salaries for teachers",
      "Better school facilities and resources",
      "Teacher welfare and benefits",
      "Quality education for all students",
    ],
    nominees: [
      {
        id: "pln5",
        name: "France Castro",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Teacher and education reform advocate",
        background: ["Public school teacher", "Teachers' union leader", "Education reform advocate"],
      },
      {
        id: "pln6",
        name: "Antonio Tinio",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and education advocate",
        background: ["Former ACT representative", "Education bills author", "Teachers' rights advocate"],
      },
    ],
  },
  {
    id: "pl4",
    name: "Bayan Muna",
    sector: "Marginalized Sectors",
    description: "Represents various marginalized sectors including farmers, workers, and urban poor",
    platform: [
      "Land reform and farmers' rights",
      "Workers' rights and fair wages",
      "Affordable housing for urban poor",
      "Social justice and human rights",
    ],
    nominees: [
      {
        id: "pln7",
        name: "Carlos Zarate",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Human rights lawyer and advocate",
        background: ["Human rights lawyer", "Farmers' rights advocate", "Social justice champion"],
      },
      {
        id: "pln8",
        name: "Neri Colmenares",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and human rights lawyer",
        background: ["Former Bayan Muna representative", "Human rights legislation", "Workers' rights advocate"],
      },
    ],
  },
  {
    id: "pl5",
    name: "AGRI Party-List",
    acronym: "AGRI",
    sector: "Agriculture",
    description: "Represents farmers, fisherfolk, and agricultural workers",
    platform: [
      "Support for farmers and fisherfolk",
      "Agricultural modernization",
      "Fair prices for agricultural products",
      "Rural development programs",
    ],
    nominees: [
      {
        id: "pln9",
        name: "Wilbert Lee",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Agricultural advocate and businessman",
        background: ["Agricultural business owner", "Farmers' support programs", "Rural development advocate"],
      },
      {
        id: "pln10",
        name: "Nicanor Briones",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and agriculture advocate",
        background: ["Former AGRI representative", "Agricultural bills author", "Farmers' welfare advocate"],
      },
    ],
  },
  {
    id: "pl6",
    name: "ANAKALUSUGAN Party-List",
    acronym: "ANAKALUSUGAN",
    sector: "Health",
    description: "Advocates for accessible and affordable healthcare for all Filipinos",
    platform: [
      "Universal healthcare implementation",
      "Affordable medicines and medical services",
      "Better healthcare facilities",
      "Health workers' welfare",
    ],
    nominees: [
      {
        id: "pln11",
        name: "Ray Reyes",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Healthcare advocate and former representative",
        background: ["Healthcare advocate", "Universal healthcare champion", "Medical missions organizer"],
      },
      {
        id: "pln12",
        name: "Mike Defensor",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former congressman and health advocate",
        background: ["Former congressman", "Health bills author", "Healthcare access advocate"],
      },
      {
        id: "cand6",
        name: "Mike Defensor",
        position: 3,
        imageUrl: "/filipino-politician-professional-photo.jpg",
        bio: "Former congressman with infrastructure focus, also running for Quezon City Mayor",
        background: [
          "Former congressman and ANAKALUSUGAN member",
          "Authored housing bills in Congress",
          "Healthcare and infrastructure advocate",
        ],
      },
    ],
  },
  {
    id: "pl7",
    name: "Senior Citizens Party-List",
    acronym: "SENIOR CITIZENS",
    sector: "Senior Citizens",
    description: "Represents the interests and welfare of Filipino senior citizens",
    platform: [
      "Enhanced senior citizen benefits",
      "Healthcare support for elderly",
      "Pension and social security improvements",
      "Elder abuse prevention",
    ],
    nominees: [
      {
        id: "pln13",
        name: "Rodolfo Ordanes",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Senior citizens' rights advocate",
        background: ["Senior citizens' advocate", "Elderly welfare programs", "Healthcare access champion"],
      },
      {
        id: "pln14",
        name: "Francisco Datol Jr.",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Former representative and senior advocate",
        background: ["Former representative", "Senior benefits legislation", "Elderly rights advocate"],
      },
    ],
  },
  {
    id: "pl8",
    name: "1-PACMAN Party-List",
    acronym: "1-PACMAN",
    sector: "Sports and Youth",
    description: "Promotes sports development and youth empowerment through athletics",
    platform: [
      "Sports facilities development",
      "Support for Filipino athletes",
      "Youth sports programs",
      "Sports education and training",
    ],
    nominees: [
      {
        id: "pln15",
        name: "Michael Romero",
        position: 1,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Sports advocate and former representative",
        background: ["Sports development advocate", "Youth athletics programs", "Athletes' welfare champion"],
      },
      {
        id: "pln16",
        name: "Enrico Pineda",
        position: 2,
        imageUrl: "/placeholder.svg?height=400&width=400",
        bio: "Sports administrator and advocate",
        background: ["Sports administrator", "Youth sports programs", "Athletes' support advocate"],
      },
    ],
  },
]

export const mockCandidates: Candidate[] = [
  // ===== NATIONAL CANDIDATES =====
  // President
  {
    id: "cand17",
    name: "Ferdinand Marcos Jr.",
    positionId: "pos6",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Current president focused on unity, economic recovery, and infrastructure development",
    fullBiography:
      "Ferdinand Marcos Jr. is the current president of the Philippines, focused on national unity, economic recovery, and sustainable development. He brings extensive experience from his previous roles as senator and governor of Ilocos Norte. His administration prioritizes infrastructure development, agricultural modernization, and inclusive economic growth. He is committed to strengthening the nation's institutions and promoting regional development across all 17 regions of the Philippines.",
    education: [
      { level: "High School", school: "De La Salle University - Integrated School" },
      { level: "College", school: "University of the Philippines - Bachelor of Science in Economics" },
      { level: "College", school: "Oxford University - Master of Arts in Philosophy, Politics and Economics" },
    ],
    achievements: [
      "Served as Senator of the Philippines (2010-2022)",
      "Governor of Ilocos Norte (1998-2007, 2010-2016)",
      "Implemented infrastructure projects worth ₱50 billion in Ilocos Norte",
      "Authored agricultural modernization bills",
      "Established scholarship programs for underprivileged students",
      "Led disaster response and rehabilitation programs",
      "Promoted regional development and inter-regional cooperation",
      "Implemented digital transformation initiatives",
    ],
    platform: [
      "Economic recovery and inclusive growth",
      "Agricultural modernization and food security",
      "Infrastructure development (Build Build Build continuation)",
      "National unity and social cohesion",
      "Digital transformation and technology adoption",
      "Regional development and decentralization",
      "Environmental protection and climate action",
      "Education and skills development",
    ],
    contributions: [
      "Infrastructure projects in Ilocos Norte",
      "Agricultural modernization programs",
      "Disaster response and rehabilitation",
      "Digital transformation initiatives",
      "Regional development projects",
    ],
    contributionImages: [
      "/ribbon-cutting-ceremony.jpg",
      "/community-project-completion.jpg",
      "/community-gathering-event.jpg",
    ],
    partyList: "Partido Federal ng Pilipinas",
    partyId: "party1",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 456789,
    commentCount: 2341,
  },

  // ===== MANILA CANDIDATES =====
  // Mayor - Manila
  {
    id: "cand11",
    name: "Honey Lacuna",
    positionId: "pos3",
    imageUrl: "/filipina-doctor-mayor.jpg",
    bio: "Doctor and current mayor focused on healthcare",
    fullBiography:
      "Honey Lacuna is a doctor and current mayor of Manila, with a strong focus on healthcare services and public health programs. Her medical background gives her unique insight into healthcare challenges and solutions.",
    platform: ["Free healthcare services", "Hospital modernization", "Public health programs"],
    contributions: ["Expanded free medical services", "Modernized Manila hospitals"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg", "/community-project-completion.jpg"],
    partyList: "Asenso Manileño",
    partyId: "party13",
    status: "incumbent",
    locationId: "c1",
    locationType: "city",
    votes: 38765,
    commentCount: 198,
  },
]

export const mockComments: Comment[] = [
  {
    id: "com4",
    candidateId: "cand17",
    userId: "user4",
    userName: "Pedro Santos",
    content:
      "I'm curious about the agricultural modernization plans. Has this candidate released detailed proposals? Would love to hear from farmers in the community.",
    isAnonymous: false,
    createdAt: new Date("2025-01-13"),
    likes: 234,
  },
  {
    id: "com7",
    candidateId: "cand17",
    userId: "user7",
    userName: "Anonymous",
    content:
      "I'm still undecided. Can someone share their thoughts on this candidate's economic policies? Looking for honest opinions from fellow voters.",
    isAnonymous: true,
    createdAt: new Date("2025-01-10"),
    likes: 178,
  },
  {
    id: "com9",
    candidateId: "cand11",
    userId: "user9",
    userName: "Manila Resident",
    content:
      "I really appreciate Mayor Lacuna's healthcare programs. The free medical services have helped my family so much. We need more leaders like her!",
    isAnonymous: false,
    createdAt: new Date("2025-01-12"),
    likes: 145,
  },
]

export function getCandidatesByLocation(
  locationId: string,
  locationType: "barangay" | "city" | "national",
): Candidate[] {
  return mockCandidates.filter(
    (candidate) => candidate.locationId === locationId && candidate.locationType === locationType,
  )
}

export function getCandidatesByPosition(positionId: string, locationId?: string): Candidate[] {
  if (locationId) {
    return mockCandidates.filter(
      (candidate) =>
        candidate.positionId === positionId &&
        (candidate.locationId === locationId || candidate.locationType === "national"),
    )
  }
  return mockCandidates.filter((candidate) => candidate.positionId === positionId)
}

export function getCommentsByCandidate(candidateId: string): Comment[] {
  return mockComments.filter((comment) => comment.candidateId === candidateId)
}

export function getCandidatesByParty(partyId: string): Candidate[] {
  return mockCandidates.filter((candidate) => candidate.partyId === partyId)
}

export function getCandidatesByStatus(status: "incumbent" | "challenger"): Candidate[] {
  return mockCandidates.filter((candidate) => candidate.status === status)
}
