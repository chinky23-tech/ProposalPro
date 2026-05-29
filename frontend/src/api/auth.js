const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
const AUTH_STORAGE_KEY = 'proposalpro.auth'

const parseResponse = async (response) => {
  const text = await response.text()

  if (!text) {
    return null
  }

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
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export const getStoredAuthSession = () => {
  const session = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!session) {
    return null
  }

  try {
    return JSON.parse(session)
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
