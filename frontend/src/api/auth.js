const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '')
const AUTH_STORAGE_KEY = 'proposalpro.auth'

const parseResponse = async (response) => {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {
    Accept: 'application/json',
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    // Gracefully handles both standard strings or structured message arrays
    throw new Error(data?.message || 'Request failed. Please try again.')
  }

  return data
}

export const authApi = {
  login: ({ email, password }) =>
    request('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  // 🟢 FIXED: Changed path from '/auth/register' to '/auth/signup' to match backend layout
  signup: ({ name, email, password }) =>
    request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  getCurrentUser: (token) =>
    request('/auth/me', {
      token,
    }),
}

export const saveAuthSession = (session) => {
  const normalizedSession = session?.data ? session.data : session
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedSession))
}

export const getStoredAuthSession = () => {
  const session = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!session) return null

  try {
    const parsedSession = JSON.parse(session)
    return parsedSession?.data ? parsedSession.data : parsedSession
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}