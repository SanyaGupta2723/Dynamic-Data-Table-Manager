"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleColumnVisibility, addColumn, removeColumn, reorderColumns } from "@/lib/slices/tableSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Plus, Trash2, GripVertical } from "lucide-react"

export function ColumnManager() {
  const dispatch = useAppDispatch()
  const columns = useAppSelector((state) => state.table.columns)
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<"string" | "number" | "email">("string")
  const [open, setOpen] = useState(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn = {
        id: newColumnName.toLowerCase().replace(/\s+/g, "_"),
        label: newColumnName,
        visible: true,
        type: newColumnType,
      }
      dispatch(addColumn(newColumn))
      setNewColumnName("")
      setNewColumnType("string")
    }
  }

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null)
      setDragOverColumn(null)
      return
    }

    const draggedIndex = columns.findIndex((c) => c.id === draggedColumn)
    const targetIndex = columns.findIndex((c) => c.id === targetColumnId)

    const newColumns = [...columns]
    const [draggedCol] = newColumns.splice(draggedIndex, 1)
    newColumns.splice(targetIndex, 0, draggedCol)

    dispatch(reorderColumns(newColumns))
    setDraggedColumn(null)
    setDragOverColumn(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings size={16} />
          Manage Columns
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Columns */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Visible Columns (drag to reorder)</h3>
            {columns.map((column) => (
              <div
                key={column.id}
                draggable
                onDragStart={() => handleDragStart(column.id)}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`flex items-center justify-between p-2 border rounded cursor-move transition-colors ${
                  draggedColumn === column.id ? "opacity-50 bg-muted" : ""
                } ${dragOverColumn === column.id ? "bg-accent/50 border-accent" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-muted-foreground" />
                  <Checkbox
                    checked={column.visible}
                    onCheckedChange={() => dispatch(toggleColumnVisibility(column.id))}
                  />
                  <span className="text-sm">{column.label}</span>
                </div>
                {columns.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(removeColumn(column.id))}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Column */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-sm">Add New Column</h3>
            <Input placeholder="Column name" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} />
            <Select value={newColumnType} onValueChange={(value: any) => setNewColumnType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddColumn} className="w-full gap-2">
              <Plus size={16} />
              Add Column
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
