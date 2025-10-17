import api from '../lib/api'

export interface AuthResponse {
  token: string
  username: string
  email: string
  userId: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
}

export const profileApi = {
  getProfiles: async () => {
    const response = await api.get('/profiles')
    return response.data
  },

  createProfile: async (data: any) => {
    const response = await api.post('/profiles', data)
    return response.data
  },

  updateProfile: async (id: number, data: any) => {
    const response = await api.put(`/profiles/${id}`, data)
    return response.data
  },

  deleteProfile: async (id: number) => {
    await api.delete(`/profiles/${id}`)
  },
}

export const todoApi = {
  getTodos: async (profileId: number, area?: string, status?: string) => {
    const response = await api.get('/todos', {
      params: { profileId, area, status },
    })
    return response.data
  },

  createTodo: async (data: any) => {
    const response = await api.post('/todos', data)
    return response.data
  },

  updateTodo: async (id: number, data: any) => {
    const response = await api.put(`/todos/${id}`, data)
    return response.data
  },

  deleteTodo: async (id: number) => {
    await api.delete(`/todos/${id}`)
  },
}

export const calendarApi = {
  getEvents: async (profileId: number, params?: any) => {
    const response = await api.get('/calendar', {
      params: { profileId, ...params },
    })
    return response.data
  },

  createEvent: async (data: any) => {
    const response = await api.post('/calendar', data)
    return response.data
  },

  updateEvent: async (id: number, data: any) => {
    const response = await api.put(`/calendar/${id}`, data)
    return response.data
  },

  deleteEvent: async (id: number) => {
    await api.delete(`/calendar/${id}`)
  },
}

export const fitnessApi = {
  getTemplates: async (profileId: number) => {
    const response = await api.get('/fitness/templates', {
      params: { profileId },
    })
    return response.data
  },

  getLogs: async (profileId: number, params?: any) => {
    const response = await api.get('/fitness/logs', {
      params: { profileId, ...params },
    })
    return response.data
  },

  createLog: async (data: any) => {
    const response = await api.post('/fitness/logs', data)
    return response.data
  },

  createTemplate: async (data: any) => {
    const response = await api.post('/fitness/templates', data)
    return response.data
  },
}

export const weightApi = {
  getWeightLogs: async (profileId: number, params?: any) => {
    const response = await api.get('/weight', {
      params: { profileId, ...params },
    })
    return response.data
  },

  createWeightLog: async (data: any) => {
    const response = await api.post('/weight', data)
    return response.data
  },
}

export const mealApi = {
  getMeals: async (profileId: number, params?: any) => {
    const response = await api.get('/meals', {
      params: { profileId, ...params },
    })
    return response.data
  },

  createMeal: async (data: any) => {
    const response = await api.post('/meals', data)
    return response.data
  },
}

export const widgetApi = {
  getWidgets: async (profileId: number, area?: string) => {
    const response = await api.get('/widgets', {
      params: { profileId, area },
    })
    return response.data
  },

  createWidget: async (data: any) => {
    const response = await api.post('/widgets', data)
    return response.data
  },

  updateWidget: async (id: number, data: any) => {
    const response = await api.put(`/widgets/${id}`, data)
    return response.data
  },

  deleteWidget: async (id: number) => {
    await api.delete(`/widgets/${id}`)
  },
}

export interface Note {
  id?: number
  title: string
  content: string
  category: 'privat' | 'arbeit' | 'schule'
  profileId?: number
  filePath?: string
  userId?: number
  createdAt?: string
  updatedAt?: string
}

export const noteApi = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/notes')
    return response.data
  },

  getByCategory: async (category: string): Promise<Note[]> => {
    const response = await api.get(`/notes/category/${category}`)
    return response.data
  },

  getById: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`)
    return response.data
  },

  create: async (note: Note): Promise<Note> => {
    const response = await api.post('/notes', note)
    return response.data
  },

  update: async (id: number, note: Note): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, note)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`)
  },
}
