import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.userId, data.username, data.email)
      navigate('/')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="card max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Life Hub</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Willkommen zurück!
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
            <label className="block text-sm font-medium mb-2">Passwort</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          {loginMutation.isError && (
            <div className="text-red-600 text-sm text-center">
              Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Noch kein Konto?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}
