"use client"

import type React from "react"
import { useRef } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setRows } from "@/lib/slices/tableSlice"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import Papa from "papaparse"

export function ImportExport() {
  const dispatch = useAppDispatch()
  const { rows, columns } = useAppSelector((state) => state.table)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          const importedRows = results.data.map((row: any, index: number) => ({
            id: String(Date.now() + index),
            ...row,
          }))
          dispatch(setRows([...rows, ...importedRows]))
          alert(`Successfully imported ${importedRows.length} rows`)
        } catch (error) {
          alert("Error importing CSV: Invalid format")
        }
      },
      error: () => {
        alert("Error parsing CSV file")
      },
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExportCSV = () => {
    const visibleColumns = columns.filter((c) => c.visible)
    const csvData = rows.map((row) =>
      visibleColumns.reduce(
        (acc, col) => {
          acc[col.label] = row[col.id]
          return acc
        },
        {} as Record<string, any>,
      ),
    )

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `data-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex gap-2">
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
        <Upload size={16} />
        Import CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 bg-transparent">
        <Download size={16} />
        Export CSV
      </Button>
    </div>
  )
}
