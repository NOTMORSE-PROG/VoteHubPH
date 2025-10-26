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
  // ===== QUEZON CITY CANDIDATES =====
  // Barangay Chairman - Bagong Pag-asa
  {
    id: "cand1",
    name: "Maria Santos",
    positionId: "pos1",
    imageUrl: "/filipina-woman-professional-headshot.jpg",
    bio: "Community organizer with 15 years of experience in public service",
    fullBiography:
      "Maria Santos has been a dedicated community organizer for over 15 years, focusing on public service and community development. She has successfully implemented several key programs that have improved the quality of life for residents in Bagong Pag-asa. Her commitment to transparency and inclusive governance has earned her the trust of the community.",
    education: [
      { level: "Elementary", school: "Bagong Pag-asa Elementary School" },
      { level: "High School", school: "Quezon City High School" },
      { level: "College", school: "University of the Philippines - Bachelor of Science in Social Work" },
      { level: "College", school: "Asian Institute of Management - Certificate in Community Development" },
    ],
    achievements: [
      "Established the first barangay daycare center serving 150+ children",
      "Organized monthly medical missions reaching 500+ residents",
      "Led successful flood control initiatives reducing flooding by 60%",
      "Trained 200+ residents in livelihood skills",
      "Received Community Leader Award from Quezon City Government",
      "Implemented waste segregation program with 85% participation rate",
    ],
    platform: [
      "Improved waste management system",
      "Free skills training for residents",
      "Enhanced street lighting and security",
      "Community health programs",
      "Youth sports and recreation facilities",
      "Senior citizen welfare programs",
    ],
    contributions: [
      "Established the first barangay daycare center",
      "Organized monthly medical missions",
      "Led flood control initiatives",
      "Implemented waste segregation program",
    ],
    contributionImages: ["/community-project-completion.jpg", "/community-gathering-event.jpg"],
    status: "incumbent",
    locationId: "b13",
    locationType: "barangay",
    votes: 1247,
    commentCount: 34,
  },
  {
    id: "cand2",
    name: "Roberto Cruz",
    positionId: "pos1",
    imageUrl: "/filipino-man-professional-headshot.jpg",
    bio: "Former barangay kagawad and business owner",
    fullBiography:
      "Roberto Cruz is a former barangay kagawad and successful business owner who brings both community service experience and entrepreneurial skills to the table. He has a proven track record of supporting local development and economic growth. His business acumen has helped him create employment opportunities for residents.",
    education: [
      { level: "High School", school: "Bagong Pag-asa National High School" },
      { level: "College", school: "De La Salle University - Bachelor of Science in Business Administration" },
    ],
    achievements: [
      "Served as Barangay Kagawad for 3 terms",
      "Established 5 small businesses employing 50+ residents",
      "Donated computers to barangay hall",
      "Sponsored basketball league for youth",
    ],
    platform: [
      "Digital services for barangay transactions",
      "Youth sports development program",
      "Senior citizen welfare enhancement",
      "Local business support initiatives",
      "Microfinance programs for entrepreneurs",
    ],
    contributions: [
      "Donated computers to barangay hall",
      "Sponsored basketball league for youth",
      "Provided livelihood training",
      "Established business mentorship program",
    ],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    status: "challenger",
    locationId: "b13",
    locationType: "barangay",
    votes: 892,
    commentCount: 21,
  },

  // Barangay Kagawad - Bagong Pag-asa
  {
    id: "cand3",
    name: "Ana Reyes",
    positionId: "pos2",
    imageUrl: "/filipina-community-leader.jpg",
    bio: "Youth advocate and teacher",
    fullBiography:
      "Ana Reyes is a passionate youth advocate and teacher who has dedicated her career to empowering young people through education and community programs. She believes in creating opportunities for youth to succeed and contribute to society. Her innovative teaching methods have inspired hundreds of students.",
    education: [
      { level: "High School", school: "Quezon City Science High School" },
      { level: "College", school: "Philippine Normal University - Bachelor of Science in Education" },
      { level: "College", school: "Ateneo de Manila University - Master of Arts in Education" },
    ],
    achievements: [
      "Teacher of the Year Award (2022)",
      "Organized free tutoring sessions for 200+ students",
      "Established scholarship program for underprivileged youth",
      "Led youth leadership training programs",
    ],
    platform: [
      "Education support programs",
      "Youth employment initiatives",
      "Community library expansion",
      "Scholarship programs",
    ],
    contributions: ["Organized free tutoring sessions", "Established scholarship program", "Youth leadership training"],
    contributionImages: ["/community-gathering-event.jpg"],
    status: "challenger",
    locationId: "b13",
    locationType: "barangay",
    votes: 756,
    commentCount: 18,
  },
  {
    id: "cand4",
    name: "Jose Mendoza",
    positionId: "pos2",
    imageUrl: "/filipino-man-community-leader.jpg",
    bio: "Environmental advocate",
    fullBiography:
      "Jose Mendoza is an environmental advocate with a strong passion for protecting natural resources and promoting sustainable development. He has led several successful community initiatives focused on environmental conservation and climate action.",
    education: [
      { level: "High School", school: "Bagong Pag-asa National High School" },
      { level: "College", school: "University of the Philippines - Bachelor of Science in Environmental Science" },
    ],
    achievements: [
      "Led community garden project with 50+ participants",
      "Organized 12 clean-up drives removing 5 tons of waste",
      "Planted 1,000+ trees in the barangay",
      "Environmental Advocate Award (2023)",
    ],
    platform: [
      "Green spaces development",
      "Recycling programs",
      "Tree planting initiatives",
      "Environmental education",
    ],
    contributions: ["Led community garden project", "Organized clean-up drives", "Tree planting initiatives"],
    contributionImages: ["/community-project-completion.jpg"],
    status: "challenger",
    locationId: "b13",
    locationType: "barangay",
    votes: 623,
    commentCount: 12,
  },

  // Mayor - Quezon City
  {
    id: "cand5",
    name: "Joy Belmonte",
    positionId: "pos3",
    imageUrl: "/filipina-mayor-professional-photo.jpg",
    bio: "Current mayor focused on modernization and public health",
    fullBiography:
      "Joy Belmonte is the current mayor of Quezon City, known for her focus on modernization, public health initiatives, and sustainable development. She has implemented several innovative programs that have improved city services and quality of life for residents. Her leadership has transformed QC into a smart city.",
    education: [
      { level: "High School", school: "Assumption Convent School" },
      { level: "College", school: "Ateneo de Manila University - Bachelor of Arts in Economics" },
      { level: "College", school: "Harvard Kennedy School - Master in Public Administration" },
    ],
    achievements: [
      "Launched QC COVID-19 response program",
      "Established bike lanes across the city",
      "Modernized public markets",
      "Implemented smart city initiatives",
      "Reduced traffic congestion by 25%",
      "Expanded healthcare facilities",
    ],
    platform: [
      "Smart city initiatives",
      "Expanded healthcare facilities",
      "Traffic management solutions",
      "Environmental sustainability programs",
      "Education and skills training",
      "Livelihood programs for residents",
    ],
    contributions: [
      "Launched QC COVID-19 response program",
      "Established bike lanes across the city",
      "Modernized public markets",
      "Implemented smart city initiatives",
    ],
    contributionImages: ["/ribbon-cutting-ceremony.jpg", "/community-project-completion.jpg"],
    partyList: "Serbisyo sa Bayan Party",
    partyId: "party9",
    status: "incumbent",
    locationId: "c2",
    locationType: "city",
    votes: 45678,
    commentCount: 234,
  },
  {
    id: "cand6",
    name: "Mike Defensor",
    positionId: "pos3",
    imageUrl: "/filipino-politician-professional-photo.jpg",
    bio: "Former congressman with infrastructure focus",
    fullBiography:
      "Mike Defensor is a former congressman with a strong focus on infrastructure development and housing programs. He has a proven track record of successfully advocating for and implementing large-scale development projects. His experience in Congress has equipped him with the skills to manage city-wide initiatives.",
    education: [
      { level: "High School", school: "De La Salle University - Integrated School" },
      { level: "College", school: "De La Salle University - Bachelor of Science in Civil Engineering" },
      { level: "College", school: "University of the Philippines - Master in Public Administration" },
    ],
    achievements: [
      "Authored 15+ housing bills in Congress",
      "Facilitated infrastructure projects worth ₱2 billion",
      "Community outreach programs reaching 50,000+ residents",
      "Infrastructure Development Award (2021)",
    ],
    platform: [
      "Mass housing projects",
      "Road infrastructure improvement",
      "Job creation programs",
      "Anti-corruption measures",
      "Healthcare facility expansion",
      "Education infrastructure",
    ],
    contributions: [
      "Authored housing bills in Congress",
      "Facilitated infrastructure projects",
      "Community outreach programs",
      "Housing advocacy initiatives",
    ],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "ANAKALUSUGAN Party-List",
    partyId: "party14",
    status: "challenger",
    locationId: "c2",
    locationType: "city",
    votes: 38921,
    commentCount: 187,
  },

  // Vice Mayor - Quezon City
  {
    id: "cand7",
    name: "Gian Sotto",
    positionId: "pos4",
    imageUrl: "/filipino-vice-mayor-professional.jpg",
    bio: "Current vice mayor focused on youth and sports",
    fullBiography:
      "Gian Sotto is the current vice mayor of Quezon City, with a strong focus on youth development, sports programs, and community empowerment. He has established several successful youth initiatives that have positively impacted the city.",
    platform: ["Youth development programs", "Sports facilities improvement", "Education support"],
    contributions: ["Established sports programs", "Youth leadership training"],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "Serbisyo sa Bayan Party",
    partyId: "party9",
    status: "incumbent",
    locationId: "c2",
    locationType: "city",
    votes: 42134,
    commentCount: 156,
  },

  // City Councilors - Quezon City
  {
    id: "cand8",
    name: "Dorothy Delarmente",
    positionId: "pos5",
    imageUrl: "/filipina-councilor-professional.jpg",
    bio: "Incumbent councilor focused on women and children",
    fullBiography:
      "Dorothy Delarmente is an incumbent councilor with a strong focus on women's empowerment, child protection, and family welfare. She has authored several important ordinances that have improved the lives of women and children in the city.",
    platform: ["Women empowerment programs", "Child protection services", "Family welfare"],
    contributions: ["Authored women protection ordinances", "Established daycare centers"],
    contributionImages: ["/community-project-completion.jpg"],
    partyId: "party9",
    status: "incumbent",
    locationId: "c2",
    locationType: "city",
    votes: 35678,
    commentCount: 89,
  },
  {
    id: "cand9",
    name: "Bong Suntay",
    positionId: "pos5",
    imageUrl: "/filipino-councilor-professional.jpg",
    bio: "Business sector representative",
    fullBiography:
      "Bong Suntay represents the business sector with a focus on economic development, job creation, and business growth. He has successfully supported local businesses and organized several successful job fairs.",
    platform: ["Business development", "Job creation", "Economic growth"],
    contributions: ["Supported local businesses", "Job fairs organization"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyId: "party9",
    status: "incumbent",
    locationId: "c2",
    locationType: "city",
    votes: 32456,
    commentCount: 67,
  },

  // ===== MANILA CANDIDATES =====
  // Barangay Chairman - Ermita
  {
    id: "cand10",
    name: "Carlos Tan",
    positionId: "pos1",
    imageUrl: "/filipino-man-barangay-captain.jpg",
    bio: "Long-time resident and community leader",
    fullBiography:
      "Carlos Tan is a long-time resident and community leader who has dedicated his life to serving the community of Ermita. He brings deep local knowledge and a strong commitment to community development.",
    platform: ["Tourism development", "Heritage preservation", "Public safety enhancement"],
    contributions: ["Organized heritage tours", "Improved street lighting"],
    contributionImages: ["/community-gathering-event.jpg"],
    status: "incumbent",
    locationId: "b1",
    locationType: "barangay",
    votes: 892,
    commentCount: 23,
  },

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

  // ===== CEBU CITY CANDIDATES =====
  // Barangay Chairman - Lahug
  {
    id: "cand12",
    name: "Ramon Garcia",
    positionId: "pos1",
    imageUrl: "/filipino-man-cebuano-leader.jpg",
    bio: "Business owner and community organizer",
    fullBiography:
      "Ramon Garcia is a business owner and community organizer who brings both economic development experience and community service skills to the table. He has successfully organized business associations and improved community infrastructure.",
    platform: ["Business district development", "Traffic management", "Community safety"],
    contributions: ["Organized business association", "Improved barangay roads"],
    contributionImages: ["/community-project-completion.jpg"],
    status: "challenger",
    locationId: "b53",
    locationType: "barangay",
    votes: 1134,
    commentCount: 28,
  },

  // Mayor - Cebu City
  {
    id: "cand13",
    name: "Michael Rama",
    positionId: "pos3",
    imageUrl: "/filipino-cebu-mayor.jpg",
    bio: "Veteran politician focused on urban development",
    fullBiography:
      "Michael Rama is a veteran politician with a strong focus on urban development, infrastructure modernization, and business growth. He has successfully modernized city facilities and promoted Cebu's tourism industry.",
    platform: ["Infrastructure modernization", "Tourism development", "Business growth"],
    contributions: ["Modernized city facilities", "Promoted Cebu tourism"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg", "/community-gathering-event.jpg"],
    partyList: "Barug Team Rama",
    partyId: "party11",
    status: "incumbent",
    locationId: "c59",
    locationType: "city",
    votes: 52341,
    commentCount: 267,
  },
  {
    id: "cand14",
    name: "Raymond Garcia",
    positionId: "pos3",
    imageUrl: "/filipino-cebu-vice-mayor.jpg",
    bio: "Former vice mayor with business background",
    fullBiography:
      "Raymond Garcia is a former vice mayor with a strong business background who brings both administrative experience and economic development skills to the table. He has a proven track record of supporting local businesses and infrastructure projects.",
    platform: ["Economic development", "Job creation", "Infrastructure improvement"],
    contributions: ["Supported local businesses", "Infrastructure projects"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Bando Osmeña Pundok Kauswagan",
    partyId: "party12",
    status: "challenger",
    locationId: "c59",
    locationType: "city",
    votes: 48976,
    commentCount: 234,
  },

  // ===== DAVAO CITY CANDIDATES =====
  // Barangay Chairman - Poblacion
  {
    id: "cand15",
    name: "Linda Fernandez",
    positionId: "pos1",
    imageUrl: "/filipina-davao-barangay-captain.jpg",
    bio: "Social worker and community advocate",
    fullBiography:
      "Linda Fernandez is a social worker and community advocate who brings deep experience in social services and community development. She has successfully established community centers and youth skills training programs.",
    platform: ["Social services expansion", "Peace and order", "Youth programs"],
    contributions: ["Established community center", "Youth skills training"],
    contributionImages: ["/community-gathering-event.jpg"],
    status: "incumbent",
    locationId: "b63",
    locationType: "barangay",
    votes: 1456,
    commentCount: 34,
  },

  // Mayor - Davao City
  {
    id: "cand16",
    name: "Sebastian Duterte",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Current mayor continuing development programs",
    fullBiography:
      "Sebastian Duterte is the current mayor of Davao City, continuing development programs with a focus on peace and order, infrastructure development, and economic growth. He has maintained peace and order while implementing infrastructure projects.",
    platform: ["Peace and order", "Infrastructure development", "Economic growth"],
    contributions: ["Maintained peace and order", "Infrastructure projects"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Hugpong ng Pagbabago",
    partyId: "party10",
    status: "incumbent",
    locationId: "c81",
    locationType: "city",
    votes: 67890,
    commentCount: 345,
  },

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

  // Vice President
  {
    id: "cand18",
    name: "Sara Duterte",
    positionId: "pos7",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Current vice president and former Davao mayor",
    fullBiography:
      "Sara Duterte is the current vice president of the Philippines and former mayor of Davao City. She brings extensive local government experience and a strong focus on education reform, peace and order, and social services.",
    platform: ["Education reform", "Peace and order", "Social services"],
    contributions: ["Modernized Davao education", "Peace and order programs"],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "Lakas-CMD",
    partyId: "party2",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 423456,
    commentCount: 1987,
  },

  // Senators
  {
    id: "cand19",
    name: "Risa Hontiveros",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Incumbent senator advocating for health and human rights",
    fullBiography:
      "Risa Hontiveros is an incumbent senator with a strong advocacy for health and human rights. She has authored important legislation and championed various programs that have improved healthcare access and protection for vulnerable groups.",
    platform: [
      "Universal healthcare expansion",
      "Women and children protection",
      "Education reform",
      "Anti-corruption legislation",
    ],
    contributions: [
      "Authored Mental Health Act",
      "Championed Malasakit Centers",
      "Led investigations on public interest issues",
    ],
    contributionImages: ["/ribbon-cutting-ceremony.jpg", "/community-gathering-event.jpg"],
    partyList: "Akbayan Citizens Action Party",
    partyId: "party7",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 234567,
    commentCount: 892,
  },
  {
    id: "cand20",
    name: "Raffy Tulfo",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Broadcaster turned senator focused on public service",
    fullBiography:
      "Raffy Tulfo is a broadcaster turned senator with a strong focus on public service, accessible justice, and government transparency. He has helped thousands through public service programs and advocated for OFW rights.",
    platform: [
      "Accessible justice for all",
      "OFW welfare and protection",
      "Anti-red tape measures",
      "Transparent government services",
    ],
    contributions: [
      "Helped thousands through public service program",
      "Advocated for OFW rights",
      "Filed bills for government efficiency",
    ],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 289432,
    commentCount: 1024,
  },
  {
    id: "cand21",
    name: "Loren Legarda",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Veteran legislator focused on environment and culture",
    fullBiography:
      "Loren Legarda is a veteran legislator with a strong focus on environmental protection, disaster risk reduction, and cultural heritage preservation. She has authored important climate change laws and promoted Filipino arts and culture.",
    platform: [
      "Climate change mitigation",
      "Disaster risk reduction",
      "Cultural heritage preservation",
      "Sustainable development",
    ],
    contributions: ["Authored climate change laws", "Promoted Filipino arts and culture", "Led environmental advocacy"],
    contributionImages: ["/community-gathering-event.jpg", "/community-project-completion.jpg"],
    partyList: "Nationalist People's Coalition",
    partyId: "party4",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 198765,
    commentCount: 456,
  },
  {
    id: "cand22",
    name: "Imee Marcos",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator focused on education and culture",
    fullBiography:
      "Imee Marcos is a senator with a strong focus on education accessibility, cultural preservation, and infrastructure development. She has authored important education bills and cultural programs.",
    platform: ["Education accessibility", "Cultural preservation", "Infrastructure development"],
    contributions: ["Authored education bills", "Cultural programs"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 187654,
    commentCount: 423,
  },
  {
    id: "cand23",
    name: "Bong Go",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator focused on health and social services",
    fullBiography:
      "Bong Go is a senator with a strong focus on health and social services. He has established Malasakit Centers nationwide and implemented various healthcare programs.",
    platform: ["Malasakit Centers expansion", "Healthcare accessibility", "Social welfare programs"],
    contributions: ["Established Malasakit Centers nationwide", "Healthcare programs"],
    contributionImages: ["/community-project-completion.jpg", "/ribbon-cutting-ceremony.jpg"],
    partyList: "PDP-Laban",
    partyId: "party6",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 176543,
    commentCount: 389,
  },
  {
    id: "cand24",
    name: "Pia Cayetano",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator advocating for health and sports",
    fullBiography:
      "Pia Cayetano is a senator advocating for health programs, sports development, and women's empowerment. She has authored important health laws and implemented various sports programs.",
    platform: ["Health programs", "Sports development", "Women empowerment"],
    contributions: ["Authored health laws", "Sports programs"],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 165432,
    commentCount: 345,
  },
  {
    id: "cand25",
    name: "Win Gatchalian",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator focused on education and energy",
    fullBiography:
      "Win Gatchalian is a senator focused on education reform, energy security, and economic development. He has authored important education bills and energy programs.",
    platform: ["Education reform", "Energy security", "Economic development"],
    contributions: ["Education bills", "Energy programs"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 154321,
    commentCount: 312,
  },
  {
    id: "cand26",
    name: "Joel Villanueva",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator advocating for labor and employment",
    fullBiography:
      "Joel Villanueva is a senator advocating for job creation, skills training, and labor rights protection. He has implemented TESDA programs and employment initiatives.",
    platform: ["Job creation", "Skills training", "Labor rights protection"],
    contributions: ["TESDA programs", "Employment initiatives"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 143210,
    commentCount: 289,
  },
  {
    id: "cand27",
    name: "Cynthia Villar",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator focused on agriculture and environment",
    fullBiography:
      "Cynthia Villar is a senator focused on agricultural development, environmental protection, and food security. She has implemented agricultural programs and environmental laws.",
    platform: ["Agricultural development", "Environmental protection", "Food security"],
    contributions: ["Agricultural programs", "Environmental laws"],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 132109,
    commentCount: 267,
  },
  {
    id: "cand28",
    name: "Bong Revilla",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator and former actor",
    fullBiography:
      "Bong Revilla is a senator and former actor with a strong focus on infrastructure development, social services, and entertainment industry support. He has implemented infrastructure projects and social programs.",
    platform: ["Infrastructure development", "Social services", "Entertainment industry support"],
    contributions: ["Infrastructure projects", "Social programs"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Lakas-CMD",
    partyId: "party2",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 121098,
    commentCount: 234,
  },
  {
    id: "cand29",
    name: "Lito Lapid",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator and former actor focused on public service",
    fullBiography:
      "Lito Lapid is a senator and former actor focused on public service programs, infrastructure, and social welfare. He has implemented community programs and infrastructure support.",
    platform: ["Public service programs", "Infrastructure", "Social welfare"],
    contributions: ["Community programs", "Infrastructure support"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 110987,
    commentCount: 212,
  },
  {
    id: "cand30",
    name: "Mark Villar",
    positionId: "pos8",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Senator focused on infrastructure and housing",
    fullBiography:
      "Mark Villar is a senator focused on infrastructure development, housing programs, and public works. He has implemented the Build Build Build program and various housing projects.",
    platform: ["Infrastructure development", "Housing programs", "Public works"],
    contributions: ["Build Build Build program", "Housing projects"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg", "/community-gathering-event.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 109876,
    commentCount: 198,
  },
  {
    id: "cand31",
    name: "Marcelino Teodoro",
    positionId: "pos9",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Representative of Marikina City",
    fullBiography:
      "Marcelino Teodoro is a representative of Marikina City with a focus on local development, education support, and healthcare access. He has implemented local infrastructure projects and education programs.",
    platform: ["Local development", "Education support", "Healthcare access"],
    contributions: ["Local infrastructure projects", "Education programs"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 45678,
    commentCount: 123,
  },
  {
    id: "cand32",
    name: "Stella Quimbo",
    positionId: "pos9",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Representative and economist",
    fullBiography:
      "Stella Quimbo is a representative and economist with a focus on economic development, education reform, and healthcare. She has authored economic bills and implemented education programs.",
    platform: ["Economic development", "Education reform", "Healthcare"],
    contributions: ["Economic bills", "Education programs"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Liberal Party",
    partyId: "party5",
    status: "incumbent",
    locationId: "national",
    locationType: "national",
    votes: 43567,
    commentCount: 112,
  },
  {
    id: "cand33",
    name: "Benjamin Magalong",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Former police general and current mayor",
    fullBiography:
      "Benjamin Magalong is a former police general and current mayor with a strong focus on good governance, tourism development, and environmental protection. He has implemented anti-corruption programs and tourism initiatives.",
    platform: ["Good governance", "Tourism development", "Environmental protection"],
    contributions: ["Anti-corruption programs", "Tourism initiatives"],
    contributionImages: ["/community-gathering-event.jpg"],
    partyList: "Independent",
    partyId: "party8",
    status: "incumbent",
    locationId: "c18",
    locationType: "city",
    votes: 34567,
    commentCount: 178,
  },
  {
    id: "cand34",
    name: "Rolando Uy",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Business leader and mayor",
    fullBiography:
      "Rolando Uy is a business leader and mayor with a focus on economic development, infrastructure, and education. He has implemented business development programs and infrastructure projects.",
    platform: ["Economic development", "Infrastructure", "Education"],
    contributions: ["Business development programs", "Infrastructure projects"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "PDP-Laban",
    partyId: "party6",
    status: "incumbent",
    locationId: "c75",
    locationType: "city",
    votes: 41234,
    commentCount: 189,
  },
  {
    id: "cand35",
    name: "Jerry Treñas",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Veteran politician focused on urban development",
    fullBiography:
      "Jerry Treñas is a veteran politician focused on smart city initiatives, tourism, and infrastructure. He has modernized city facilities and implemented tourism programs.",
    platform: ["Smart city initiatives", "Tourism", "Infrastructure"],
    contributions: ["Modernized city facilities", "Tourism programs"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "c55",
    locationType: "city",
    votes: 38901,
    commentCount: 167,
  },
  {
    id: "cand36",
    name: "Alfredo Benitez",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Former congressman and current mayor",
    fullBiography:
      "Alfredo Benitez is a former congressman and current mayor with a focus on economic growth, tourism, and healthcare. He has implemented economic programs and healthcare initiatives.",
    platform: ["Economic growth", "Tourism", "Healthcare"],
    contributions: ["Economic programs", "Healthcare initiatives"],
    contributionImages: ["/ribbon-cutting-ceremony.jpg"],
    partyList: "Nacionalista Party",
    partyId: "party3",
    status: "incumbent",
    locationId: "c56",
    locationType: "city",
    votes: 36789,
    commentCount: 156,
  },
  {
    id: "cand37",
    name: "Ronnel Rivera",
    positionId: "pos3",
    imageUrl: "/placeholder.svg?height=400&width=400",
    bio: "Mayor focused on economic development",
    fullBiography:
      "Ronnel Rivera is a mayor focused on economic development, tuna industry support, and infrastructure. He has implemented industry development and infrastructure projects.",
    platform: ["Tuna industry support", "Infrastructure", "Education"],
    contributions: ["Industry development", "Infrastructure projects"],
    contributionImages: ["/community-project-completion.jpg"],
    partyList: "PDP-Laban",
    partyId: "party6",
    status: "incumbent",
    locationId: "c86",
    locationType: "city",
    votes: 33456,
    commentCount: 145,
  },
]

export const mockComments: Comment[] = [
  {
    id: "com1",
    candidateId: "cand1",
    userId: "user1",
    userName: "Juan dela Cruz",
    content:
      "I support your platform on waste management. Our barangay really needs this! Has anyone seen their actual implementation plans?",
    isAnonymous: false,
    createdAt: new Date("2025-01-15"),
    likes: 23,
  },
  {
    id: "com2",
    candidateId: "cand1",
    userId: "user2",
    userName: "Anonymous",
    content:
      "Does anyone know what specific plans they have for flood control? Our area gets flooded every rainy season and I want to know if this candidate has addressed this before.",
    isAnonymous: true,
    createdAt: new Date("2025-01-16"),
    likes: 45,
  },
  {
    id: "com3",
    candidateId: "cand19",
    userId: "user3",
    userName: "Maria Reyes",
    content:
      "I really appreciate the work on mental health legislation. This candidate has been consistent in advocating for this issue. Does anyone have updates on the latest bills filed?",
    isAnonymous: false,
    createdAt: new Date("2025-01-14"),
    likes: 156,
  },
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
    id: "com5",
    candidateId: "cand5",
    userId: "user5",
    userName: "Anonymous",
    content:
      "The traffic in QC is getting worse every day. I want to know if this candidate has a concrete plan. Has anyone attended their town halls?",
    isAnonymous: true,
    createdAt: new Date("2025-01-12"),
    likes: 89,
  },
  {
    id: "com6",
    candidateId: "cand13",
    userId: "user6",
    userName: "Cebuano Voter",
    content:
      "Cebu needs better infrastructure and I think this candidate understands that. Anyone know about their track record on infrastructure projects?",
    isAnonymous: false,
    createdAt: new Date("2025-01-11"),
    likes: 67,
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
    id: "com8",
    candidateId: "cand1",
    userId: "user8",
    userName: "Bagong Pag-asa Resident",
    content:
      "I've lived here for 20 years and I've seen the changes this person has made in our community. The daycare center has been a huge help to working parents like me.",
    isAnonymous: false,
    createdAt: new Date("2025-01-09"),
    likes: 56,
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
