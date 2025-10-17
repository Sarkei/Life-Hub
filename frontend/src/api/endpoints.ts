/**
 * Central API Configuration
 * All backend endpoints in one place
 */

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // ========== DASHBOARD ==========
  dashboard: {
    getData: (userId: number) => `${API_BASE}/dashboard/${userId}`,
    getStats: (userId: number) => `${API_BASE}/dashboard/${userId}/stats`,
    getOpenTodos: (userId: number) => `${API_BASE}/dashboard/${userId}/todos/open`,
    getUpcomingEvents: (userId: number) => `${API_BASE}/dashboard/${userId}/events/upcoming`,
    getTodaysEvents: (userId: number) => `${API_BASE}/dashboard/${userId}/events/today`,
    getOverdueTodos: (userId: number) => `${API_BASE}/dashboard/${userId}/todos/overdue`,
  },

  // ========== CALENDAR EVENTS ==========
  events: {
    getAll: (userId: number) => `${API_BASE}/events/${userId}`,
    getByCategory: (userId: number, category: string) => `${API_BASE}/events/${userId}/category/${category}`,
    getRange: (userId: number) => `${API_BASE}/events/${userId}/range`, // + query params: startDate, endDate
    getUpcoming: (userId: number) => `${API_BASE}/events/${userId}/upcoming`, // + optional query param: days
    getToday: (userId: number) => `${API_BASE}/events/${userId}/today`,
    getRelated: (userId: number, entityType: string, entityId: number) => `${API_BASE}/events/${userId}/related/${entityType}/${entityId}`,
    getSingle: (userId: number, eventId: number) => `${API_BASE}/events/${userId}/item/${eventId}`,
    create: (userId: number) => `${API_BASE}/events/${userId}`,
    update: (userId: number, eventId: number) => `${API_BASE}/events/${userId}/${eventId}`,
    cancel: (userId: number, eventId: number) => `${API_BASE}/events/${userId}/${eventId}/cancel`,
    confirm: (userId: number, eventId: number) => `${API_BASE}/events/${userId}/${eventId}/confirm`,
    delete: (userId: number, eventId: number) => `${API_BASE}/events/${userId}/${eventId}`,
  },

  // ========== TODOS ==========
  todos: {
    getAll: (userId: number) => `${API_BASE}/todos/${userId}`,
    getByCategory: (userId: number, category: string) => `${API_BASE}/todos/${userId}/category/${category}`,
    getByStatus: (userId: number, status: string) => `${API_BASE}/todos/${userId}/status/${status}`,
    getOpen: (userId: number) => `${API_BASE}/todos/${userId}/open`,
    getCompleted: (userId: number) => `${API_BASE}/todos/${userId}/completed`,
    getOverdue: (userId: number) => `${API_BASE}/todos/${userId}/overdue`,
    getSingle: (userId: number, todoId: number) => `${API_BASE}/todos/${userId}/item/${todoId}`,
    create: (userId: number) => `${API_BASE}/todos/${userId}`,
    update: (userId: number, todoId: number) => `${API_BASE}/todos/${userId}/${todoId}`,
    markComplete: (userId: number, todoId: number) => `${API_BASE}/todos/${userId}/${todoId}/complete`,
    markIncomplete: (userId: number, todoId: number) => `${API_BASE}/todos/${userId}/${todoId}/uncomplete`,
    delete: (userId: number, todoId: number) => `${API_BASE}/todos/${userId}/${todoId}`,
  },

  // ========== WEIGHT ==========
  weight: {
    getAll: (userId: number) => `${API_BASE}/weight/${userId}`, // + optional query params: start, end
    create: (userId: number) => `${API_BASE}/weight/${userId}`,
    update: (userId: number, logId: number) => `${API_BASE}/weight/${userId}/${logId}`,
    delete: (userId: number, logId: number) => `${API_BASE}/weight/${userId}/${logId}`,
  },

  // ========== MEALS / NUTRITION ==========
  meals: {
    getAll: (userId: number) => `${API_BASE}/meals/${userId}`, // + optional query params: date, start, end
    create: (userId: number) => `${API_BASE}/meals/${userId}`,
    update: (userId: number, mealId: number) => `${API_BASE}/meals/${userId}/${mealId}`,
    delete: (userId: number, mealId: number) => `${API_BASE}/meals/${userId}/${mealId}`,
  },

  // ========== TRAINING PLANS ==========
  training: {
    // Plans
    getPlans: (userId: number) => `${API_BASE}/training/plans?userId=${userId}`, // Query param for backward compat
    getPlan: (planId: number) => `${API_BASE}/training/plans/${planId}`,
    getActivePlan: (userId: number) => `${API_BASE}/training/plans/active?userId=${userId}`,
    createPlan: () => `${API_BASE}/training/plans`,
    updatePlan: (planId: number) => `${API_BASE}/training/plans/${planId}`,
    activatePlan: (planId: number, userId: number) => `${API_BASE}/training/plans/${planId}/activate?userId=${userId}`,
    deletePlan: (planId: number) => `${API_BASE}/training/plans/${planId}`,
    
    // Workouts
    getWorkouts: (planId: number) => `${API_BASE}/training/plans/${planId}/workouts`,
    getWorkout: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}`,
    createWorkout: (planId: number) => `${API_BASE}/training/plans/${planId}/workouts`,
    updateWorkout: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}`,
    completeWorkout: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}/complete`,
    deleteWorkout: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}`,
    
    // Exercises
    getExercises: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}/exercises`,
    createExercise: (workoutId: number) => `${API_BASE}/training/workouts/${workoutId}/exercises`,
    updateExercise: (exerciseId: number) => `${API_BASE}/training/exercises/${exerciseId}`,
    deleteExercise: (exerciseId: number) => `${API_BASE}/training/exercises/${exerciseId}`,
  },

  // ========== SCHOOL - GRADES ==========
  grades: {
    getAll: (userId: number) => `${API_BASE}/grades/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/grades/${userId}/subject/${subjectId}`,
    create: (userId: number) => `${API_BASE}/grades/${userId}`,
    update: (userId: number, gradeId: number) => `${API_BASE}/grades/${userId}/${gradeId}`,
    delete: (userId: number, gradeId: number) => `${API_BASE}/grades/${userId}/${gradeId}`,
  },

  // ========== SCHOOL - HOMEWORK ==========
  homework: {
    getAll: (userId: number) => `${API_BASE}/homework/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/homework/${userId}/subject/${subjectId}`,
    getPending: (userId: number) => `${API_BASE}/homework/${userId}/pending`,
    getOverdue: (userId: number) => `${API_BASE}/homework/${userId}/overdue`,
    create: (userId: number) => `${API_BASE}/homework/${userId}`,
    update: (userId: number, homeworkId: number) => `${API_BASE}/homework/${userId}/${homeworkId}`,
    markComplete: (userId: number, homeworkId: number) => `${API_BASE}/homework/${userId}/${homeworkId}/complete`,
    delete: (userId: number, homeworkId: number) => `${API_BASE}/homework/${userId}/${homeworkId}`,
  },

  // ========== SCHOOL - EXAMS ==========
  exams: {
    getAll: (userId: number) => `${API_BASE}/exams/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/exams/${userId}/subject/${subjectId}`,
    getUpcoming: (userId: number) => `${API_BASE}/exams/${userId}/upcoming`,
    create: (userId: number) => `${API_BASE}/exams/${userId}`,
    update: (userId: number, examId: number) => `${API_BASE}/exams/${userId}/${examId}`,
    delete: (userId: number, examId: number) => `${API_BASE}/exams/${userId}/${examId}`,
  },

  // ========== SCHOOL - SUBJECTS ==========
  subjects: {
    getAll: (userId: number) => `${API_BASE}/school-subjects/${userId}`,
    getActive: (userId: number) => `${API_BASE}/school-subjects/${userId}/active`,
    create: (userId: number) => `${API_BASE}/school-subjects/${userId}`,
    update: (userId: number, subjectId: number) => `${API_BASE}/school-subjects/${userId}/${subjectId}`,
    delete: (userId: number, subjectId: number) => `${API_BASE}/school-subjects/${userId}/${subjectId}`,
  },

  // ========== SCHOOL - TIMETABLE ==========
  timetable: {
    getAll: (userId: number) => `${API_BASE}/timetable/${userId}`,
    getByDay: (userId: number, dayOfWeek: string) => `${API_BASE}/timetable/${userId}/day/${dayOfWeek}`,
    create: (userId: number) => `${API_BASE}/timetable/${userId}`,
    update: (userId: number, entryId: number) => `${API_BASE}/timetable/${userId}/${entryId}`,
    delete: (userId: number, entryId: number) => `${API_BASE}/timetable/${userId}/${entryId}`,
  },

  // ========== SCHOOL - STUDY SESSIONS ==========
  studySessions: {
    getAll: (userId: number) => `${API_BASE}/study-sessions/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/study-sessions/${userId}/subject/${subjectId}`,
    create: (userId: number) => `${API_BASE}/study-sessions/${userId}`,
    update: (userId: number, sessionId: number) => `${API_BASE}/study-sessions/${userId}/${sessionId}`,
    delete: (userId: number, sessionId: number) => `${API_BASE}/study-sessions/${userId}/${sessionId}`,
  },

  // ========== SCHOOL - ABSENCES ==========
  absences: {
    getAll: (userId: number) => `${API_BASE}/absences/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/absences/${userId}/subject/${subjectId}`,
    getUnexcused: (userId: number) => `${API_BASE}/absences/${userId}/unexcused`,
    create: (userId: number) => `${API_BASE}/absences/${userId}`,
    update: (userId: number, absenceId: number) => `${API_BASE}/absences/${userId}/${absenceId}`,
    delete: (userId: number, absenceId: number) => `${API_BASE}/absences/${userId}/${absenceId}`,
  },

  // ========== SCHOOL - NOTES ==========
  notes: {
    getAll: (userId: number) => `${API_BASE}/school-notes/${userId}`,
    getBySubject: (userId: number, subjectId: number) => `${API_BASE}/school-notes/${userId}/subject/${subjectId}`,
    create: (userId: number) => `${API_BASE}/school-notes/${userId}`,
    update: (userId: number, noteId: number) => `${API_BASE}/school-notes/${userId}/${noteId}`,
    delete: (userId: number, noteId: number) => `${API_BASE}/school-notes/${userId}/${noteId}`,
  },

  // ========== AUTH ==========
  auth: {
    login: () => `${API_BASE}/auth/login`,
    register: () => `${API_BASE}/auth/register`,
    logout: () => `${API_BASE}/auth/logout`,
    me: () => `${API_BASE}/auth/me`,
  },

  // ========== USER ==========
  user: {
    get: (userId: number) => `${API_BASE}/users/${userId}`,
    update: (userId: number) => `${API_BASE}/users/${userId}`,
  },

  // ========== SIDEBAR CONFIG ==========
  sidebar: {
    get: (userId: number) => `${API_BASE}/sidebar/${userId}`,
    update: (userId: number, field: string) => `${API_BASE}/sidebar/${userId}/${field}`,
    reset: (userId: number) => `${API_BASE}/sidebar/${userId}/reset`,
  },
};

export default api;
