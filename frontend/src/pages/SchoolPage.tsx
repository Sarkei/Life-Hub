import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { 
  Calendar, Clock, BookOpen, GraduationCap, 
  TrendingUp, AlertCircle, CheckCircle2, Award,
  FileText, BarChart3, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimetableEntry {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
}

interface Exam {
  id: number;
  subject: string;
  title: string;
  examDate: string;
  startTime: string;
  examType: string;
}

interface Homework {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
}

interface GradeStats {
  overallAverage: number;
  totalCount: number;
  bestGrade: number;
  worstGrade: number;
}

export const SchoolPage: React.FC = () => {
  const userId = useAuthStore((state) => state.userId);
  const [todayLessons, setTodayLessons] = useState<TimetableEntry[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [openHomework, setOpenHomework] = useState<Homework[]>([]);
  const [gradeStats, setGradeStats] = useState<GradeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    }
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's day of week
      const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const today = daysOfWeek[new Date().getDay()];

      // Load today's timetable
      const timetableRes = await axios.get(`http://localhost:5000/api/timetable/${userId}/day/${today}`);
      setTodayLessons(timetableRes.data.slice(0, 5)); // Show max 5 lessons

      // Load upcoming exams (next 3)
      const examsRes = await axios.get(`http://localhost:5000/api/exams/${userId}/upcoming`);
      setUpcomingExams(examsRes.data.slice(0, 3));

      // Load open homework (max 5)
      const homeworkRes = await axios.get(`http://localhost:5000/api/homework/${userId}/upcoming`);
      setOpenHomework(homeworkRes.data.slice(0, 5));

      // Load grade statistics
      const gradesRes = await axios.get(`http://localhost:5000/api/grades/${userId}/stats`);
      setGradeStats(gradesRes.data);

    } catch (error) {
      console.error('Error loading school dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Heute';
    if (days === 1) return 'Morgen';
    return `in ${days} Tagen`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            Schule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/school/homework"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Hausaufgaben
          </Link>
          <Link
            to="/school/exams"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Prüfungen
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Offene Hausaufgaben</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{openHomework.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Anstehende Prüfungen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingExams.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notendurchschnitt</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {gradeStats?.overallAverage ? gradeStats.overallAverage.toFixed(2) : '-'}
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stunden heute</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayLessons.length}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Heute: Stundenplan
            </h2>
            <Link to="/school/timetable" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Alle anzeigen
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {todayLessons.length > 0 ? (
            <div className="space-y-3">
              {todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-lg border dark:border-gray-700"
                  style={{ borderLeftWidth: '4px', borderLeftColor: lesson.color }}
                >
                  <div className="flex-shrink-0 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{lesson.subject}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {lesson.teacher} • Raum {lesson.room}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Heute keine Unterrichtsstunden</p>
            </div>
          )}
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500" />
              Anstehende Prüfungen
            </h2>
            <Link to="/school/exams" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Alle anzeigen
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingExams.length > 0 ? (
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{exam.subject}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exam.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {exam.examType} • {formatTime(exam.startTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {getDaysUntil(exam.examDate)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(exam.examDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Keine anstehenden Prüfungen</p>
            </div>
          )}
        </div>

        {/* Open Homework */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Offene Hausaufgaben
            </h2>
            <Link to="/school/homework" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Alle anzeigen
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {openHomework.length > 0 ? (
            <div className="space-y-2">
              {openHomework.map((hw) => (
                <div key={hw.id} className="p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(hw.priority)}`}>
                          {hw.priority}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{hw.subject}</span>
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white mt-1">{hw.title}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-500 dark:text-gray-400">Fällig:</div>
                      <div className="font-medium text-gray-900 dark:text-white">{formatDate(hw.dueDate)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Alle Hausaufgaben erledigt!</p>
            </div>
          )}
        </div>

        {/* Grade Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Noten-Statistiken
            </h2>
            <Link to="/school/grades" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {gradeStats && gradeStats.totalCount > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Durchschnitt</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {gradeStats.overallAverage.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Noten gesamt</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {gradeStats.totalCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Beste Note</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {gradeStats.bestGrade?.toFixed(2) || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Schlechteste Note</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {gradeStats.worstGrade?.toFixed(2) || '-'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Noch keine Noten eingetragen</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/school/timetable"
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">Stundenplan</p>
        </Link>
        <Link
          to="/school/subjects"
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">Fächer</p>
        </Link>
        <Link
          to="/school/study-sessions"
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">Lernzeiten</p>
        </Link>
        <Link
          to="/school/absences"
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">Fehlzeiten</p>
        </Link>
      </div>
    </div>
  );
};
