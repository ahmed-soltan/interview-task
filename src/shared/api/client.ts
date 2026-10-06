const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

const apiClient = (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === 'string' && apiBaseUrl ? new URL(input, apiBaseUrl) : input

  return fetch(url, init)
}

export default apiClient
