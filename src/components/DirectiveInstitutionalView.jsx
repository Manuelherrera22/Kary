import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Heart, 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  BookOpen,
  Shield,
  User,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import unifiedDataService from '@/services/unifiedDataService';

const DirectiveInstitutionalView = () => {
  const [institutionalData, setInstitutionalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutionalData();
  }, []);

  const fetchInstitutionalData = async () => {
    try {
      setLoading(true);
      const result = unifiedDataService.getInstitutionalOverview();
      if (result.success) {
        setInstitutionalData(result.data);
      }
    } catch (error) {
      console.error('Error fetching institutional data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!institutionalData) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <p className="text-slate-400 text-center">No se pudieron cargar los datos institucionales</p>
        </CardContent>
      </Card>
    );
  }

  const { overview, activeUsers, connections, cases, activities, institutionalHealth } = institutionalData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Vista Institucional Completa
            </CardTitle>
            <CardDescription className="text-slate-300">
              Resumen ejecutivo de toda la institución educativa
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Métricas Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Métricas Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-white">{overview.totalUsers}</div>
                <div className="text-sm text-blue-400">Usuarios Totales</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                <div className="text-2xl font-bold text-white">{overview.totalStudents}</div>
                <div className="text-sm text-yellow-400">Estudiantes</div>
              </div>
              
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-white">{overview.totalTeachers}</div>
                <div className="text-sm text-green-400">Profesores</div>
              </div>
              
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-white">{overview.totalPsychopedagogues}</div>
                <div className="text-sm text-purple-400">Psicopedagogos</div>
              </div>
              
              <div className="text-center p-4 bg-pink-900/20 rounded-lg border border-pink-500/30">
                <div className="text-2xl font-bold text-white">{overview.totalParents}</div>
                <div className="text-sm text-pink-400">Padres</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Salud Institucional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Salud Institucional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cobertura de Apoyo */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Cobertura de Apoyo</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300 text-sm">Apoyo Psicológico</span>
                      <span className="text-slate-300 text-sm">{institutionalHealth.coverage.support.toFixed(1)}%</span>
                    </div>
                    <Progress value={institutionalHealth.coverage.support} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300 text-sm">Participación Familiar</span>
                      <span className="text-slate-300 text-sm">{institutionalHealth.coverage.parent.toFixed(1)}%</span>
                    </div>
                    <Progress value={institutionalHealth.coverage.parent} className="h-2" />
                  </div>
                </div>
              </div>
              
              {/* Ratios */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Ratios Institucionales</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">Estudiantes por Profesor</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {institutionalHealth.ratios.studentsPerTeacher.toFixed(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">Estudiantes por Psicopedagogo</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {institutionalHealth.ratios.studentsPerPsychopedagogue.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estado de Conexiones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Estado de Conexiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Conexiones Estudiantiles</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-slate-300">Con Apoyo Psicológico</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {connections.studentsWithSupport} de {overview.totalStudents}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                      <span className="text-slate-300">Con Familia Registrada</span>
                    </div>
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                      {connections.studentsWithParent} de {overview.totalStudents}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Usuarios Activos</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-slate-300">Estudiantes Activos</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {activeUsers.students}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-slate-300">Profesores Activos</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {activeUsers.teachers}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span className="text-slate-300">Psicopedagogos Activos</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {activeUsers.psychopedagogues}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actividad Institucional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              Actividad Institucional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Casos */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Casos Psicológicos</h3>
                
                <div className="space-y-3">
                  {Object.entries(cases.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'active' ? 'bg-orange-400' :
                          status === 'completed' ? 'bg-green-400' :
                          status === 'pending' ? 'bg-yellow-400' : 'bg-slate-400'
                        }`}></div>
                        <span className="text-slate-300 capitalize">{status === 'active' ? 'Activos' : status === 'completed' ? 'Completados' : status === 'pending' ? 'Pendientes' : status}</span>
                      </div>
                      <Badge className={
                        status === 'active' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }>
                        {count}
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <span className="text-slate-300 font-medium">Total de Casos</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {cases.total}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Actividades */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Actividades Académicas</h3>
                
                <div className="space-y-3">
                  {Object.entries(activities.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'assigned' ? 'bg-blue-400' :
                          status === 'completed' ? 'bg-green-400' :
                          status === 'in_progress' ? 'bg-yellow-400' : 'bg-slate-400'
                        }`}></div>
                        <span className="text-slate-300 capitalize">{status === 'assigned' ? 'Asignadas' : status === 'completed' ? 'Completadas' : status === 'in_progress' ? 'En Progreso' : status}</span>
                      </div>
                      <Badge className={
                        status === 'assigned' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/30'
                      }>
                        {count}
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <span className="text-slate-300 font-medium">Total de Actividades</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {activities.total}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen Ejecutivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              Resumen Ejecutivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">Sistema Funcionando</div>
                <div className="text-sm text-green-400">Todos los roles conectados</div>
              </div>
              
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">Cobertura Completa</div>
                <div className="text-sm text-blue-400">100% de estudiantes con profesor</div>
              </div>
              
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">Apoyo Disponible</div>
                <div className="text-sm text-purple-400">Psicopedagogos especializados</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Estado General de la Institución</h3>
              <p className="text-slate-300 text-sm">
                La institución cuenta con un ecosistema educativo completo donde todos los roles están interconectados. 
                Los estudiantes tienen acceso a profesores especializados, apoyo psicológico cuando es necesario, 
                y comunicación directa con sus familias. El sistema permite un seguimiento integral del progreso 
                académico y emocional de cada estudiante.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DirectiveInstitutionalView;


