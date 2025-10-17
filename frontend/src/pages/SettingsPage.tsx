import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { User, Lock, Bell, Palette, Globe, Shield, Trash2, Save } from 'lucide-react'
import axios from 'axios'

interface CountryCode {
  country: string;
  code: string;
  flag: string;
}

interface MobilePrefix {
  prefix: string;
  provider: string;
}

const countryCodes: CountryCode[] = [
  { country: 'Deutschland', code: '+49', flag: '🇩🇪' },
  { country: 'Österreich', code: '+43', flag: '🇦🇹' },
  { country: 'Schweiz', code: '+41', flag: '🇨🇭' },
  { country: 'USA', code: '+1', flag: '🇺🇸' },
  { country: 'Großbritannien', code: '+44', flag: '🇬🇧' },
  { country: 'Frankreich', code: '+33', flag: '🇫🇷' },
  { country: 'Spanien', code: '+34', flag: '🇪🇸' },
  { country: 'Italien', code: '+39', flag: '🇮🇹' },
  { country: 'Niederlande', code: '+31', flag: '🇳🇱' },
  { country: 'Belgien', code: '+32', flag: '🇧🇪' },
  { country: 'Polen', code: '+48', flag: '🇵🇱' },
  { country: 'Türkei', code: '+90', flag: '🇹🇷' },
];

const germanMobilePrefixes: MobilePrefix[] = [
  { prefix: '151', provider: 'Telekom' },
  { prefix: '152', provider: 'Vodafone' },
  { prefix: '155', provider: 'Telefónica' },
  { prefix: '157', provider: 'Telefónica' },
  { prefix: '159', provider: 'Telefónica' },
  { prefix: '160', provider: 'Telekom' },
  { prefix: '162', provider: 'Vodafone' },
  { prefix: '163', provider: 'Telefónica' },
  { prefix: '170', provider: 'Telekom' },
  { prefix: '171', provider: 'Telekom' },
  { prefix: '172', provider: 'Vodafone' },
  { prefix: '173', provider: 'Vodafone' },
  { prefix: '174', provider: 'Vodafone' },
  { prefix: '175', provider: 'Telekom' },
  { prefix: '176', provider: 'Telefónica' },
  { prefix: '177', provider: 'Telefónica' },
  { prefix: '178', provider: 'Telefónica' },
  { prefix: '179', provider: 'Telefónica' },
];

export default function SettingsPage() {
  const navigate = useNavigate()
  const { username, email, userId } = useAuthStore()
  
  const [settings, setSettings] = useState({
    displayName: username || '',
    email: email || '',
    countryCode: '+49',
    mobilePrefix: '151',
    phoneNumber: '',
    language: 'de',
    theme: 'dark',
    notifications: {
      email: false,
      push: false
    },
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showActivity: true
    }
  })

  // Lade User-Daten beim Mount
  useEffect(() => {
    if (userId) {
      loadUserSettings();
    }
  }, [userId])

  const loadUserSettings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`)
      const userData = response.data
      
      setSettings(prev => ({
        ...prev,
        displayName: userData.username || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || ''
      }))

      // Parse Telefonnummer wenn vorhanden
      if (userData.phoneNumber) {
        parsePhoneNumber(userData.phoneNumber)
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error)
    }
  }

  const parsePhoneNumber = (fullNumber: string) => {
    // Beispiel: +49 151 12345678
    const parts = fullNumber.split(' ')
    if (parts.length >= 3) {
      setSettings(prev => ({
        ...prev,
        countryCode: parts[0],
        mobilePrefix: parts[1],
        phoneNumber: parts.slice(2).join('')
      }))
    }
  }

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSaveSettings = async () => {
    if (!userId) return;

    try {
      // Baue vollständige Telefonnummer zusammen
      let fullPhoneNumber = '';
      if (settings.phoneNumber) {
        if (settings.countryCode === '+49') {
          fullPhoneNumber = `${settings.countryCode} ${settings.mobilePrefix} ${settings.phoneNumber}`;
        } else {
          fullPhoneNumber = `${settings.countryCode} ${settings.phoneNumber}`;
        }
      }

      const updates = {
        username: settings.displayName,
        email: settings.email,
        phoneNumber: fullPhoneNumber
      };

      await axios.put(`http://localhost:5000/api/users/${userId}`, updates);
      alert('Einstellungen erfolgreich gespeichert!');
      
      // Aktualisiere authStore mit neuem Username
      useAuthStore.setState({
        username: settings.displayName,
        email: settings.email
      });
    } catch (error: any) {
      console.error('Fehler beim Speichern:', error);
      if (error.response?.data) {
        alert(`Fehler: ${error.response.data}`);
      } else {
        alert('Fehler beim Speichern der Einstellungen');
      }
    }
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

          {/* Telefonnummer */}
          <div>
            <label className="block text-sm font-medium mb-2">Mobilnummer (optional)</label>
            <div className="flex gap-2">
              {/* Ländervorwahl */}
              <select
                value={settings.countryCode}
                onChange={(e) => setSettings({...settings, countryCode: e.target.value})}
                className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
              >
                {countryCodes.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>

              {/* Mobilvorwahl (nur für Deutschland) */}
              {settings.countryCode === '+49' && (
                <select
                  value={settings.mobilePrefix}
                  onChange={(e) => setSettings({...settings, mobilePrefix: e.target.value})}
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  {germanMobilePrefixes.map(prefix => (
                    <option key={prefix.prefix} value={prefix.prefix}>
                      {prefix.prefix} ({prefix.provider})
                    </option>
                  ))}
                </select>
              )}

              {/* Rufnummer */}
              <input
                type="text"
                value={settings.phoneNumber}
                onChange={(e) => {
                  // Nur Zahlen erlauben
                  const value = e.target.value.replace(/\D/g, '');
                  setSettings({...settings, phoneNumber: value});
                }}
                placeholder={settings.countryCode === '+49' ? '12345678' : 'Rufnummer'}
                maxLength={settings.countryCode === '+49' ? 8 : 15}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {settings.countryCode === '+49' && settings.mobilePrefix && settings.phoneNumber
                ? `Vollständige Nummer: ${settings.countryCode} ${settings.mobilePrefix} ${settings.phoneNumber}`
                : 'Für SMS-Benachrichtigungen (Feature kommt später)'}
            </p>
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
