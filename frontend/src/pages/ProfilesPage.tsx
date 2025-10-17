import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileApi } from '../api'
import { useProfileStore } from '../store/profileStore'
import { useState, useEffect } from 'react'

interface ApiProfile {
  id: number
  name: string
  color: string
  avatarUrl?: string
  settings?: {
    darkMode: boolean
    language: string
    timezone: string
    notifications: boolean
  }
}

export default function ProfilesPage() {
  const queryClient = useQueryClient()
  const { currentProfile, setCurrentProfile, setProfiles } = useProfileStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProfile, setNewProfile] = useState({ name: '', color: '#6366f1' })

  const { data: profiles = [] } = useQuery<ApiProfile[]>({
    queryKey: ['profiles'],
    queryFn: profileApi.getProfiles,
  })

  // React Query 5.x: onSuccess wurde entfernt, verwende useEffect stattdessen
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      // Konvertiere API-Profile zu Store-Profile (mit Default-Settings)
      const storeProfiles = profiles.map(p => ({
        ...p,
        settings: p.settings || {
          darkMode: true,
          language: 'de',
          timezone: 'Europe/Berlin',
          notifications: true
        }
      }))
      setProfiles(storeProfiles)
    }
  }, [profiles, setProfiles])

  const createMutation = useMutation({
    mutationFn: profileApi.createProfile,
  })

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync(newProfile)
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      setShowCreateForm(false)
      setNewProfile({ name: '', color: '#6366f1' })
    } catch (error) {
      console.error('Create profile failed:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          + Neues Profil
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-6 animate-slide-up">
          <h2 className="text-xl font-semibold mb-4">Neues Profil erstellen</h2>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="input"
                value={newProfile.name}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Farbe</label>
              <input
                type="color"
                className="input"
                value={newProfile.color}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, color: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                Erstellen
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const storeProfile = {
            ...profile,
            settings: profile.settings || {
              darkMode: true,
              language: 'de',
              timezone: 'Europe/Berlin',
              notifications: true
            }
          }
          return (
            <div
              key={profile.id}
              className={`card cursor-pointer transition-all hover:scale-105 ${
                currentProfile?.id === profile.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setCurrentProfile(storeProfile)}
              style={{ borderLeftColor: profile.color, borderLeftWidth: '4px' }}
            >
              <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentProfile?.id === profile.id && '✓ Aktives Profil'}
              </p>
            </div>
          )
        })}
      </div>

      {profiles.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Noch keine Profile vorhanden. Erstelle dein erstes Profil!
          </p>
        </div>
      )}
    </div>
  )
}
