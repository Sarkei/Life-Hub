import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Profile {
  id: number
  name: string
  avatarUrl?: string
  color: string
  settings: {
    darkMode: boolean
    language: string
    timezone: string
    notifications: boolean
  }
}

interface ProfileState {
  currentProfile: Profile | null
  profiles: Profile[]
  setCurrentProfile: (profile: Profile) => void
  setProfiles: (profiles: Profile[]) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfile: null,
      profiles: [],
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      setProfiles: (profiles) => set({ profiles }),
    }),
    {
      name: 'profile-storage',
    }
  )
)
