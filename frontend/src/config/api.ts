// API Configuration
export const API_BASE_URL = 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: `${API_URL}/auth`,
  
  // Dashboard
  dashboard: `${API_URL}/dashboard`,
  
  // Todos & Events
  todos: `${API_URL}/todos`,
  events: `${API_URL}/events`,
  
  // School
  subjects: `${API_URL}/subjects`,
  timetable: `${API_URL}/timetable`,
  homework: `${API_URL}/homework`,
  exams: `${API_URL}/exams`,
  grades: `${API_URL}/grades`,
  studySessions: `${API_URL}/study-sessions`,
  absences: `${API_URL}/absences`,
  
  // Fitness
  training: `${API_URL}/training`,
  
  // Nutrition
  nutrition: `${API_URL}/nutrition`,
  
  // Sidebar
  sidebar: `${API_URL}/sidebar`,
  
  // Users
  users: `${API_URL}/users`,
};
