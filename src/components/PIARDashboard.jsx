import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePIARData } from '@/hooks/usePIARData';
import { useStudentsData } from '@/hooks/useStudentsData';
import PIARModal from './PIARModal';
import PersonalizedActivityGenerator from './PersonalizedActivityGenerator';
import AIActivityGenerator from './AIActivityGenerator';
import AdvancedPiarGenerator from './AdvancedPiarGenerator';
import PiarAnalysisSystem from './PiarAnalysisSystem';
import AdvancedSupportPlanGenerator from './AdvancedSupportPlanGenerator';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  Target,
  Users,
  TrendingUp,
  FileText,
  Activity,
  Sparkles,
  Brain,
  BarChart3,
  Zap,
  Settings
} from 'lucide-react';

const PIARDashboard = () => {
  const { t } = useLanguage();
  const { students } = useStudentsData();
  const { piars, isLoading, getPIARByStudentId } = usePIARData(students);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPIAR, setEditingPIAR] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, activities, ai-generator, advanced-piar, analysis, support-plan
  const [generatedActivities, setGeneratedActivities] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState({});

  // Filtrar PIARs
  const filteredPIARs = piars.filter(piar => {
    const matchesSearch = !searchTerm || 
      piar.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piar.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || piar.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingPIAR(null);
    setSelectedStudentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (piar) => {
    setEditingPIAR(piar);
    setSelectedStudentId(null);
    setIsModalOpen(true);
  };

  const openActivitiesView = (studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('activities');
  };

  const openAIGenerator = (studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('ai-generator');
    setGeneratedActivities([]);
    setGeneratedPlan(null);
  };

  const openAdvancedPiarGenerator = (studentId = null) => {
    setSelectedStudentId(studentId);
    setViewMode('advanced-piar');
  };

  const openAnalysisView = (studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('analysis');
  };

  const openSupportPlanGenerator = (studentId) => {
    setSelectedStudentId(studentId);
    setViewMode('support-plan');
  };

  const handlePiarGenerated = (newPiar) => {
    // Actualizar la lista de PIARs
    console.log('PIAR generado:', newPiar);
    setViewMode('grid');
  };

  const handleAnalysisComplete = (studentId, results) => {
    setAnalysisResults(prev => ({
      ...prev,
      [studentId]: results
    }));
  };

  const handleSupportPlanGenerated = (newPlan) => {
    console.log('Plan de apoyo generado:', newPlan);
    setViewMode('grid');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'inactive': return 'bg-gray-600';
      case 'review_pending': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'review_pending': return 'Revisión pendiente';
      default: return status;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-yellow-400';
    if (progress >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-400">Cargando PIARs...</span>
      </div>
    );
  }

  if (viewMode === 'activities' && selectedStudentId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            className="border-slate-500 text-gray-300 hover:bg-slate-700"
          >
            ← Volver al Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-white">
            Actividades Personalizadas - {students.find(s => s.id === selectedStudentId)?.full_name}
          </h2>
        </div>
        <PersonalizedActivityGenerator 
          studentId={selectedStudentId}
          onActivityGenerated={(activities) => {
            console.log('Actividades generadas:', activities);
          }}
        />
      </div>
    );
  }

  if (viewMode === 'ai-generator' && selectedStudentId) {
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const selectedPIAR = getPIARByStudentId(selectedStudentId);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            className="border-slate-500 text-gray-300 hover:bg-slate-700"
          >
            ← Volver al Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
            Generador de IA - {selectedStudent?.full_name}
          </h2>
        </div>
        <AIActivityGenerator 
          studentData={selectedStudent}
          piarData={selectedPIAR}
          onActivitiesGenerated={setGeneratedActivities}
          onPlanGenerated={setGeneratedPlan}
        />
      </div>
    );
  }

  if (viewMode === 'advanced-piar') {
    const selectedStudent = selectedStudentId ? students.find(s => s.id === selectedStudentId) : null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            className="border-slate-500 text-gray-300 hover:bg-slate-700"
          >
            ← Volver al Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-400" />
            Generador Avanzado de PIAR
          </h2>
        </div>
        <AdvancedPiarGenerator
          isOpen={true}
          onOpenChange={() => setViewMode('grid')}
          studentId={selectedStudentId}
          studentData={selectedStudent}
          onPiarGenerated={handlePiarGenerated}
        />
      </div>
    );
  }

  if (viewMode === 'analysis' && selectedStudentId) {
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const selectedPIAR = getPIARByStudentId(selectedStudentId);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            className="border-slate-500 text-gray-300 hover:bg-slate-700"
          >
            ← Volver al Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
            Análisis de PIAR - {selectedStudent?.full_name}
          </h2>
        </div>
        <PiarAnalysisSystem
          studentId={selectedStudentId}
          studentData={selectedStudent}
          piarData={selectedPIAR}
          onAnalysisComplete={(results) => handleAnalysisComplete(selectedStudentId, results)}
        />
      </div>
    );
  }

  if (viewMode === 'support-plan' && selectedStudentId) {
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setViewMode('grid')}
            variant="outline"
            className="border-slate-500 text-gray-300 hover:bg-slate-700"
          >
            ← Volver al Dashboard
          </Button>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-400" />
            Generador de Plan de Apoyo - {selectedStudent?.full_name}
          </h2>
        </div>
        <AdvancedSupportPlanGenerator
          isOpen={true}
          onOpenChange={() => setViewMode('grid')}
          studentId={selectedStudentId}
          studentData={selectedStudent}
          piarAnalysisResults={analysisResults[selectedStudentId]}
          onPlanGenerated={handleSupportPlanGenerated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de PIARs</h2>
          <p className="text-gray-400">Planes Individuales de Ajustes Razonables</p>
          <div className="flex items-center mt-2">
            <Badge className="bg-blue-600 text-white">
              Modo Demo
            </Badge>
            <span className="text-xs text-gray-500 ml-2">
              Usando datos de ejemplo
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => openAdvancedPiarGenerator()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generador IA
          </Button>
          <Button
            onClick={openCreateModal}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Nuevo PIAR
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="review_pending">Revisión pendiente</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-slate-500 text-gray-300 hover:bg-slate-700"
              >
                {viewMode === 'grid' ? 'Lista' : 'Grid'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total PIARs</p>
                <p className="text-2xl font-bold text-white">{piars.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-green-400">
                  {piars.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Revisión Pendiente</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {piars.filter(p => p.status === 'review_pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Progreso Promedio</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round(piars.reduce((acc, piar) => acc + (piar.progress_tracking?.overall_progress || 0), 0) / piars.length) || 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de PIARs */}
      {filteredPIARs.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No se encontraron PIARs
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || statusFilter 
                ? 'No hay PIARs que coincidan con los filtros aplicados.'
                : 'Aún no se han creado PIARs. Crea el primero para comenzar.'
              }
            </p>
            {!searchTerm && !statusFilter && (
              <Button
                onClick={openCreateModal}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer PIAR
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPIARs.map((piar) => (
            <Card key={piar.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">
                    {piar.student_name || 'Estudiante'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {analysisResults[piar.student_id] && (
                      <Badge className="bg-green-600 text-white text-xs">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analizado
                      </Badge>
                    )}
                    <Badge className={`${getStatusColor(piar.status)} text-white`}>
                      {getStatusLabel(piar.status)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Creado: {new Date(piar.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progreso general */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progreso General</span>
                    <span className={`font-medium ${getProgressColor(piar.progress_tracking?.overall_progress || 0)}`}>
                      {piar.progress_tracking?.overall_progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${piar.progress_tracking?.overall_progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-purple-400">
                      {piar.specific_needs?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Necesidades</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">
                      {piar.goals?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Objetivos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      {piar.reasonable_adjustments?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Ajustes</div>
                  </div>
                </div>

                {/* Áreas que están mejorando */}
                {piar.progress_tracking?.areas_improving?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Áreas mejorando:</p>
                    <div className="flex flex-wrap gap-1">
                      {piar.progress_tracking.areas_improving.map((area, idx) => (
                        <Badge key={idx} className="bg-green-600 text-white text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="space-y-2 pt-2">
                  {/* Primera fila de botones */}
                  <div className="flex gap-1">
                    <Button
                      onClick={() => openAdvancedPiarGenerator(piar.student_id)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      PIAR IA
                    </Button>
                    <Button
                      onClick={() => openAnalysisView(piar.student_id)}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Análisis
                    </Button>
                    <Button
                      onClick={() => openSupportPlanGenerator(piar.student_id)}
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Plan
                    </Button>
                  </div>
                  
                  {/* Segunda fila de botones */}
                  <div className="flex gap-1">
                    <Button
                      onClick={() => openAIGenerator(piar.student_id)}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Actividades
                    </Button>
                    <Button
                      onClick={() => openActivitiesView(piar.student_id)}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      Manual
                    </Button>
                    <Button
                      onClick={() => openEditModal(piar)}
                      size="sm"
                      variant="outline"
                      className="border-slate-500 text-gray-300 hover:bg-slate-700"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <PIARModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingPIAR={editingPIAR}
        studentId={selectedStudentId}
      />
    </div>
  );
};

export default PIARDashboard;
