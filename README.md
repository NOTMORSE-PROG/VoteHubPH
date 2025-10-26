# VoteHubPH 🇵🇭

**Your Voice Shapes the Future**

VoteHubPH is a comprehensive voting platform designed to empower Filipino citizens with transparent candidate information, community insights, and real-time engagement across all levels of Philippine government.

## Features

### 🗳️ Comprehensive Candidate Information
- Browse candidates at **local**, **national**, and **party-list** levels
- Detailed candidate profiles including:
  - Platform and advocacy
  - Past contributions and achievements
  - Education background
  - Party affiliations
  - Bio and personal information

### 🌏 Multi-Language Support
- **Automatic Translation**: English to Filipino (Tagalog)
- Powered by MyMemory Translation API
- All UI text and candidate information dynamically translated
- Seamless language switching in settings

### 📍 Location-Based Discovery
- Find candidates specific to your:
  - Barangay
  - City/Municipality
  - Region
- Coverage across all **17 regions** of the Philippines
- **100+ cities** and municipalities
- **500+ barangays**

### 🎨 Modern User Interface
- Clean, responsive design
- Dark mode support
- Accessible hover effects for better usability
- Mobile-friendly interface
- Smooth transitions and animations

### 🔒 Privacy & Security
- Anonymous voting option
- Secure data handling
- Privacy-first approach
- Election alerts and notifications

### 🏛️ Government Levels Coverage
- **Local Government**: Barangay, Municipal, City officials
- **National Government**: Senators, Representatives
- **Party-List**: Organizations representing various sectors

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library

### State Management
- React Context API for language and state management
- Local Storage for user preferences

### Translation
- MyMemory Translation API
- Custom `<T>` component for automatic translation
- Dynamic content translation with caching

### UI Components
- Custom button component with multiple variants
- Card components for candidate and party-list display
- Filter components for search and discovery
- Responsive navigation

## Project Structure

```
INTEG/
├── app/                          # Next.js App Router pages
│   ├── browse/                   # Browse candidates page
│   ├── candidate/[id]/           # Individual candidate detail page
│   ├── elections/                # Elections & statistics page
│   ├── partylist/                # Party-list page
│   ├── settings/                 # Settings page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # UI primitives (button, card, etc.)
│   ├── auto-translate.tsx        # Translation component
│   ├── candidate-card.tsx        # Candidate card component
│   ├── partylist-card.tsx        # Party-list card component
│   ├── government-nav.tsx        # Government level navigation
│   └── filters/                  # Filter components
├── lib/                          # Utility libraries
│   ├── language-context.tsx     # Language context provider
│   ├── translation-service.ts   # Translation API service
│   ├── mock-data.ts             # Mock candidate data
│   └── utils.ts                 # Utility functions
└── public/                       # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NOTMORSE-PROG/VoteHubPH.git
cd VoteHubPH
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Browsing Candidates
1. Navigate to the **Browse** page
2. Use filters to narrow down by:
   - Government level (Local, National, Party-List)
   - Region
   - City/Municipality
   - Position
   - Party affiliation
   - Candidacy status
3. Click on any candidate to view detailed information

### Language Settings
1. Go to **Settings**
2. Select preferred language (English or Filipino)
3. All content will be automatically translated

### Party-List Information
- Browse party-list organizations
- View sectors represented
- Read detailed descriptions and platforms
- Note: Party names remain in original language, descriptions are translated

## Key Features Explained

### Automatic Translation System
The app uses a custom `<T>` component that automatically translates text:
```tsx
<T>Hello World</T>  // Automatically translates to "Kamusta Mundo" in Filipino
```

Dynamic content is translated using the `useTranslate` hook:
```tsx
const translatedBio = useTranslate(candidate.bio)
```

### Accessibility
- High-contrast hover effects for better visibility
- Keyboard navigation support
- Screen reader friendly
- Designed with vision impairment considerations

## Data Coverage

- **1000+** Candidates
- **17** Regions across the Philippines
- **100+** Cities and Municipalities
- **500+** Barangays
- **Multiple** Party-List Organizations

## Future Enhancements

- [ ] Real-time election results
- [ ] Community forums and discussions
- [ ] Candidate comparison tool
- [ ] Voting reminders and notifications
- [ ] Mobile app version
- [ ] Integration with official COMELEC data
- [ ] User authentication and profiles
- [ ] Saved candidates and bookmarks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact & Support

- **Version**: 1.0.0
- **Platform**: VoteHubPH
- **Support**: Contact through GitHub issues

---

**VoteHubPH** - Empowering informed voting decisions across the Philippines 🇵🇭

*Your voice shapes the future*
