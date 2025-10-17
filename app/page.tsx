"use client"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { DataTable } from "@/components/data-table"
import { SearchBar } from "@/components/search-bar"
import { ColumnManager } from "@/components/column-manager"
import { ImportExport } from "@/components/import-export"
import { ThemeToggle } from "@/components/theme-toggle"

function TableContent() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dynamic Data Table Manager</h1>
          <p className="text-muted-foreground">Manage, search, sort, and export your data with ease</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <div className="flex flex-wrap gap-2">
            <ColumnManager />
            <ImportExport />
            <ThemeToggle />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-6">
            <DataTable />
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Provider store={store}>
      <TableContent />
    </Provider>
  )
}
