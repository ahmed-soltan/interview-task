import type { User } from '#/entities/user/model/type'
import type { DataTableFeatures } from '#/shared/lib/data-table-feature'
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<DataTableFeatures, User>()

export const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    enableSorting: true,
    sortFn: 'text',
    meta: { filter: 'text', globalFilter: true },
  }),
  columnHelper.accessor('username', {
    header: 'Username',
    meta: { filter: 'text', globalFilter: true },
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    meta: { filter: 'text', globalFilter: true },
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    meta: { globalFilter: true },
  }),
  columnHelper.accessor('website', {
    header: 'Website',
    meta: { filter: 'text', globalFilter: true },
  }),
  columnHelper.accessor('company.name', {
    header: 'Company',
    meta: { filter: 'select' },
  }),
  columnHelper.accessor('address.city', {
    header: 'City',
    meta: { filter: 'select' },
  }),
])
