import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const OAuth2CallbackPage = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const email = searchParams.get('email')
    const error = searchParams.get('error')

    if (error) {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'GOOGLE_AUTH_ERROR', error },
          window.location.origin
        )
      }
      window.close()
      return
    }

    if (token && userId && username && email) {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
            userId: Number(userId),
            username,
            email,
          },
          window.location.origin
        )
      }
      window.close()
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="card max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Anmeldung wird verarbeitet...
        </p>
      </div>
    </div>
  )
}
