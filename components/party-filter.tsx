"use client"

import { parties } from "@/lib/candidate-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { T } from "@/components/auto-translate"

interface PartyFilterProps {
  value: string
  onValueChange: (value: string) => void
}

export function PartyFilter({ value, onValueChange }: PartyFilterProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium"><T>Party</T></label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"><T>All</T></SelectItem>
          {parties.map((party) => (
            <SelectItem key={party.id} value={party.id}>
              {party.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
