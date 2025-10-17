"use client"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSearchQuery } from "@/lib/slices/tableSlice"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector((state) => state.table.searchQuery)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="Search all fields..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="pl-10"
      />
    </div>
  )
}
