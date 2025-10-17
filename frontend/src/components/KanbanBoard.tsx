import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Archive, Calendar as CalendarIcon, AlertCircle, CheckCircle, Clock, Trash2, Edit2, MessageSquare, ListTodo, X, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'

interface Todo {
  id: number
  userId: number
  title: string
  description?: string
  status: 'open' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  position: number
  category?: string
  tags: string[]
  archived: boolean
  createdAt: string
  updatedAt: string
}

interface TodoSubtask {
  id?: number
  todoId: number
  title: string
  completed: boolean
  position: number
}

interface TodoComment {
  id?: number
  todoId: number
  userId: number
  content: string
  createdAt: string
}

interface KanbanBoardProps {
  category: 'privat' | 'arbeit' | 'schule'
}

export default function KanbanBoard({ category }: KanbanBoardProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('')
  const [filterTag, setFilterTag] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
  const [formData, setFormData] = useState<Partial<Todo>>({
    userId: 1,
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    category: category,
    tags: [],
    archived: false,
    position: 0
  })
  const [subtasks, setSubtasks] = useState<TodoSubtask[]>([])
  const [comments, setComments] = useState<TodoComment[]>([])
  const [newSubtask, setNewSubtask] = useState('')
  const [newComment, setNewComment] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({ open: 0, in_progress: 0, done: 0 })

  const statuses: Array<{value: Todo['status'], label: string, icon: any, color: string}> = [
    { value: 'open', label: 'Offen', icon: AlertCircle, color: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' },
    { value: 'in_progress', label: 'In Bearbeitung', icon: Clock, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' },
    { value: 'done', label: 'Erledigt', icon: CheckCircle, color: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600' }
  ]

  const priorities = [
    { value: 'low', label: 'Niedrig', color: 'bg-gray-400' },
    { value: 'medium', label: 'Mittel', color: 'bg-blue-500' },
    { value: 'high', label: 'Hoch', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Dringend', color: 'bg-red-500' }
  ]

  useEffect(() => {
    loadTodos()
    loadStats()
  }, [category])

  useEffect(() => {
    filterTodos()
  }, [todos, searchQuery, filterPriority, filterTag])

  const loadTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos', {
        params: { userId: 1, category: category, archived: false }
      })
      setTodos(response.data)
    } catch (error) {
      console.error('Error loading todos:', error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos/stats', {
        params: { userId: 1 }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadSubtasks = async (todoId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/todos/${todoId}/subtasks`)
      setSubtasks(response.data)
    } catch (error) {
      console.error('Error loading subtasks:', error)
    }
  }

  const loadComments = async (todoId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/todos/${todoId}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const filterTodos = () => {
    let filtered = [...todos]

    if (searchQuery) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterPriority) {
      filtered = filtered.filter(todo => todo.priority === filterPriority)
    }

    if (filterTag) {
      filtered = filtered.filter(todo => todo.tags.includes(filterTag))
    }

    setFilteredTodos(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (selectedTodo?.id) {
        await axios.put(`http://localhost:5000/api/todos/${selectedTodo.id}`, formData)
      } else {
        await axios.post('http://localhost:5000/api/todos', formData)
      }
      loadTodos()
      loadStats()
      setShowModal(false)
      resetForm()
    } catch (error) {
      console.error('Error saving todo:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Möchtest du dieses Todo wirklich löschen?')) return
    
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`)
      loadTodos()
      loadStats()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleArchive = async (id: number) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}/archive`)
      loadTodos()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error archiving todo:', error)
    }
  }

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: Todo['status']) => {
    if (!draggedTodo) return

    try {
      await axios.patch(`http://localhost:5000/api/todos/${draggedTodo.id}/status`, {
        status: status
      })
      loadTodos()
      loadStats()
      setDraggedTodo(null)
    } catch (error) {
      console.error('Error updating todo status:', error)
    }
  }

  const handleAddSubtask = async () => {
    if (!selectedTodo || !newSubtask.trim()) return

    try {
      await axios.post(`http://localhost:5000/api/todos/${selectedTodo.id}/subtasks`, {
        title: newSubtask,
        completed: false,
        position: subtasks.length
      })
      loadSubtasks(selectedTodo.id)
      setNewSubtask('')
    } catch (error) {
      console.error('Error adding subtask:', error)
    }
  }

  const handleToggleSubtask = async (subtask: TodoSubtask) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/subtasks/${subtask.id}`, {
        ...subtask,
        completed: !subtask.completed
      })
      if (selectedTodo) loadSubtasks(selectedTodo.id)
    } catch (error) {
      console.error('Error updating subtask:', error)
    }
  }

  const handleDeleteSubtask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/subtasks/${id}`)
      if (selectedTodo) loadSubtasks(selectedTodo.id)
    } catch (error) {
      console.error('Error deleting subtask:', error)
    }
  }

  const handleAddComment = async () => {
    if (!selectedTodo || !newComment.trim()) return

    try {
      await axios.post(`http://localhost:5000/api/todos/${selectedTodo.id}/comments`, {
        userId: 1,
        content: newComment
      })
      loadComments(selectedTodo.id)
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim() || formData.tags?.includes(tagInput)) return
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), tagInput]
    })
    setTagInput('')
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    })
  }

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo)
    setFormData(todo)
    setShowModal(true)
  }

  const openDetailModal = (todo: Todo) => {
    setSelectedTodo(todo)
    loadSubtasks(todo.id)
    loadComments(todo.id)
    setShowDetailModal(true)
  }

  const resetForm = () => {
    setSelectedTodo(null)
    setFormData({
      userId: 1,
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      category: category,
      tags: [],
      archived: false,
      position: 0
    })
    setSubtasks([])
    setComments([])
    setNewSubtask('')
    setNewComment('')
    setTagInput('')
  }

  const getPriorityColor = (priority: string) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-400'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const allTags = Array.from(new Set(todos.flatMap(todo => todo.tags)))

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl font-bold mb-6">📋 Kanban Board - {category === 'privat' ? 'Privat' : category === 'arbeit' ? 'Arbeit' : 'Schule'}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Offen</p>
                <p className="text-3xl font-bold">{stats.open}</p>
              </div>
              <AlertCircle className="text-gray-500" size={32} />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Bearbeitung</p>
                <p className="text-3xl font-bold">{stats.in_progress}</p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Erledigt</p>
                <p className="text-3xl font-bold">{stats.done}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Todos durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <Filter size={20} />
            Filter
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Neues Todo
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priorität filtern</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input"
              >
                <option value="">Alle Prioritäten</option>
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tag filtern</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="input"
              >
                <option value="">Alle Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map(status => {
          const columnTodos = filteredTodos.filter(todo => todo.status === status.value)
          const StatusIcon = status.icon

          return (
            <div
              key={status.value}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status.value)}
              className={`${status.color} rounded-lg border-2 p-4 min-h-[500px]`}
            >
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon size={20} />
                <h2 className="text-lg font-bold">{status.label}</h2>
                <span className="ml-auto text-sm font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded">
                  {columnTodos.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTodos.map(todo => (
                  <div
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(todo)}
                    onClick={() => openDetailModal(todo)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-move hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold flex-1">{todo.title}</h3>
                      <span className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)} flex-shrink-0 ml-2`} title={priorities.find(p => p.value === todo.priority)?.label}></span>
                    </div>
                    
                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {todo.description}
                      </p>
                    )}

                    {todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {todo.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {todo.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{todo.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {todo.dueDate && (
                      <div className={`flex items-center gap-1 text-xs ${isOverdue(todo.dueDate) ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                        <CalendarIcon size={14} />
                        {formatDate(todo.dueDate)}
                        {isOverdue(todo.dueDate) && ' (Überfällig!)'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedTodo ? 'Todo bearbeiten' : 'Neues Todo erstellen'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Todo['status'] })}
                    className="input"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priorität</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
                    className="input"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fälligkeitsdatum</label>
                <input
                  type="datetime-local"
                  value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Tag hinzufügen..."
                    className="input flex-1"
                  />
                  <button type="button" onClick={handleAddTag} className="btn-secondary">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500 hover:text-red-700">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">
                  Abbrechen
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {selectedTodo ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{selectedTodo.title}</h2>
                <span className={`w-4 h-4 rounded-full ${getPriorityColor(selectedTodo.priority)}`}></span>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {selectedTodo.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedTodo.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-semibold">{statuses.find(s => s.value === selectedTodo.status)?.label}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Priorität</p>
                <p className="font-semibold">{priorities.find(p => p.value === selectedTodo.priority)?.label}</p>
              </div>
              {selectedTodo.dueDate && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fälligkeitsdatum</p>
                  <p className={`font-semibold ${isOverdue(selectedTodo.dueDate) ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {formatDate(selectedTodo.dueDate)}
                    {isOverdue(selectedTodo.dueDate) && ' (Überfällig!)'}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Erstellt</p>
                <p className="font-semibold">{formatDate(selectedTodo.createdAt)}</p>
              </div>
            </div>

            {selectedTodo.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTodo.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <ListTodo size={20} />
                <h3 className="font-bold">Unteraufgaben</h3>
                <span className="text-sm text-gray-500">
                  ({subtasks.filter(s => s.completed).length}/{subtasks.length})
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask)}
                      className="rounded"
                    />
                    <span className={subtask.completed ? 'line-through text-gray-500' : ''}>{subtask.title}</span>
                    <button onClick={() => handleDeleteSubtask(subtask.id!)} className="ml-auto text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Neue Unteraufgabe..."
                  className="input flex-1"
                />
                <button onClick={handleAddSubtask} className="btn-secondary">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={20} />
                <h3 className="font-bold">Kommentare ({comments.length})</h3>
              </div>
              <div className="space-y-3 mb-3 max-h-[200px] overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {formatDate(comment.createdAt)}
                    </p>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Kommentar hinzufügen..."
                  className="input flex-1"
                />
                <button onClick={handleAddComment} className="btn-secondary">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => openEditModal(selectedTodo)} className="btn-secondary flex items-center gap-2">
                <Edit2 size={18} />
                Bearbeiten
              </button>
              <button onClick={() => handleArchive(selectedTodo.id)} className="btn-secondary flex items-center gap-2">
                <Archive size={18} />
                Archivieren
              </button>
              <button onClick={() => handleDelete(selectedTodo.id)} className="btn-secondary flex items-center gap-2 text-red-600 dark:text-red-400 ml-auto">
                <Trash2 size={18} />
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
