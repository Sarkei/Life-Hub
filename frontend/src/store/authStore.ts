import { create } from 'zustand'

interface AuthState {
  token: string | null
  userId: number | null
  username: string | null
  email: string | null
  rememberMe: boolean
  setAuth: (token: string, userId: number, username: string, email: string, rememberMe?: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  userId: null,
  username: null,
  email: null,
  rememberMe: true,
  setAuth: (token, userId, username, email, rememberMe = true) =>
    set({ token, userId, username, email, rememberMe }),
  logout: () =>
    set({ token: null, userId: null, username: null, email: null, rememberMe: false }),
}))
