import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock,
  Users,
  BookOpen,
  Heart,
  Target,
  Bell,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
  Home,
  School,
  Activity,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedDataService from '@/services/unifiedDataService';

const FamilyCalendar = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [filter, setFilter] = useState('all'); // all, academic, emotional, family, appointments

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Simular carga de eventos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Reunión con Profesor de Matemáticas',
          type: 'appointment',
          date: new Date(),
          time: '10:00',
          duration: 30,
          location: 'Colegio San José',
          participants: ['Prof. María Rodríguez', 'Ana Rodríguez'],
          description: 'Revisar el progreso académico en matemáticas',
          priority: 'high',
          status: 'scheduled',
          studentId: 'student-1',
          studentName: 'María García'
        },
        {
          id: 'event-2',
          title: 'Sesión de Apoyo Emocional',
          type: 'emotional',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          time: '15:00',
          duration: 45,
          location: 'Virtual',
          participants: ['Dr. Luis Martínez', 'Ana Rodríguez'],
          description: 'Seguimiento del plan de apoyo emocional',
          priority: 'medium',
          status: 'scheduled',
          studentId: 'student-1',
          studentName: 'María García'
        },
        {
          id: 'event-3',
          title: 'Entrega de Tareas de Ciencias',
          type: 'academic',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          time: '23:59',
          duration: 0,
          location: 'Plataforma Online',
          participants: ['María García'],
          description: 'Fecha límite para entrega de proyecto de ciencias',
          priority: 'high',
          status: 'pending',
          studentId: 'student-1',
          studentName: 'María García'
        },
        {
          id: 'event-4',
          title: 'Actividad Familiar - Lectura',
          type: 'family',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          time: '19:00',
          duration: 60,
          location: 'Casa',
          participants: ['Ana Rodríguez', 'María García'],
          description: 'Sesión de lectura en familia para fomentar el hábito',
          priority: 'low',
          status: 'scheduled',
          studentId: 'student-1',
          studentName: 'María García'
        },
        {
          id: 'event-5',
          title: 'Evaluación de Progreso Trimestral',
          type: 'academic',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          time: '09:00',
          duration: 60,
          location: 'Colegio San José',
          participants: ['Prof. María Rodríguez', 'Dr. Luis Martínez', 'Ana Rodríguez'],
          description: 'Reunión trimestral para evaluar el progreso integral',
          priority: 'high',
          status: 'scheduled',
          studentId: 'student-1',
          studentName: 'María García'
        }
      ];

      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'appointment': return <Users size={16} className="text-blue-400" />;
      case 'academic': return <BookOpen size={16} className="text-green-400" />;
      case 'emotional': return <Heart size={16} className="text-pink-400" />;
      case 'family': return <Home size={16} className="text-purple-400" />;
      case 'school': return <School size={16} className="text-orange-400" />;
      default: return <Calendar size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appointment': return 'text-blue-400 bg-blue-500/10';
      case 'academic': return 'text-green-400 bg-green-500/10';
      case 'emotional': return 'text-pink-400 bg-pink-500/10';
      case 'family': return 'text-purple-400 bg-purple-500/10';
      case 'school': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (time) => {
    return time;
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  const getTodayEvents = () => {
    const today = new Date();
    return events.filter(event => 
      event.date.toDateString() === today.toDateString()
    );
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando calendario familiar...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <Calendar size={24} className="text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-blue-300">
                Calendario Familiar
              </CardTitle>
              <p className="text-sm text-slate-400">
                Organiza y gestiona las actividades familiares y escolares
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="appointment">Citas</option>
              <option value="academic">Académico</option>
              <option value="emotional">Emocional</option>
              <option value="family">Familiar</option>
            </select>
            <Button
              onClick={() => setShowAddEvent(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              Nuevo Evento
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumen del día */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-700/30 border-slate-600/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar size={24} className="text-blue-400" />
                <div>
                  <h4 className="font-semibold text-slate-200">Hoy</h4>
                  <p className="text-2xl font-bold text-blue-400">
                    {getTodayEvents().length}
                  </p>
                  <p className="text-xs text-slate-400">eventos programados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/30 border-slate-600/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-green-400" />
                <div>
                  <h4 className="font-semibold text-slate-200">Próximos</h4>
                  <p className="text-2xl font-bold text-green-400">
                    {getUpcomingEvents().length}
                  </p>
                  <p className="text-xs text-slate-400">eventos esta semana</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/30 border-slate-600/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-purple-400" />
                <div>
                  <h4 className="font-semibold text-slate-200">Completados</h4>
                  <p className="text-2xl font-bold text-purple-400">
                    {events.filter(e => e.status === 'completed').length}
                  </p>
                  <p className="text-xs text-slate-400">este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de eventos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Activity size={20} className="text-blue-400" />
            Eventos Programados
          </h3>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                No hay eventos
              </h3>
              <p className="text-slate-400">
                Los eventos aparecerán aquí cuando se programen
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-600/30 rounded-lg">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-200 text-sm">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-400 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(event.date)} - {formatTime(event.time)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target size={12} />
                              {event.duration} min
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getPriorityColor(event.priority)}>
                            {event.priority}
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            Participantes: {event.participants.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                            <Bell size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyCalendar;

