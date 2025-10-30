"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, User, MapPin, Loader2 } from "lucide-react"
import { T } from "@/components/auto-translate"
import { regions, cities } from "@/lib/ph-data"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [regionId, setRegionId] = useState("")
  const [cityId, setCityId] = useState("")
  const [barangay, setBarangay] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Filter cities based on selected region
  const filteredCities = useMemo(() => {
    if (!regionId) return []
    return cities.filter(city => city.regionId === regionId)
  }, [regionId])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [status, session, router])

  const detectLocation = async () => {
    setIsDetectingLocation(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use a more accurate Philippine-specific geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1&accept-language=en`
          )
          const data = await response.json()

          if (data.address) {
            // Try to match detected location with Philippine data
            const detectedRegion = data.address.state || data.address.region || ""
            const detectedCity = data.address.city || data.address.municipality || data.address.town || ""
            const detectedBarangay = data.address.suburb || data.address.neighbourhood || data.address.village || ""

            // Find matching region
            const matchedRegion = regions.find(r =>
              r.name.toLowerCase().includes(detectedRegion.toLowerCase()) ||
              detectedRegion.toLowerCase().includes(r.name.toLowerCase().split('(')[0].trim().toLowerCase())
            )

            if (matchedRegion) {
              setRegionId(matchedRegion.id)

              // Find matching city in that region
              const regionCities = cities.filter(c => c.regionId === matchedRegion.id)
              const matchedCity = regionCities.find(c =>
                c.name.toLowerCase().includes(detectedCity.toLowerCase()) ||
                detectedCity.toLowerCase().includes(c.name.toLowerCase())
              )

              if (matchedCity) {
                setCityId(matchedCity.id)
              }
            }

            // Set barangay (free text)
            if (detectedBarangay) {
              setBarangay(detectedBarangay)
            }
          }
        } catch (err) {
          setError("Failed to detect location. Please select manually.")
        } finally {
          setIsDetectingLocation(false)
        }
      },
      (err) => {
        setError("Unable to retrieve your location. Please select manually.")
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !regionId || !cityId) {
      setError("Name, region, and city are required")
      return
    }

    setIsLoading(true)

    try {
      // Get the actual names from IDs
      const selectedRegion = regions.find(r => r.id === regionId)
      const selectedCity = cities.find(c => c.id === cityId)

      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          region: selectedRegion?.name || "",
          city: selectedCity?.name || "",
          barangay
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
        setIsLoading(false)
        return
      }

      router.push("/browse")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
              <Vote className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl"><T>Complete Your Profile</T></CardTitle>
            <CardDescription>
              <T>Help us personalize your experience by completing your profile</T>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium"><T>Full Name</T></label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium"><T>Location</T></label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        <T>Detecting...</T>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3 w-3 mr-2" />
                        <T>Auto-detect</T>
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={regionId}
                    onChange={(e) => {
                      setRegionId(e.target.value)
                      setCityId("") // Reset city when region changes
                    }}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    disabled={!regionId}
                    required
                  >
                    <option value="">Select City/Municipality</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Barangay (optional)"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <T>Saving...</T> : <T>Continue to VoteHubPH</T>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
