import { useState, useEffect } from 'react';
import axios from 'axios';
import { Apple, Target, TrendingUp, TrendingDown, Plus, Settings, Calendar, Flame } from 'lucide-react';

interface NutritionGoal {
  id?: number;
  userId: number;
  currentWeight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE';
  goalType: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT';
  dailyCalories: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
}

interface DailyNutrition {
  id?: number;
  userId: number;
  date: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

interface NutritionStats {
  goal?: NutritionGoal;
  today?: DailyNutrition;
  remainingCalories?: number;
  calorieProgress?: number;
  weeklyAverage?: number;
  monthlyAverage?: number;
  daysTracked?: number;
}

export default function NutritionPage() {
  const [goal, setGoal] = useState<NutritionGoal | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition | null>(null);
  const [stats, setStats] = useState<NutritionStats>({});
  const [recentEntries, setRecentEntries] = useState<DailyNutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    currentWeight: '',
    height: '',
    age: '',
    gender: 'MALE' as const,
    activityLevel: 'MODERATE' as const,
    goalType: 'MAINTAIN' as const
  });

  // Daily nutrition form state
  const [nutritionForm, setNutritionForm] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  const userId = 1; // TODO: Get from auth context

  useEffect(() => {
    loadGoal();
    loadTodayNutrition();
    loadStats();
    loadRecentEntries();
  }, []);

  const loadGoal = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/nutrition/goal?userId=${userId}`);
      setGoal(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error loading goal:', error);
      }
    }
  };

  const loadTodayNutrition = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/nutrition/daily/today?userId=${userId}`);
      setTodayNutrition(response.data);
    } catch (error) {
      console.error('Error loading today nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/nutrition/stats?userId=${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentEntries = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/nutrition/daily/recent?userId=${userId}&days=7`);
      setRecentEntries(response.data);
    } catch (error) {
      console.error('Error loading recent entries:', error);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8080/api/nutrition/goal', {
        userId,
        currentWeight: parseFloat(goalForm.currentWeight),
        height: parseInt(goalForm.height),
        age: parseInt(goalForm.age),
        gender: goalForm.gender,
        activityLevel: goalForm.activityLevel,
        goalType: goalForm.goalType
      });

      setSuccess('Kalorienziel erfolgreich gespeichert!');
      setShowGoalModal(false);
      loadGoal();
      loadStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data || 'Fehler beim Speichern');
    }
  };

  const handleAddNutrition = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8080/api/nutrition/daily', {
        userId,
        date: new Date().toISOString().split('T')[0],
        calories: parseInt(nutritionForm.calories),
        protein: nutritionForm.protein ? parseInt(nutritionForm.protein) : null,
        carbs: nutritionForm.carbs ? parseInt(nutritionForm.carbs) : null,
        fat: nutritionForm.fat ? parseInt(nutritionForm.fat) : null,
        notes: nutritionForm.notes || null
      });

      setSuccess('Ernährungseintrag gespeichert!');
      setShowAddModal(false);
      setNutritionForm({ calories: '', protein: '', carbs: '', fat: '', notes: '' });
      loadTodayNutrition();
      loadStats();
      loadRecentEntries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.response?.data || 'Fehler beim Speichern');
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'LOSE_WEIGHT': return 'Abnehmen';
      case 'MAINTAIN': return 'Halten';
      case 'GAIN_WEIGHT': return 'Zunehmen';
      default: return type;
    }
  };

  const getActivityLevelLabel = (level: string) => {
    switch (level) {
      case 'SEDENTARY': return 'Wenig Bewegung';
      case 'LIGHT': return 'Leichte Aktivität';
      case 'MODERATE': return 'Moderate Aktivität';
      case 'VERY_ACTIVE': return 'Sehr aktiv';
      case 'EXTREMELY_ACTIVE': return 'Extrem aktiv';
      default: return level;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // No goal set
  if (!goal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Apple className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold">Ernährung</h1>
          </div>
        </div>

        <div className="card text-center py-12">
          <Target className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-bold mb-2">Kalorienziel einrichten</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Erstelle dein persönliches Kalorienziel basierend auf deinen Zielen und Aktivitätslevel
          </p>
          <button onClick={() => setShowGoalModal(true)} className="btn-primary mx-auto">
            <Settings className="inline mr-2" size={20} />
            Kalorienziel einrichten
          </button>
        </div>

        {/* Goal Setup Modal - Same as below */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Kalorienziel einrichten</h2>
              
              <form onSubmit={handleSaveGoal} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gewicht (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={goalForm.currentWeight}
                      onChange={(e) => setGoalForm({...goalForm, currentWeight: e.target.value})}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Größe (cm)</label>
                    <input
                      type="number"
                      value={goalForm.height}
                      onChange={(e) => setGoalForm({...goalForm, height: e.target.value})}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Alter</label>
                    <input
                      type="number"
                      value={goalForm.age}
                      onChange={(e) => setGoalForm({...goalForm, age: e.target.value})}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Geschlecht</label>
                    <select
                      value={goalForm.gender}
                      onChange={(e) => setGoalForm({...goalForm, gender: e.target.value as any})}
                      className="input w-full"
                    >
                      <option value="MALE">Männlich</option>
                      <option value="FEMALE">Weiblich</option>
                      <option value="OTHER">Divers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Aktivitätslevel</label>
                  <select
                    value={goalForm.activityLevel}
                    onChange={(e) => setGoalForm({...goalForm, activityLevel: e.target.value as any})}
                    className="input w-full"
                  >
                    <option value="SEDENTARY">Wenig Bewegung (Büroarbeit)</option>
                    <option value="LIGHT">Leicht aktiv (1-3 Tage/Woche)</option>
                    <option value="MODERATE">Moderat aktiv (3-5 Tage/Woche)</option>
                    <option value="VERY_ACTIVE">Sehr aktiv (6-7 Tage/Woche)</option>
                    <option value="EXTREMELY_ACTIVE">Extrem aktiv (täglich intensiv)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ziel</label>
                  <select
                    value={goalForm.goalType}
                    onChange={(e) => setGoalForm({...goalForm, goalType: e.target.value as any})}
                    className="input w-full"
                  >
                    <option value="LOSE_WEIGHT">Abnehmen (-500 kcal/Tag)</option>
                    <option value="MAINTAIN">Halten (TDEE)</option>
                    <option value="GAIN_WEIGHT">Zunehmen (+500 kcal/Tag)</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-800 dark:text-red-200 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary flex-1">
                    Abbrechen
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const calorieProgress = stats.remainingCalories !== undefined 
    ? ((goal.dailyCalories - stats.remainingCalories) / goal.dailyCalories * 100)
    : 0;

  const consumed = todayNutrition?.calories || 0;
  const remaining = goal.dailyCalories - consumed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Apple className="text-green-600" size={32} />
          <h1 className="text-3xl font-bold">Ernährung</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Eintragen
          </button>
          <button onClick={() => {
            setGoalForm({
              currentWeight: goal.currentWeight.toString(),
              height: goal.height.toString(),
              age: goal.age.toString(),
              gender: goal.gender,
              activityLevel: goal.activityLevel,
              goalType: goal.goalType
            });
            setShowGoalModal(true);
          }} className="btn-secondary flex items-center gap-2">
            <Settings size={20} />
            Ziel anpassen
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Today's Progress */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Heute</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verbraucht</div>
            <div className="text-3xl font-bold text-blue-600">{consumed}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ziel</div>
            <div className="text-3xl font-bold">{goal.dailyCalories}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verbleibend</div>
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining}
            </div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              calorieProgress > 100 ? 'bg-red-500' : 
              calorieProgress > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(calorieProgress, 100)}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          {calorieProgress.toFixed(0)}% des Tagesziels
        </div>

        {/* Macros */}
        {todayNutrition && (todayNutrition.protein || todayNutrition.carbs || todayNutrition.fat) && (
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Protein</div>
              <div className="text-xl font-bold">{todayNutrition.protein || 0}g</div>
              {goal.proteinGrams && (
                <div className="text-xs text-gray-500">von {goal.proteinGrams}g</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kohlenhydrate</div>
              <div className="text-xl font-bold">{todayNutrition.carbs || 0}g</div>
              {goal.carbsGrams && (
                <div className="text-xs text-gray-500">von {goal.carbsGrams}g</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fett</div>
              <div className="text-xl font-bold">{todayNutrition.fat || 0}g</div>
              {goal.fatGrams && (
                <div className="text-xs text-gray-500">von {goal.fatGrams}g</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goal Info & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Dein Ziel</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Typ:</span>
              <span className="font-semibold">{getGoalTypeLabel(goal.goalType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Aktivität:</span>
              <span className="font-semibold">{getActivityLevelLabel(goal.activityLevel)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gewicht:</span>
              <span className="font-semibold">{goal.currentWeight} kg</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Statistiken</h3>
          <div className="space-y-2">
            {stats.weeklyAverage && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">7-Tage Durchschnitt:</span>
                <span className="font-semibold">{stats.weeklyAverage} kcal</span>
              </div>
            )}
            {stats.monthlyAverage && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">30-Tage Durchschnitt:</span>
                <span className="font-semibold">{stats.monthlyAverage} kcal</span>
              </div>
            )}
            {stats.daysTracked && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Getrackte Tage:</span>
                <span className="font-semibold">{stats.daysTracked}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Letzte 7 Tage</h3>
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">{formatDate(entry.date)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">{entry.calories} kcal</div>
                    {entry.protein && (
                      <div className="text-xs text-gray-500">
                        P: {entry.protein}g | K: {entry.carbs}g | F: {entry.fat}g
                      </div>
                    )}
                  </div>
                  {entry.calories > goal.dailyCalories ? (
                    <TrendingUp className="text-red-500" size={20} />
                  ) : (
                    <TrendingDown className="text-green-500" size={20} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Nutrition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Heutige Ernährung eintragen</h2>
            
            <form onSubmit={handleAddNutrition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kalorien*</label>
                <input
                  type="number"
                  value={nutritionForm.calories}
                  onChange={(e) => setNutritionForm({...nutritionForm, calories: e.target.value})}
                  placeholder="z.B. 2000"
                  className="input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={nutritionForm.protein}
                    onChange={(e) => setNutritionForm({...nutritionForm, protein: e.target.value})}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kohlenhydrate (g)</label>
                  <input
                    type="number"
                    value={nutritionForm.carbs}
                    onChange={(e) => setNutritionForm({...nutritionForm, carbs: e.target.value})}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fett (g)</label>
                  <input
                    type="number"
                    value={nutritionForm.fat}
                    onChange={(e) => setNutritionForm({...nutritionForm, fat: e.target.value})}
                    className="input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notizen (optional)</label>
                <textarea
                  value={nutritionForm.notes}
                  onChange={(e) => setNutritionForm({...nutritionForm, notes: e.target.value})}
                  placeholder="Was hast du gegessen?"
                  className="input w-full"
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-800 dark:text-red-200 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Abbrechen
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Setup Modal - Same as above but with pre-filled values */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Kalorienziel anpassen</h2>
            
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gewicht (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={goalForm.currentWeight}
                    onChange={(e) => setGoalForm({...goalForm, currentWeight: e.target.value})}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Größe (cm)</label>
                  <input
                    type="number"
                    value={goalForm.height}
                    onChange={(e) => setGoalForm({...goalForm, height: e.target.value})}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alter</label>
                  <input
                    type="number"
                    value={goalForm.age}
                    onChange={(e) => setGoalForm({...goalForm, age: e.target.value})}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Geschlecht</label>
                  <select
                    value={goalForm.gender}
                    onChange={(e) => setGoalForm({...goalForm, gender: e.target.value as any})}
                    className="input w-full"
                  >
                    <option value="MALE">Männlich</option>
                    <option value="FEMALE">Weiblich</option>
                    <option value="OTHER">Divers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Aktivitätslevel</label>
                <select
                  value={goalForm.activityLevel}
                  onChange={(e) => setGoalForm({...goalForm, activityLevel: e.target.value as any})}
                  className="input w-full"
                >
                  <option value="SEDENTARY">Wenig Bewegung (Büroarbeit)</option>
                  <option value="LIGHT">Leicht aktiv (1-3 Tage/Woche)</option>
                  <option value="MODERATE">Moderat aktiv (3-5 Tage/Woche)</option>
                  <option value="VERY_ACTIVE">Sehr aktiv (6-7 Tage/Woche)</option>
                  <option value="EXTREMELY_ACTIVE">Extrem aktiv (täglich intensiv)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ziel</label>
                <select
                  value={goalForm.goalType}
                  onChange={(e) => setGoalForm({...goalForm, goalType: e.target.value as any})}
                  className="input w-full"
                >
                  <option value="LOSE_WEIGHT">Abnehmen (-500 kcal/Tag)</option>
                  <option value="MAINTAIN">Halten (TDEE)</option>
                  <option value="GAIN_WEIGHT">Zunehmen (+500 kcal/Tag)</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-800 dark:text-red-200 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowGoalModal(false)} className="btn-secondary flex-1">
                  Abbrechen
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}