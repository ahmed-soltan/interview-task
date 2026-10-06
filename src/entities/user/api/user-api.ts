import type { User } from '../model/type'
import { usersSchema } from '../model/schema'
import apiClient from '#/shared/api/client'

export async function getUsers(): Promise<User[]> {
  const response = await apiClient('https://jsonplaceholder.typicode.com/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data: unknown = await response.json()
  return usersSchema.parse(data)
}
