import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  username: string | null
  email: string | null
  setAuth: (token: string, userId: number, username: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      email: null,
      setAuth: (token, userId, username, email) =>
        set({ token, userId, username, email }),
      logout: () =>
        set({ token: null, userId: null, username: null, email: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
