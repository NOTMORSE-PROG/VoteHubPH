"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, ArrowLeft, ImageIcon, Plus, X } from "lucide-react"
import Link from "next/link"

export default function CreatePostPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [level, setLevel] = useState("")
  const [position, setPosition] = useState("")
  const [bio, setBio] = useState("")
  const [platform, setPlatform] = useState("")
  const [education, setEducation] = useState<Array<{ level: string; school: string }>>([])
  const [educationLevel, setEducationLevel] = useState("")
  const [educationSchool, setEducationSchool] = useState("")
  const [achievements, setAchievements] = useState<string[]>([])
  const [achievementsInput, setAchievementsInput] = useState("")
  const [contributions, setContributions] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const educationLevels = ["Elementary", "High School", "Senior High School", "College", "Graduate School", "Other"]

  const getPositionsByLevel = (selectedLevel: string) => {
    const positions: Record<string, string[]> = {
      National: ["President", "Vice President", "Senator", "Party-List Representative"],
      "Local (City/Municipality)": ["Mayor", "Vice Mayor", "City Councilor"],
      Barangay: ["Barangay Captain", "Barangay Kagawad", "SK Chairperson"],
    }
    return positions[selectedLevel] || []
  }

  const availablePositions = getPositionsByLevel(level)

  const addEducation = () => {
    if (educationLevel && educationSchool.trim()) {
      setEducation([...education, { level: educationLevel, school: educationSchool.trim() }])
      setEducationLevel("")
      setEducationSchool("")
    }
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const addAchievement = () => {
    if (achievementsInput.trim()) {
      setAchievements([...achievements, achievementsInput.trim()])
      setAchievementsInput("")
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !position || !level || !bio.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    // Simulate post creation
    setTimeout(() => {
      router.push("/browse")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/browse" className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">CivicVoicePH</h1>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
              <CardDescription>Share your profile and platform as a candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level *</label>
                  <select
                    value={level}
                    onChange={(e) => {
                      setLevel(e.target.value)
                      setPosition("") // Reset position when level changes
                    }}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select Level</option>
                    <option value="National">National</option>
                    <option value="Local (City/Municipality)">Local (City/Municipality)</option>
                    <option value="Barangay">Barangay</option>
                  </select>
                </div>

                {level && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position *</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select Position</option>
                      {availablePositions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Bio *</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/500</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Select Level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="School/University name"
                        value={educationSchool}
                        onChange={(e) => setEducationSchool(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background"
                      />
                      <Button type="button" onClick={addEducation} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {education.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold">•</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.level}</p>
                          <p className="text-xs text-muted-foreground">{item.school}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-muted-foreground hover:bg-muted/50 p-1 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Achievements</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add achievement (e.g., Led community development project)"
                      value={achievementsInput}
                      onChange={(e) => setAchievementsInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                      className="flex-1 h-10 px-3 rounded-md border border-input bg-background"
                    />
                    <Button type="button" onClick={addAchievement} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {achievements.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-sm flex-1">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="text-muted-foreground hover:bg-muted/50 p-1 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform & Advocacy</label>
                  <textarea
                    placeholder="What are your main platforms and advocacy areas?"
                    maxLength={1000}
                    rows={4}
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{platform.length}/1000</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Contributions</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition mb-3">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Add contribution photos</p>
                    <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                  <textarea
                    placeholder="Describe your key contributions and achievements..."
                    maxLength={1500}
                    rows={4}
                    value={contributions}
                    onChange={(e) => setContributions(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{contributions.length}/1500</p>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-2">Auto-generated Description</p>
                  <p className="text-xs text-muted-foreground">
                    Your post description will be automatically generated based on the information you provide above.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
