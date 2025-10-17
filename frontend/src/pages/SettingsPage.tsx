import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User, Lock, Bell, Palette, Globe, Shield, Trash2, Save } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { username, email, userId } = useAuthStore()
  
  const [settings, setSettings] = useState({
    displayName: username || '',
    email: email || '',
    language: 'de',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      reminders: true
    },
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showActivity: true
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSaveSettings = () => {
    console.log('Einstellungen gespeichert:', settings)
    // TODO: API call to save settings
    alert('Einstellungen erfolgreich gespeichert!')
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwörter stimmen nicht überein!')
      return
    }
    console.log('Passwort ändern')
    // TODO: API call to change password
    alert('Passwort erfolgreich geändert!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Bist du sicher, dass du dein Konto unwiderruflich löschen möchtest?')) {
      console.log('Konto löschen')
      // TODO: API call to delete account
      alert('Konto wurde gelöscht')
      navigate('/login')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Zurück
        </button>
      </div>

      {/* Profil-Einstellungen */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Profil-Informationen</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Benutzername</label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => setSettings({...settings, displayName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">E-Mail</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Benutzer-ID</label>
            <input
              type="text"
              value={userId || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Passwort ändern */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Passwort ändern</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Aktuelles Passwort</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Neues Passwort</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Passwort bestätigen</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Passwort aktualisieren
          </button>
        </div>
      </div>

      {/* Benachrichtigungen */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Benachrichtigungen</h2>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <span>E-Mail Benachrichtigungen</span>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, email: e.target.checked}
              })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <span>Push Benachrichtigungen</span>
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, push: e.target.checked}
              })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <span>Erinnerungen</span>
            <input
              type="checkbox"
              checked={settings.notifications.reminders}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {...settings.notifications, reminders: e.target.checked}
              })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Darstellung */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Darstellung</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
              <option value="auto">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sprache & Region */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Sprache & Region</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sprache</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privatsphäre */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-primary-600" size={24} />
          <h2 className="text-xl font-semibold">Privatsphäre & Sicherheit</h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Profil-Sichtbarkeit</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => setSettings({
                ...settings,
                privacy: {...settings.privacy, profileVisibility: e.target.value}
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="private">Privat</option>
              <option value="friends">Freunde</option>
              <option value="public">Öffentlich</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <span>E-Mail anzeigen</span>
            <input
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={(e) => setSettings({
                ...settings,
                privacy: {...settings.privacy, showEmail: e.target.checked}
              })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <span>Aktivität anzeigen</span>
            <input
              type="checkbox"
              checked={settings.privacy.showActivity}
              onChange={(e) => setSettings({
                ...settings,
                privacy: {...settings.privacy, showActivity: e.target.checked}
              })}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Speichern Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          <Save size={20} />
          <span>Alle Einstellungen speichern</span>
        </button>

        {/* Konto löschen */}
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          <Trash2 size={20} />
          <span>Konto löschen</span>
        </button>
      </div>
    </div>
  )
}
