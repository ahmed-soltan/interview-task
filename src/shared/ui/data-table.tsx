'use client'

import { useTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import type { ColumnDef, RowData } from '@tanstack/react-table'

import { useDebounce } from '../hooks/use-debounce'
import { features } from '../lib/data-table-feature'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const PAGE_SIZES = [10, 25, 50, 100]

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]
  entityLabel?: string
  rowLabel?: string
  searchLabel?: string
  getRowId?: (row: TData, index: number) => string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  entityLabel = 'items',
  rowLabel = 'row',
  searchLabel = 'Search',
  getRowId,
}: DataTableProps<TData>) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 250)
  const table = useTable({
    features,
    data,
    columns,
    globalFilterFn: 'includesString',
    getColumnCanGlobalFilter: (column) => {
      const meta = column.columnDef.meta
      return Boolean(
        meta &&
        typeof meta === 'object' &&
        'globalFilter' in meta &&
        meta.globalFilter,
      )
    },
    getRowId,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const globalFilterColumns = useMemo(
    () =>
      table
        .getAllLeafColumns()
        .filter((column) => column.columnDef.meta?.globalFilter),
    [table],
  )

  useEffect(() => {
    table.setGlobalFilter(debouncedSearch)
  }, [debouncedSearch, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex w-full max-w-md flex-col gap-1 text-sm font-medium">
          {searchLabel}
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${globalFilterColumns
              .map((column) => column.columnDef.header)
              .join(', ')}`}
            className="h-10 rounded-md border border-[var(--line)] bg-white/80 px-3 font-normal outline-none transition focus:ring-2 focus:ring-[var(--lagoon)]"
          />
        </label>
        <div className="text-sm text-[var(--sea-ink-soft)]">
          {table.getFilteredRowModel().rows.length} of {data.length}{' '}
          {entityLabel}
          {table.getSelectedRowModel().rows.length > 0 &&
            ` • ${table.getSelectedRowModel().rows.length} selected`}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--line)] bg-white/70">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    aria-label={`Select all ${entityLabel}`}
                    checked={table.getIsAllPageRowsSelected()}
                    ref={(element) => {
                      if (element) {
                        element.indeterminate =
                          table.getIsSomePageRowsSelected() &&
                          !table.getIsAllPageRowsSelected()
                      }
                    }}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                </TableHead>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="font-semibold disabled:cursor-default"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <table.FlexRender header={header} />
                        {header.column.getIsSorted() === 'asc' && ' ↑'}
                        {header.column.getIsSorted() === 'desc' && ' ↓'}
                      </button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableHead />
              {table.getAllLeafColumns().map((column) => {
                const filter = column.columnDef.meta?.filter
                if (!filter) return <TableHead key={column.id} />

                if (filter === 'select') {
                  const options = Array.from(
                    new Set(
                      data
                        .map((row) => String(column.accessorFn?.(row, 0) ?? ''))
                        .filter(Boolean),
                    ),
                  ).sort()
                  return (
                    <TableHead key={column.id}>
                      <select
                        aria-label={`Filter ${String(column.columnDef.header)}`}
                        value={String(column.getFilterValue() ?? '')}
                        onChange={(event) =>
                          column.setFilterValue(event.target.value || undefined)
                        }
                        className="h-8 w-full rounded border border-[var(--line)] bg-white px-2 text-xs font-normal"
                      >
                        <option value="">All</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </TableHead>
                  )
                }

                return (
                  <TableHead key={column.id}>
                    <input
                      aria-label={`Filter ${String(column.columnDef.header)}`}
                      value={String(column.getFilterValue() ?? '')}
                      onChange={(event) =>
                        column.setFilterValue(event.target.value)
                      }
                      placeholder="Filter"
                      className="h-8 w-full min-w-20 rounded border border-[var(--line)] bg-white px-2 text-xs font-normal"
                    />
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${rowLabel} ${row.id}`}
                      checked={row.getIsSelected()}
                      disabled={!row.getCanSelect()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={table.state.pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="rounded border border-[var(--line)] bg-white px-2 py-1"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <span>
            Page {table.state.pagination.pageIndex + 1} of{' '}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-[var(--line)] px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-[var(--line)] px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
