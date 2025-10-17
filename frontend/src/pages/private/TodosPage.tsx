import { useState } from 'react'
import { Plus, Check, Trash2, Edit2, Calendar, Tag, AlertCircle } from 'lucide-react'

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  tags: string[]
  createdAt: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      title: 'Life Hub fertigstellen',
      description: 'Alle Features implementieren und testen',
      completed: false,
      priority: 'high',
      dueDate: '2025-10-20',
      tags: ['Projekt', 'Entwicklung'],
      createdAt: '2025-10-17'
    },
    {
      id: 2,
      title: 'Einkaufen gehen',
      description: 'Milch, Brot, Käse kaufen',
      completed: false,
      priority: 'medium',
      dueDate: '2025-10-18',
      tags: ['Haushalt'],
      createdAt: '2025-10-17'
    },
    {
      id: 3,
      title: 'Sport machen',
      description: '30 Minuten Joggen',
      completed: true,
      priority: 'low',
      dueDate: null,
      tags: ['Fitness', 'Gesundheit'],
      createdAt: '2025-10-16'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCompleted, setFilterCompleted] = useState<string>('all')
  
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    tags: ''
  })

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return
    
    const todo: Todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate || null,
      tags: newTodo.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setTodos([...todos, todo])
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
    setShowAddModal(false)
  }

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Todo wirklich löschen?')) {
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate || '',
      tags: todo.tags.join(', ')
    })
    setShowAddModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingTodo || !newTodo.title.trim()) return
    
    setTodos(todos.map(todo => 
      todo.id === editingTodo.id
        ? {
            ...todo,
            title: newTodo.title,
            description: newTodo.description,
            priority: newTodo.priority,
            dueDate: newTodo.dueDate || null,
            tags: newTodo.tags.split(',').map(t => t.trim()).filter(t => t)
          }
        : todo
    ))
    
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
    setEditingTodo(null)
    setShowAddModal(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filterPriority !== 'all' && todo.priority !== filterPriority) return false
    if (filterCompleted === 'completed' && !todo.completed) return false
    if (filterCompleted === 'active' && todo.completed) return false
    return true
  })

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meine Todos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Verwalte deine Aufgaben und bleib produktiv
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Neues Todo</span>
        </button>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-primary-600">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Gesamt</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Aktiv</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Erledigt</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Hohe Priorität</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-medium mr-2">Status:</label>
            <select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="all">Alle</option>
              <option value="active">Aktiv</option>
              <option value="completed">Erledigt</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mr-2">Priorität:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            >
              <option value="all">Alle</option>
              <option value="high">Hoch</option>
              <option value="medium">Mittel</option>
              <option value="low">Niedrig</option>
            </select>
          </div>
        </div>
      </div>

      {/* Todo Liste */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400">Keine Todos gefunden</p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-lg ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{todo.description}</p>
                      )}
                      
                      {/* Tags und Metadaten */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Priorität */}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                          {getPriorityIcon(todo.priority)} {todo.priority.toUpperCase()}
                        </span>
                        
                        {/* Fälligkeitsdatum */}
                        {todo.dueDate && (
                          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar size={14} />
                            {new Date(todo.dueDate).toLocaleDateString('de-DE')}
                          </span>
                        )}
                        
                        {/* Tags */}
                        {todo.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded text-xs"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingTodo ? 'Todo bearbeiten' : 'Neues Todo'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. Einkaufen gehen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Was muss getan werden?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priorität</label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Niedrig 🟢</option>
                    <option value="medium">Mittel 🟡</option>
                    <option value="high">Hoch 🔴</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fälligkeitsdatum</label>
                  <input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (Komma-getrennt)</label>
                <input
                  type="text"
                  value={newTodo.tags}
                  onChange={(e) => setNewTodo({ ...newTodo, tags: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. Arbeit, Wichtig, Heute"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingTodo(null)
                  setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '', tags: '' })
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={editingTodo ? handleSaveEdit : handleAddTodo}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {editingTodo ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
