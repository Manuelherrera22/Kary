import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Brain,
  Target
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import psychopedagogueService from '@/services/psychopedagogueService';

const InteractiveCaseManagement = ({ onViewStudent }) => {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [newCase, setNewCase] = useState({
    studentName: '',
    grade: '',
    diagnosis: '',
    priority: 'medium',
    status: 'active',
    description: '',
    goals: '',
    interventions: '',
    notes: ''
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const result = await psychopedagogueService.getAllCases();
      if (result.success) {
        setCases(result.data);
        setFilteredCases(result.data);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
      // Fallback data
      const mockCases = [
        {
          id: 1,
          studentName: 'María García',
          grade: '5to Primaria',
          diagnosis: 'TDAH',
          priority: 'high',
          status: 'active',
          description: 'Estudiante con dificultades de atención y concentración',
          goals: 'Mejorar la atención sostenida y reducir la impulsividad',
          interventions: 'Técnicas de mindfulness y organización del tiempo',
          notes: 'Progreso positivo en las últimas 2 semanas',
          createdAt: '2024-01-15',
          lastUpdate: '2024-01-20'
        },
        {
          id: 2,
          studentName: 'Carlos López',
          grade: '4to Primaria',
          diagnosis: 'Dislexia',
          priority: 'medium',
          status: 'active',
          description: 'Dificultades en lectura y escritura',
          goals: 'Mejorar la fluidez lectora y comprensión',
          interventions: 'Método multisensorial y apoyo visual',
          notes: 'Necesita más práctica con textos cortos',
          createdAt: '2024-01-10',
          lastUpdate: '2024-01-18'
        },
        {
          id: 3,
          studentName: 'Ana Rodríguez',
          grade: '6to Primaria',
          diagnosis: 'Ansiedad',
          priority: 'high',
          status: 'in_progress',
          description: 'Ansiedad generalizada que afecta el rendimiento',
          goals: 'Reducir la ansiedad y mejorar la confianza',
          interventions: 'Técnicas de relajación y terapia cognitiva',
          notes: 'Mejoría notable en las últimas sesiones',
          createdAt: '2024-01-05',
          lastUpdate: '2024-01-19'
        }
      ];
      setCases(mockCases);
      setFilteredCases(mockCases);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterCases();
  }, [searchTerm, statusFilter, priorityFilter, cases]);

  const filterCases = () => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(case_ => 
        case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(case_ => case_.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(case_ => case_.priority === priorityFilter);
    }

    setFilteredCases(filtered);
  };

  const handleCreateCase = async () => {
    try {
      const result = await psychopedagogueService.createCase(newCase);
      if (result.success) {
        await loadCases();
        setIsCreateModalOpen(false);
        setNewCase({
          studentName: '',
          grade: '',
          diagnosis: '',
          priority: 'medium',
          status: 'active',
          description: '',
          goals: '',
          interventions: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  const handleUpdateCase = async () => {
    try {
      const result = await psychopedagogueService.updateCase(selectedCase.id, selectedCase);
      if (result.success) {
        await loadCases();
        setIsEditModalOpen(false);
        setSelectedCase(null);
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este caso?')) {
      try {
        const result = await psychopedagogueService.deleteCase(caseId);
        if (result.success) {
          await loadCases();
        }
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_progress': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'paused': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'in_progress': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'paused': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
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
          <h2 className="text-2xl font-bold text-slate-200">Gestión de Casos</h2>
          <p className="text-slate-400">Administra y da seguimiento a los casos de estudiantes</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus size={20} className="mr-2" />
              Nuevo Caso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-200">Crear Nuevo Caso</DialogTitle>
              <DialogDescription className="text-slate-400">
                Completa la información para crear un nuevo caso psicopedagógico
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Nombre del Estudiante</label>
                  <Input
                    value={newCase.studentName}
                    onChange={(e) => setNewCase({...newCase, studentName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="Ej: María García"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Grado</label>
                  <Input
                    value={newCase.grade}
                    onChange={(e) => setNewCase({...newCase, grade: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="Ej: 5to Primaria"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Diagnóstico</label>
                  <Input
                    value={newCase.diagnosis}
                    onChange={(e) => setNewCase({...newCase, diagnosis: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="Ej: TDAH, Dislexia, Ansiedad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Prioridad</label>
                  <Select value={newCase.priority} onValueChange={(value) => setNewCase({...newCase, priority: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Descripción</label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Describe el caso del estudiante..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Objetivos</label>
                <Textarea
                  value={newCase.goals}
                  onChange={(e) => setNewCase({...newCase, goals: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Define los objetivos del tratamiento..."
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Intervenciones</label>
                <Textarea
                  value={newCase.interventions}
                  onChange={(e) => setNewCase({...newCase, interventions: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  placeholder="Describe las intervenciones a implementar..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateCase}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Crear Caso
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/90 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre o diagnóstico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Filtrar por prioridad" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="grid gap-4">
        {filteredCases.length === 0 ? (
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <FileText size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay casos</h3>
              <p className="text-slate-400 mb-4">No se encontraron casos que coincidan con los filtros aplicados.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus size={20} className="mr-2" />
                Crear Primer Caso
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((case_) => (
            <Card key={case_.id} className="bg-slate-800/90 border-slate-700/50 hover:border-slate-600/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-200">{case_.studentName}</h3>
                      <Badge className={getPriorityColor(case_.priority)}>
                        {case_.priority}
                      </Badge>
                      <Badge className={getStatusColor(case_.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(case_.status)}
                          {case_.status}
                        </div>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{case_.grade}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain size={16} />
                        <span>{case_.diagnosis}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Creado: {new Date(case_.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Actualizado: {new Date(case_.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 mt-3 line-clamp-2">{case_.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStudent && onViewStudent(case_.studentId)}
                      className="border-blue-600 text-blue-300 hover:bg-blue-900/20"
                      title="Ver vista completa del estudiante"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCase(case_);
                        setIsEditModalOpen(true);
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCase(case_.id)}
                      className="border-red-600 text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-200">Editar Caso</DialogTitle>
            <DialogDescription className="text-slate-400">
              Modifica la información del caso psicopedagógico
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Nombre del Estudiante</label>
                  <Input
                    value={selectedCase.studentName}
                    onChange={(e) => setSelectedCase({...selectedCase, studentName: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Grado</label>
                  <Input
                    value={selectedCase.grade}
                    onChange={(e) => setSelectedCase({...selectedCase, grade: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Diagnóstico</label>
                  <Input
                    value={selectedCase.diagnosis}
                    onChange={(e) => setSelectedCase({...selectedCase, diagnosis: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Prioridad</label>
                  <Select value={selectedCase.priority} onValueChange={(value) => setSelectedCase({...selectedCase, priority: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Estado</label>
                <Select value={selectedCase.status} onValueChange={(value) => setSelectedCase({...selectedCase, status: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Descripción</label>
                <Textarea
                  value={selectedCase.description}
                  onChange={(e) => setSelectedCase({...selectedCase, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Objetivos</label>
                <Textarea
                  value={selectedCase.goals}
                  onChange={(e) => setSelectedCase({...selectedCase, goals: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Intervenciones</label>
                <Textarea
                  value={selectedCase.interventions}
                  onChange={(e) => setSelectedCase({...selectedCase, interventions: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Notas</label>
                <Textarea
                  value={selectedCase.notes}
                  onChange={(e) => setSelectedCase({...selectedCase, notes: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateCase}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractiveCaseManagement;

