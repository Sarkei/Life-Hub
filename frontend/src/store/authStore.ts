import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userId: number | null
  username: string | null
  email: string | null
  rememberMe: boolean
  setAuth: (token: string, userId: number, username: string, email: string, rememberMe?: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      email: null,
      rememberMe: true,
      setAuth: (token, userId, username, email, rememberMe = true) =>
        set({ token, userId, username, email, rememberMe }),
      logout: () =>
        set({ token: null, userId: null, username: null, email: null, rememberMe: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
