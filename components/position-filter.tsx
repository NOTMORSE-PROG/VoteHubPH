"use client"

import { positions } from "@/lib/candidate-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { T } from "@/components/auto-translate"

interface PositionFilterProps {
  level: "barangay" | "city" | "national"
  value: string
  onValueChange: (value: string) => void
}

export function PositionFilter({ level, value, onValueChange }: PositionFilterProps) {
  const filteredPositions = positions.filter((p) => p.level === level)

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium"><T>Position</T></label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"><T>All</T></SelectItem>
          {filteredPositions.map((position) => (
            <SelectItem key={position.id} value={position.id}>
              {position.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
