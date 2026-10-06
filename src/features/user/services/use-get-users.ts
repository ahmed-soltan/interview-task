import { useQuery } from '@tanstack/react-query'

import { getUsers } from '#/entities/user/api/user-api'

export function useGetUsers() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return {
    users: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
