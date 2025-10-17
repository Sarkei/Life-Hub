import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  // Prüfe auf OAuth2-Redirect mit Token
  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const email = searchParams.get('email')
    
    if (token && userId && username && email) {
      setAuth(token, Number(userId), username, email)
      navigate('/')
    }
  }, [searchParams, setAuth, navigate])

  const loginMutation = useMutation({
    mutationFn: authApi.login,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await loginMutation.mutateAsync(formData)
      setAuth(data.token, data.userId, data.username, data.email)
      navigate('/')
    } catch (error) {
      // Error wird bereits von useMutation verwaltet
      console.error('Login failed:', error)
    }
  }

  const handleGoogleLogin = () => {
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2
    
    const popup = window.open(
      '/oauth2/authorization/google',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { token, userId, username, email } = event.data
        setAuth(token, userId, username, email)
        navigate('/')
        popup?.close()
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Cleanup
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Oder</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Mit Google anmelden</span>
        </button>

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