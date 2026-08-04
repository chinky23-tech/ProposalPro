import { toast } from 'react-toastify'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
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

/**
 * Core API Request Handler with built-in toast notification support
 */
export const request = async (path, { method = 'GET', body, token, showErrorToast = true } = {}) => {
  const headers = {
    Accept: 'application/json',
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await parseResponse(response)

    if (!response.ok) {
      const errorMessage = data?.message || 'Request failed. Please try again.'
      
      // Trigger react-toastify error instead of native browser alert
      if (showErrorToast) {
        toast.error(errorMessage)
      }

      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Catch network failures/offline errors
    if (error.message === 'Failed to fetch' && showErrorToast) {
      toast.error('Network error. Please check your internet connection.')
    }
    throw error
  }
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