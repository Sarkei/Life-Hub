import { useState, useEffect } from 'react';
import axios from 'axios';
import { Scale, Plus, Trash2, TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react';
import { api } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';

interface Weight {
  id: number;
  userId: number;
  date: string;
  weight: number;
  notes?: string;
  createdAt: string;
}

interface WeightStats {
  currentWeight?: number;
  currentDate?: string;
  average?: number;
  min?: number;
  max?: number;
  totalEntries?: number;
  totalChange?: number;
  startWeight?: number;
  startDate?: string;
  sevenDayChange?: number;
  thirtyDayChange?: number;
}

export default function WeightPage() {
  const [weights, setWeights] = useState<Weight[]>([]);
  const [stats, setStats] = useState<WeightStats>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = useAuthStore.getState().userId || 1;

  useEffect(() => {
    loadWeights();
    loadStats();
  }, []);

  const loadWeights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(api.weight.getAll(userId));
      setWeights(response.data);
    } catch (error) {
      console.error('Error loading weights:', error);
      setError('Fehler beim Laden der Gewichtsdaten');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // TODO: Backend needs to implement /weight/{userId}/stats endpoint
      // For now, calculate stats from loaded weights
      if (weights.length > 0) {
        const sorted = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const latestWeight = sorted[sorted.length - 1];
        const oldestWeight = sorted[0];
        
        const calculatedStats: WeightStats = {
          currentWeight: latestWeight.weight,
          currentDate: latestWeight.date,
          startWeight: oldestWeight.weight,
          startDate: oldestWeight.date,
          average: weights.reduce((sum, w) => sum + w.weight, 0) / weights.length,
          min: Math.min(...weights.map(w => w.weight)),
          max: Math.max(...weights.map(w => w.weight)),
          totalEntries: weights.length,
          totalChange: latestWeight.weight - oldestWeight.weight,
        };
        
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newWeight || parseFloat(newWeight) <= 0) {
      setError('Bitte gib ein gültiges Gewicht ein');
      return;
    }

    try {
      await axios.post(api.weight.create(userId), {
        date: newDate,
        weight: parseFloat(newWeight),
        notes: newNotes || null
      });

      setSuccess('Gewicht erfolgreich hinzugefügt!');
      setNewWeight('');
      setNewNotes('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setShowAddModal(false);
      
      // Reload data
      loadWeights();
      loadStats();

      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError('Für dieses Datum existiert bereits ein Eintrag');
      } else {
        setError(error.response?.data || 'Fehler beim Speichern des Gewichts');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Möchtest du diesen Gewichtseintrag wirklich löschen?')) {
      return;
    }

    try {
      await axios.delete(api.weight.delete(userId, id));
      setSuccess('Eintrag gelöscht');
      loadWeights();
      loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Fehler beim Löschen');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="text-gray-400" size={20} />;
    if (change > 0) return <TrendingUp className="text-red-500" size={20} />;
    return <TrendingDown className="text-green-500" size={20} />;
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-gray-600';
    if (change > 0) return 'text-red-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold">Gewichts-Tracker</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Gewicht hinzufügen
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats.currentWeight && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Weight */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Aktuelles Gewicht</span>
              <Scale className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold">{stats.currentWeight.toFixed(1)} kg</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(stats.currentDate!)}</div>
          </div>

          {/* 7-Day Change */}
          {stats.sevenDayChange !== undefined && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">7-Tage Veränderung</span>
                {getTrendIcon(stats.sevenDayChange)}
              </div>
              <div className={`text-3xl font-bold ${getTrendColor(stats.sevenDayChange)}`}>
                {stats.sevenDayChange > 0 ? '+' : ''}{stats.sevenDayChange.toFixed(1)} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">Letzte Woche</div>
            </div>
          )}

          {/* 30-Day Change */}
          {stats.thirtyDayChange !== undefined && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">30-Tage Veränderung</span>
                {getTrendIcon(stats.thirtyDayChange)}
              </div>
              <div className={`text-3xl font-bold ${getTrendColor(stats.thirtyDayChange)}`}>
                {stats.thirtyDayChange > 0 ? '+' : ''}{stats.thirtyDayChange.toFixed(1)} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">Letzter Monat</div>
            </div>
          )}

          {/* Total Change */}
          {stats.totalChange !== undefined && (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gesamt-Veränderung</span>
                {getTrendIcon(stats.totalChange)}
              </div>
              <div className={`text-3xl font-bold ${getTrendColor(stats.totalChange)}`}>
                {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)} kg
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Von {stats.startWeight?.toFixed(1)} kg
              </div>
            </div>
          )}
        </div>
      )}

      {/* Additional Stats */}
      {stats.average && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Durchschnitt</div>
            <div className="text-2xl font-bold">{stats.average.toFixed(1)} kg</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Minimum</div>
            <div className="text-2xl font-bold">{stats.min?.toFixed(1)} kg</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Maximum</div>
            <div className="text-2xl font-bold">{stats.max?.toFixed(1)} kg</div>
          </div>
        </div>
      )}

      {/* Weight History Table */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Gewichtsverlauf</h2>
        
        {weights.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Scale className="mx-auto mb-4" size={48} />
            <p className="text-lg">Noch keine Gewichtseinträge vorhanden</p>
            <p className="text-sm mt-2">Füge deinen ersten Eintrag hinzu, um deinen Fortschritt zu verfolgen</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Datum</th>
                  <th className="text-left py-3 px-4">Gewicht</th>
                  <th className="text-left py-3 px-4">Veränderung</th>
                  <th className="text-left py-3 px-4">Notizen</th>
                  <th className="text-right py-3 px-4">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((weight, index) => {
                  const prevWeight = index < weights.length - 1 ? weights[index + 1].weight : null;
                  const change = prevWeight ? weight.weight - prevWeight : null;
                  
                  return (
                    <tr key={weight.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(weight.date)}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{weight.weight.toFixed(1)} kg</td>
                      <td className="py-3 px-4">
                        {change !== null && (
                          <div className={`flex items-center gap-1 ${getTrendColor(change)}`}>
                            {getTrendIcon(change)}
                            <span>{change > 0 ? '+' : ''}{change.toFixed(1)} kg</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {weight.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(weight.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Löschen"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Weight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Gewicht hinzufügen</h2>
            
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Datum</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gewicht (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="z.B. 75.5"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notizen (optional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Zusätzliche Notizen..."
                  className="input w-full"
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError('');
                    setNewWeight('');
                    setNewNotes('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
