import axios from 'axios'

const API_URL = '/api/notes'

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
    const response = await axios.get(API_URL)
    return response.data
  },

  getByCategory: async (category: string): Promise<Note[]> => {
    const response = await axios.get(`${API_URL}/category/${category}`)
    return response.data
  },

  getById: async (id: number): Promise<Note> => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },

  create: async (note: Note): Promise<Note> => {
    const response = await axios.post(API_URL, note)
    return response.data
  },

  update: async (id: number, note: Note): Promise<Note> => {
    const response = await axios.put(`${API_URL}/${id}`, note)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
  },
}
