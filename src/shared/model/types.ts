export type ColumnDef<T> = {
  id: string
  header: string

  accessor: (row: T) => unknown

  cell?: (row: T) => React.ReactNode

  sortable?: boolean

  searchable?: boolean

  filter?: FilterConfig
}

type FilterConfig = {
  type: 'text' | 'select'
  options?: {
    label: string
    value: string
  }[]
}
