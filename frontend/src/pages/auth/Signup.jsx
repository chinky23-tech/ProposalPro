import { useState } from 'react'
import { authApi, saveAuthSession } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const validateSignup = (form) => {
  const nextErrors = {}

  if (!form.name.trim()) {
    nextErrors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    nextErrors.email = 'Email is required'
  }

  if (form.password.length < 6) {
    nextErrors.password = 'Use at least 6 characters'
  }

  if (form.confirmPassword !== form.password) {
    nextErrors.confirmPassword = 'Passwords must match'
  }

  return nextErrors
}

const Signup = ({ onSuccess, onModeChange }) => {
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

    const validationErrors = validateSignup(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setServerError('')

    try {
      const session = await authApi.signup({
        name: form.name.trim(),
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
        <p className="eyebrow">Start clean</p>
        <h2>Create your account</h2>
      </div>

      {serverError && (
        <div className="form-alert" role="alert">
          {serverError}
        </div>
      )}

      <Input
        label="Full name"
        name="name"
        placeholder="Alex Morgan"
        value={form.name}
        error={errors.name}
        onChange={updateField('name')}
        autoComplete="name"
      />

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
        placeholder="Create a password"
        value={form.password}
        error={errors.password}
        onChange={updateField('password')}
        autoComplete="new-password"
      />

      <Input
        label="Confirm password"
        type="password"
        name="confirmPassword"
        placeholder="Repeat your password"
        value={form.confirmPassword}
        error={errors.confirmPassword}
        onChange={updateField('confirmPassword')}
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full auth-submit" isLoading={isSubmitting}>
        Create account
      </Button>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={() => onModeChange('login')}>
          Sign in
        </button>
      </p>
    </form>
  )
}

export default Signup
