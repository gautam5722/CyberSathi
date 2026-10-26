
const API_BASE_URL = 'http://localhost:3000'

let refreshPromise: Promise<string | null> | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          sessionStorage.removeItem('adminToken')
          return null
        }

        const data = await response.json()

        if (!data.accessToken) {
          sessionStorage.removeItem('adminToken')
          return null
        }

        sessionStorage.setItem('adminToken', data.accessToken)
        return data.accessToken as string
      } catch {
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = sessionStorage.getItem('adminToken')

  const sendRequest = (accessToken: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
    })

  let response = await sendRequest(token)

  if (response.status === 401 && path !== '/auth/refresh') {
    token = await refreshAccessToken()

    if (token) {
      response = await sendRequest(token)
    }
  }

  return response
}

// Automatically refresh the access token every 12 minutes.
export function startTokenAutoRefresh(
  onSessionExpired: () => void,
) {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }

  const scheduleRefresh = () => {
    refreshTimer = setTimeout(async () => {
      const token = await refreshAccessToken()

      if (!token) {
        onSessionExpired()
        return
      }

      scheduleRefresh()
    }, 12 * 60 * 1000)
  }

  scheduleRefresh()

  return () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }
}
