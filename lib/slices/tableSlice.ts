import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface TableRow {
  id: string
  name: string
  email: string
  age: number
  role: string
  [key: string]: any
}

export interface Column {
  id: string
  label: string
  visible: boolean
  type: "string" | "number" | "email"
}

interface TableState {
  rows: TableRow[]
  columns: Column[]
  sortBy: string | null
  sortOrder: "asc" | "desc"
  searchQuery: string
  currentPage: number
  rowsPerPage: number
  editingRow: string | null
  theme: "light" | "dark"
}

const initialColumns: Column[] = [
  { id: "name", label: "Name", visible: true, type: "string" },
  { id: "email", label: "Email", visible: true, type: "email" },
  { id: "age", label: "Age", visible: true, type: "number" },
  { id: "role", label: "Role", visible: true, type: "string" },
]

const initialRows: TableRow[] = [
  { id: "1", name: "John Doe", email: "john@example.com", age: 28, role: "Developer" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", age: 34, role: "Designer" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", age: 45, role: "Manager" },
  { id: "4", name: "Alice Williams", email: "alice@example.com", age: 29, role: "Developer" },
  { id: "5", name: "Charlie Brown", email: "charlie@example.com", age: 38, role: "Analyst" },
  { id: "6", name: "Diana Prince", email: "diana@example.com", age: 31, role: "Designer" },
  { id: "7", name: "Eve Davis", email: "eve@example.com", age: 26, role: "Developer" },
  { id: "8", name: "Frank Miller", email: "frank@example.com", age: 42, role: "Manager" },
  { id: "9", name: "Grace Lee", email: "grace@example.com", age: 33, role: "Analyst" },
  { id: "10", name: "Henry Wilson", email: "henry@example.com", age: 35, role: "Developer" },
  { id: "11", name: "Ivy Martinez", email: "ivy@example.com", age: 27, role: "Designer" },
  { id: "12", name: "Jack Taylor", email: "jack@example.com", age: 40, role: "Manager" },
]

const initialState: TableState = {
  rows: initialRows,
  columns: initialColumns,
  sortBy: null,
  sortOrder: "asc",
  searchQuery: "",
  currentPage: 0,
  rowsPerPage: 10,
  editingRow: null,
  theme: "light",
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<{ column: string; order: "asc" | "desc" }>) => {
      state.sortBy = action.payload.column
      state.sortOrder = action.payload.order
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 0
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find((c) => c.id === action.payload)
      if (column) {
        column.visible = !column.visible
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload)
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter((c) => c.id !== action.payload)
    },
    reorderColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload
    },
    setRows: (state, action: PayloadAction<TableRow[]>) => {
      state.rows = action.payload
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.rows[index] = action.payload
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((r) => r.id !== action.payload)
    },
    setEditingRow: (state, action: PayloadAction<string | null>) => {
      state.editingRow = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
    },
  },
})

export const {
  setSort,
  setSearchQuery,
  setCurrentPage,
  toggleColumnVisibility,
  addColumn,
  removeColumn,
  reorderColumns,
  setRows,
  updateRow,
  deleteRow,
  setEditingRow,
  toggleTheme,
} = tableSlice.actions

export default tableSlice.reducer
