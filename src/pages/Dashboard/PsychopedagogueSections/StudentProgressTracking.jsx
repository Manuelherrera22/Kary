import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Heart,
  Brain,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import psychopedagogueService from '@/services/psychopedagogueService';
import activityService from '@/services/activityService';

const StudentProgressTracking = () => {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, gradeFilter, statusFilter, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const result = await psychopedagogueService.getAllStudents();
      if (result.success) {
        setStudents(result.data);
        setFilteredStudents(result.data);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      // Fallback data
      const mockStudents = [
        {
          id: 1,
          name: 'María García',
          grade: '5to Primaria',
          diagnosis: 'TDAH',
          status: 'active',
          progress: {
            academic: 75,
            emotional: 60,
            behavioral: 80,
            social: 70
          },
          trends: {
            academic: 'up',
            emotional: 'up',
            behavioral: 'stable',
            social: 'up'
          },
          lastActivity: '2024-01-20',
          goals: [
            { id: 1, title: 'Mejorar atención sostenida', progress: 70, target: 85 },
            { id: 2, title: 'Reducir impulsividad', progress: 60, target: 80 },
            { id: 3, title: 'Mejorar organización', progress: 80, target: 90 }
          ],
          interventions: [
            { id: 1, name: 'Técnicas de mindfulness', status: 'active', effectiveness: 8 },
            { id: 2, name: 'Estrategias de organización', status: 'active', effectiveness: 7 },
            { id: 3, name: 'Refuerzo positivo', status: 'completed', effectiveness: 9 }
          ],
          alerts: [
            { id: 1, type: 'warning', message: 'Disminución en participación en clase', date: '2024-01-18' },
            { id: 2, type: 'success', message: 'Mejora notable en tareas de matemáticas', date: '2024-01-15' }
          ]
        },
        {
          id: 2,
          name: 'Carlos López',
          grade: '4to Primaria',
          diagnosis: 'Dislexia',
          status: 'active',
          progress: {
            academic: 65,
            emotional: 75,
            behavioral: 85,
            social: 80
          },
          trends: {
            academic: 'up',
            emotional: 'stable',
            behavioral: 'up',
            social: 'up'
          },
          lastActivity: '2024-01-19',
          goals: [
            { id: 1, title: 'Mejorar fluidez lectora', progress: 55, target: 75 },
            { id: 2, title: 'Aumentar confianza', progress: 70, target: 85 },
            { id: 3, title: 'Mejorar comprensión', progress: 60, target: 80 }
          ],
          interventions: [
            { id: 1, name: 'Método multisensorial', status: 'active', effectiveness: 8 },
            { id: 2, name: 'Apoyo visual', status: 'active', effectiveness: 7 },
            { id: 3, name: 'Técnicas de relajación', status: 'active', effectiveness: 6 }
          ],
          alerts: [
            { id: 1, type: 'success', message: 'Progreso excelente en lectura', date: '2024-01-17' },
            { id: 2, type: 'info', message: 'Nueva estrategia implementada', date: '2024-01-14' }
          ]
        },
        {
          id: 3,
          name: 'Ana Rodríguez',
          grade: '6to Primaria',
          diagnosis: 'Ansiedad',
          status: 'in_progress',
          progress: {
            academic: 80,
            emotional: 70,
            behavioral: 75,
            social: 65
          },
          trends: {
            academic: 'stable',
            emotional: 'up',
            behavioral: 'up',
            social: 'up'
          },
          lastActivity: '2024-01-18',
          goals: [
            { id: 1, title: 'Reducir ansiedad', progress: 65, target: 85 },
            { id: 2, title: 'Mejorar autoestima', progress: 70, target: 90 },
            { id: 3, title: 'Aumentar participación', progress: 60, target: 80 }
          ],
          interventions: [
            { id: 1, name: 'Técnicas de respiración', status: 'active', effectiveness: 9 },
            { id: 2, name: 'Terapia cognitiva', status: 'active', effectiveness: 8 },
            { id: 3, name: 'Refuerzo positivo', status: 'active', effectiveness: 7 }
          ],
          alerts: [
            { id: 1, type: 'success', message: 'Reducción significativa en episodios de ansiedad', date: '2024-01-16' },
            { id: 2, type: 'warning', message: 'Necesita más apoyo en matemáticas', date: '2024-01-13' }
          ]
        }
      ];
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(student => student.grade === gradeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-green-400" />;
      case 'down': return <TrendingDown size={16} className="text-red-400" />;
      case 'stable': return <Activity size={16} className="text-blue-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'info': return <Clock size={16} className="text-blue-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Seguimiento de Progreso</h2>
          <p className="text-slate-400">Monitorea el progreso individual de cada estudiante</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/90 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los grados</option>
              <option value="4to Primaria">4to Primaria</option>
              <option value="5to Primaria">5to Primaria</option>
              <option value="6to Primaria">6to Primaria</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="paused">Pausado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-6">
        {filteredStudents.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Users size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay estudiantes</h3>
              <p className="text-slate-400">No se encontraron estudiantes que coincidan con los filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Student Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-slate-200">{student.name}</h3>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                      <span className="text-sm text-slate-400">{student.grade}</span>
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{student.diagnosis}</span>
                    </div>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen size={16} className="text-blue-400" />
                          <span className="text-sm text-slate-400">Académico</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-lg font-semibold ${getProgressColor(student.progress.academic)}`}>
                            {student.progress.academic}%
                          </span>
                          {getTrendIcon(student.trends.academic)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart size={16} className="text-red-400" />
                          <span className="text-sm text-slate-400">Emocional</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-lg font-semibold ${getProgressColor(student.progress.emotional)}`}>
                            {student.progress.emotional}%
                          </span>
                          {getTrendIcon(student.trends.emotional)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users size={16} className="text-green-400" />
                          <span className="text-sm text-slate-400">Comportamental</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-lg font-semibold ${getProgressColor(student.progress.behavioral)}`}>
                            {student.progress.behavioral}%
                          </span>
                          {getTrendIcon(student.trends.behavioral)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Brain size={16} className="text-purple-400" />
                          <span className="text-sm text-slate-400">Social</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`text-lg font-semibold ${getProgressColor(student.progress.social)}`}>
                            {student.progress.social}%
                          </span>
                          {getTrendIcon(student.trends.social)}
                        </div>
                      </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Objetivos</h4>
                      <div className="space-y-2">
                        {student.goals.map((goal) => (
                          <div key={goal.id} className="flex items-center gap-3">
                            <span className="text-sm text-slate-400 w-32 truncate">{goal.title}</span>
                            <div className="flex-1">
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                            <span className="text-sm text-slate-300 w-12 text-right">
                              {goal.progress}/{goal.target}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Alerts */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Alertas Recientes</h4>
                      <div className="space-y-1">
                        {student.alerts.slice(0, 2).map((alert) => (
                          <div key={alert.id} className="flex items-center gap-2 text-sm">
                            {getAlertIcon(alert.type)}
                            <span className="text-slate-300">{alert.message}</span>
                            <span className="text-slate-500 text-xs">
                              {new Date(alert.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => setSelectedStudent(student)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <BarChart3 size={16} className="mr-2" />
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Calendar size={16} className="mr-2" />
                      Programar Cita
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Target size={16} className="mr-2" />
                      Actualizar Objetivos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">{students.length}</p>
                <p className="text-sm text-slate-400">Total Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.progress.academic, 0) / students.length) : 0}%
                </p>
                <p className="text-sm text-slate-400">Progreso Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Target size={20} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {students.reduce((acc, s) => acc + s.goals.length, 0)}
                </p>
                <p className="text-sm text-slate-400">Objetivos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/90 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CheckCircle size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">
                  {students.filter(s => s.status === 'active').length}
                </p>
                <p className="text-sm text-slate-400">Casos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgressTracking;


