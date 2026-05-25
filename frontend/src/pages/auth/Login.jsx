import { useState } from 'react'
import { authApi, saveAuthSession } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const initialForm = {
  email: '',
  password: '',
}

const validateLogin = (form) => {
  const nextErrors = {}

  if (!form.email.trim()) {
    nextErrors.email = 'Email is required'
  }

  if (!form.password) {
    nextErrors.password = 'Password is required'
  }

  return nextErrors
}

const Login = ({ onSuccess, onModeChange }) => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: '',
    }))
    setServerError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateLogin(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setServerError('')

    try {
      const session = await authApi.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      saveAuthSession(session)
      onSuccess(session)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to ProposalPro</h2>
      </div>

      {serverError && (
        <div className="form-alert" role="alert">
          {serverError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={form.email}
        error={errors.email}
        onChange={updateField('email')}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        error={errors.password}
        onChange={updateField('password')}
        autoComplete="current-password"
      />

      <Button type="submit" className="w-full auth-submit" isLoading={isSubmitting}>
        Sign in
      </Button>

      <p className="auth-switch">
        New to ProposalPro?{' '}
        <button type="button" onClick={() => onModeChange('signup')}>
          Create account
        </button>
      </p>
    </form>
  )
}

export default Login
