"use client"

import { useState } from "react"
import { regions, getCitiesByRegion, getBarangaysByCity } from "@/lib/ph-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface LocationSelectorProps {
  onLocationChange: (location: { regionId: string; cityId: string; barangayId: string }) => void
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedBarangay, setSelectedBarangay] = useState<string>("")

  const availableCities = selectedRegion ? getCitiesByRegion(selectedRegion) : []
  const availableBarangays = selectedCity ? getBarangaysByCity(selectedCity) : []

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId)
    setSelectedCity("")
    setSelectedBarangay("")
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    setSelectedBarangay("")
  }

  const handleBarangayChange = (barangayId: string) => {
    setSelectedBarangay(barangayId)
    onLocationChange({
      regionId: selectedRegion,
      cityId: selectedCity,
      barangayId,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Your Location
        </CardTitle>
        <CardDescription>Choose your region, city, and barangay to see relevant candidates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegion && (
          <div className="space-y-2">
            <label className="text-sm font-medium">City/Municipality</label>
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCity && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Barangay</label>
            <Select value={selectedBarangay} onValueChange={handleBarangayChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select barangay" />
              </SelectTrigger>
              <SelectContent>
                {availableBarangays.map((barangay) => (
                  <SelectItem key={barangay.id} value={barangay.id}>
                    {barangay.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
