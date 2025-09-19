import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Target,
  Heart,
  Brain,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import psychopedagogueService from '@/services/psychopedagogueService';

const CaseManagement = () => {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    studentId: '',
    studentName: '',
    diagnosis: '',
    priority: 'medium',
    assignedTo: ''
  });

  useEffect(() => {
    loadCases();
    
    // Suscribirse a cambios
    const unsubscribe = psychopedagogueService.subscribe((event, data) => {
      if (event === 'case_created' || event === 'case_updated') {
        loadCases();
      }
    });

    return unsubscribe;
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const result = await psychopedagogueService.getCases();
      if (result.success) {
        setCases(result.data);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    try {
      const result = await psychopedagogueService.createCase(newCase);
      if (result.success) {
        setShowCreateDialog(false);
        setNewCase({
          title: '',
          description: '',
          studentId: '',
          studentName: '',
          diagnosis: '',
          priority: 'medium',
          assignedTo: ''
        });
        // Los casos se recargarán automáticamente por la suscripción
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity size={16} className="text-green-400" />;
      case 'closed': return <CheckCircle size={16} className="text-gray-400" />;
      case 'pending': return <Clock size={16} className="text-yellow-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'closed': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando casos...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gestión de Casos</h2>
          <p className="text-slate-300">Administra y da seguimiento a los casos psicopedagógicos</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus size={20} className="mr-2" />
              Nuevo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-200">Crear Nuevo Caso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">Título del Caso</Label>
                <Input
                  id="title"
                  value={newCase.title}
                  onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Ej: Seguimiento TDAH - María García"
                />
              </div>
              <div>
                <Label htmlFor="studentName" className="text-slate-300">Nombre del Estudiante</Label>
                <Input
                  id="studentName"
                  value={newCase.studentName}
                  onChange={(e) => setNewCase(prev => ({ ...prev, studentName: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Nombre completo del estudiante"
                />
              </div>
              <div>
                <Label htmlFor="diagnosis" className="text-slate-300">Diagnóstico</Label>
                <Input
                  id="diagnosis"
                  value={newCase.diagnosis}
                  onChange={(e) => setNewCase(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Ej: TDAH, Dislexia, Autismo"
                />
              </div>
              <div>
                <Label htmlFor="priority" className="text-slate-300">Prioridad</Label>
                <Select value={newCase.priority} onValueChange={(value) => setNewCase(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-slate-300">Descripción</Label>
                <Textarea
                  id="description"
                  value={newCase.description}
                  onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Describe el caso y los objetivos de intervención"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCase} className="bg-purple-600 hover:bg-purple-700">
                  Crear Caso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800/90 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar casos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Casos */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <Briefcase size={48} className="text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay casos</h3>
              <p className="text-slate-400">Crea tu primer caso para comenzar</p>
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((case_) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-800/90 border-slate-700/50 hover:bg-slate-800 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-200">{case_.title}</h3>
                        <Badge className={getStatusColor(case_.status)}>
                          {getStatusIcon(case_.status)}
                          <span className="ml-1 capitalize">{case_.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(case_.priority)}>
                          <span className="capitalize">{case_.priority}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <User size={16} />
                          {case_.studentName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(case_.createdAt).toLocaleDateString()}
                        </span>
                        {case_.diagnosis && (
                          <span className="flex items-center gap-1">
                            <Brain size={16} />
                            {case_.diagnosis}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-300 mb-4">{case_.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Progreso</span>
                            <span>{case_.progress}%</span>
                          </div>
                          <Progress value={case_.progress} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <FileText size={16} />
                            {case_.assessments?.length || 0} evaluaciones
                          </span>
                          <span className="flex items-center gap-1">
                            <Target size={16} />
                            {case_.interventions?.length || 0} intervenciones
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedCase(case_)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CaseManagement;


