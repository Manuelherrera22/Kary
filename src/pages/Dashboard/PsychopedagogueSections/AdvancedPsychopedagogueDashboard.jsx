import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Target, 
  Users, 
  BarChart3,
  Zap,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Heart,
  Settings,
  Lightbulb,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import AdvancedPiarGenerator from '@/components/AdvancedPiarGenerator';
import PiarAnalysisSystem from '@/components/PiarAnalysisSystem';
import AdvancedSupportPlanGenerator from '@/components/AdvancedSupportPlanGenerator';

const AdvancedPsychopedagogueDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();

  // Estados principales
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [piarDocuments, setPiarDocuments] = useState([]);
  const [supportPlans, setSupportPlans] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});

  // Estados para modales
  const [isPiarGeneratorOpen, setIsPiarGeneratorOpen] = useState(false);
  const [isSupportPlanGeneratorOpen, setIsSupportPlanGeneratorOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPiar, setSelectedPiar] = useState(null);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, [authUser]);

  const loadDashboardData = async () => {
    if (!authUser) return;

    setIsLoading(true);
    try {
      // Cargar estudiantes
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name');

      if (studentsError) throw studentsError;

      // Cargar documentos PIAR
      const { data: piarData, error: piarError } = await supabase
        .from('piar_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (piarError) throw piarError;

      // Cargar planes de apoyo
      const { data: plansData, error: plansError } = await supabase
        .from('support_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;

      setStudents(studentsData || []);
      setPiarDocuments(piarData || []);
      setSupportPlans(plansData || []);

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      toast({
        title: t('toasts.errorTitle'),
        description: t('common.errorLoadingData'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePiarGenerated = (newPiar) => {
    setPiarDocuments(prev => [newPiar, ...prev]);
    toast({
      title: t('piar.generator.saveSuccessTitle'),
      description: t('piar.generator.saveSuccessMessage'),
      variant: 'default'
    });
  };

  const handleSupportPlanGenerated = (newPlan) => {
    setSupportPlans(prev => [newPlan, ...prev]);
    toast({
      title: t('supportPlan.generator.saveSuccessTitle'),
      description: t('supportPlan.generator.saveSuccessMessage'),
      variant: 'default'
    });
  };

  const handleAnalysisComplete = (studentId, results) => {
    setAnalysisResults(prev => ({
      ...prev,
      [studentId]: results
    }));
  };

  const getStudentById = (studentId) => {
    return students.find(student => student.id === studentId);
  };

  const getPiarByStudentId = (studentId) => {
    return piarDocuments.find(piar => piar.student_id === studentId);
  };

  const getSupportPlanByStudentId = (studentId) => {
    return supportPlans.find(plan => plan.student_id === studentId);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500', text: 'Activo' },
      draft: { color: 'bg-yellow-500', text: 'Borrador' },
      completed: { color: 'bg-blue-500', text: 'Completado' },
      paused: { color: 'bg-gray-500', text: 'Pausado' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-500', text: 'Alta' },
      medium: { color: 'bg-yellow-500', text: 'Media' },
      low: { color: 'bg-green-500', text: 'Baja' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const renderOverviewTab = () => {
    const stats = {
      totalStudents: students.length,
      activePiars: piarDocuments.filter(p => p.status === 'active').length,
      activePlans: supportPlans.filter(p => p.status === 'active').length,
      pendingReviews: supportPlans.filter(p => p.status === 'draft').length
    };

    return (
      <div className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-sm text-gray-600">Estudiantes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activePiars}</p>
                  <p className="text-sm text-gray-600">PIARs Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activePlans}</p>
                  <p className="text-sm text-gray-600">Planes Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Acciones Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setIsPiarGeneratorOpen(true)}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Brain className="h-6 w-6" />
                <span>Generar PIAR</span>
              </Button>
              
              <Button 
                onClick={() => setIsSupportPlanGeneratorOpen(true)}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Target className="h-6 w-6" />
                <span>Generar Plan de Apoyo</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('analysis')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Análisis de Datos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Estudiantes Recientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => {
                const piar = getPiarByStudentId(student.id);
                const plan = getSupportPlanByStudentId(student.id);
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {piar && getStatusBadge(piar.status)}
                      {plan && getStatusBadge(plan.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStudent(student);
                          setActiveTab('students');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStudentsTab = () => {
    const filteredStudents = students.filter(student => {
      const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="space-y-6">
        {/* Filtros y búsqueda */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar estudiantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo PIAR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de estudiantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const piar = getPiarByStudentId(student.id);
            const plan = getSupportPlanByStudentId(student.id);
            const analysis = analysisResults[student.id];
            
            return (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.full_name}</CardTitle>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">PIAR:</span>
                      {piar ? getStatusBadge(piar.status) : <Badge variant="outline">Sin PIAR</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plan de Apoyo:</span>
                      {plan ? getStatusBadge(plan.status) : <Badge variant="outline">Sin Plan</Badge>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Análisis:</span>
                      {analysis ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsPiarGeneratorOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          PIAR
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsSupportPlanGeneratorOpen(true);
                          }}
                          className="flex-1"
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAnalysisTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Sistema de Análisis de PIAR</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PiarAnalysisSystem
              studentId={selectedStudent?.id}
              studentData={selectedStudent}
              piarData={getPiarByStudentId(selectedStudent?.id)}
              onAnalysisComplete={(results) => handleAnalysisComplete(selectedStudent?.id, results)}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Avanzado de Psicopedagogía
          </h1>
          <p className="text-gray-600">
            Sistema integrado de PIAR, análisis de datos y generación de planes de apoyo con IA
          </p>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="students">
            {renderStudentsTab()}
          </TabsContent>

          <TabsContent value="analysis">
            {renderAnalysisTab()}
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reportes Avanzados</h3>
                <p className="text-gray-600">Próximamente disponible</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modales */}
        <AdvancedPiarGenerator
          isOpen={isPiarGeneratorOpen}
          onOpenChange={setIsPiarGeneratorOpen}
          studentId={selectedStudent?.id}
          studentData={selectedStudent}
          onPiarGenerated={handlePiarGenerated}
        />

        <AdvancedSupportPlanGenerator
          isOpen={isSupportPlanGeneratorOpen}
          onOpenChange={setIsSupportPlanGeneratorOpen}
          studentId={selectedStudent?.id}
          studentData={selectedStudent}
          piarAnalysisResults={analysisResults[selectedStudent?.id]}
          onPlanGenerated={handleSupportPlanGenerated}
        />
      </div>
    </div>
  );
};

export default AdvancedPsychopedagogueDashboard;
