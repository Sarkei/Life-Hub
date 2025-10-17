import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

// Hilfskomponente für Passwort-Anforderung
function PasswordRequirement({ label, valid }: { label: string; valid: boolean }) {
  return (
    <li className={valid ? 'text-green-600 flex items-center' : 'text-red-600 flex items-center'}>
      {valid ? (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      {label}
    </li>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await registerMutation.mutateAsync(formData)
      setAuth(data.token, data.userId, data.username, data.email)
      navigate('/')
    } catch (error) {
      // Error wird bereits von useMutation verwaltet
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="card max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Life Hub</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Erstelle dein Konto
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Benutzername</label>
            <input
              type="text"
              className="input"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">E-Mail</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Passwort</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={8}
            />
            {/* Passwort-Anforderungen */}
            <ul className="mt-2 space-y-1 text-sm">
              <PasswordRequirement
                label="Mindestens 8 Zeichen"
                valid={formData.password.length >= 8}
              />
              <PasswordRequirement
                label="Mindestens ein Großbuchstabe"
                valid={/[A-Z]/.test(formData.password)}
              />
              <PasswordRequirement
                label="Mindestens eine Zahl"
                valid={/[0-9]/.test(formData.password)}
              />
              <PasswordRequirement
                label="Mindestens ein Sonderzeichen"
                valid={/[^A-Za-z0-9]/.test(formData.password)}
              />
            </ul>
          </div>

          {registerMutation.isError && (
            <div className="text-red-600 text-sm text-center">
              Registrierung fehlgeschlagen. Benutzername oder E-Mail bereits vergeben.
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registrieren...' : 'Registrieren'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Bereits ein Konto?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}
