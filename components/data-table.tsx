"use client"

import { useMemo, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSort, setCurrentPage, setEditingRow, deleteRow } from "@/lib/slices/tableSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronUp, ChevronDown, Trash2, Edit2, Check, X } from "lucide-react"

export function DataTable() {
  const dispatch = useAppDispatch()
  const { rows, columns, sortBy, sortOrder, searchQuery, currentPage, rowsPerPage, editingRow } = useAppSelector(
    (state) => state.table,
  )
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      columns.some((col) => {
        const value = row[col.id]
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      }),
    )
  }, [rows, columns, searchQuery])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [filteredRows, sortBy, sortOrder])

  // Paginate rows
  const paginatedRows = useMemo(() => {
    const start = currentPage * rowsPerPage
    return sortedRows.slice(start, start + rowsPerPage)
  }, [sortedRows, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage)
  const visibleColumns = columns.filter((c) => c.visible)

  const handleSort = (columnId: string) => {
    const newOrder = sortBy === columnId && sortOrder === "asc" ? "desc" : "asc"
    dispatch(setSort({ column: columnId, order: newOrder }))
  }

  const handleEdit = (row: any) => {
    dispatch(setEditingRow(row.id))
    setEditValues(row)
  }

  const handleSaveEdit = () => {
    // Update row logic would go here
    dispatch(setEditingRow(null))
  }

  const handleCancelEdit = () => {
    dispatch(setEditingRow(null))
    setEditValues({})
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this row?")) {
      dispatch(deleteRow(id))
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className="cursor-pointer select-none hover:bg-muted/80 transition-colors"
                  onClick={() => handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {sortBy === column.id &&
                      (sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    {sortBy !== column.id && <ArrowUpDown size={16} className="opacity-40" />}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {visibleColumns.map((column) => (
                  <TableCell key={`${row.id}-${column.id}`}>
                    {editingRow === row.id ? (
                      <Input
                        value={editValues[column.id] || ""}
                        onChange={(e) => setEditValues({ ...editValues, [column.id]: e.target.value })}
                        className="h-8"
                      />
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    {editingRow === row.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={handleSaveEdit} className="h-8 w-8 p-0">
                          <Check size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(row.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {currentPage * rowsPerPage + 1} to {Math.min((currentPage + 1) * rowsPerPage, sortedRows.length)} of{" "}
          {sortedRows.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setCurrentPage(i))}
                className="w-8 h-8 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
