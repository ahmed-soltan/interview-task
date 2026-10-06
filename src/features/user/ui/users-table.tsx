import { DataTable } from '#/shared/ui/data-table'
import { Skeleton } from '#/shared/ui/skeleton'
import type { User } from '#/entities/user/model/type'
import { useGetUsers } from '../services/use-get-users'
import { columns } from './columns'

const UsersTable = () => {
  const { users, isError, isLoading, error, refetch } = useGetUsers()

  if (isLoading) {
    return (
      <section
        className="w-full space-y-4"
        aria-label="Loading users"
        aria-busy="true"
      >
        <Skeleton className="h-10 w-full max-w-md bg-white/60" />
        <div className="overflow-hidden rounded-md border border-[var(--line)] bg-white/60">
          <Skeleton className="h-10 rounded-none border-b border-[var(--line)] bg-white/60" />
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-8" />
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">
          Loading users...
        </p>
      </section>
    )
  }

  if (isError) {
    return (
      <section
        className="flex w-full flex-col items-center gap-3 rounded-md border border-red-200 bg-red-50 p-8 text-center"
        role="alert"
      >
        <h2 className="text-lg font-semibold text-red-900">
          Unable to load users
        </h2>
        <p className="text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : 'Something went wrong while fetching the users.'}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </section>
    )
  }

  return (
    <div className="w-full">
      <DataTable<User>
        columns={columns}
        data={users ?? []}
        entityLabel="users"
        rowLabel="user"
        searchLabel="Search users"
        getRowId={(user) => String(user.id)}
      />
    </div>
  )
}

export default UsersTable
