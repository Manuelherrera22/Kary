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
  FileText,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import unifiedDataService from '@/services/unifiedDataService';

const PsychopedagogueConnections = ({ psychopedagogueId }) => {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (psychopedagogueId) {
      fetchConnections();
    }
  }, [psychopedagogueId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const result = unifiedDataService.getPsychopedagogueWithCases(psychopedagogueId);
      if (result.success) {
        setConnections(result.data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!connections) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <p className="text-slate-400 text-center">No se pudieron cargar las conexiones</p>
        </CardContent>
      </Card>
    );
  }

  const { psychopedagogue, students, teachers, cases, stats } = connections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Mi Equipo de Trabajo
            </CardTitle>
            <CardDescription className="text-slate-300">
              Estudiantes, profesores y casos bajo tu supervisión
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Estadísticas de Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
                <div className="text-sm text-green-400">Estudiantes</div>
              </div>
              
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-white">{stats.totalTeachers}</div>
                <div className="text-sm text-blue-400">Profesores</div>
              </div>
              
              <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                <div className="text-2xl font-bold text-white">{stats.activeCases}</div>
                <div className="text-sm text-orange-400">Casos Activos</div>
              </div>
              
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-white">{stats.completedCases}</div>
                <div className="text-sm text-purple-400">Casos Completados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estudiantes Asignados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              Estudiantes Asignados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{student.name}</h3>
                        <p className="text-slate-400 text-sm">{student.grade}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {student.academicLevel}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {student.emotionalState}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Profesor */}
                    <div className="space-y-2">
                      <h4 className="text-slate-300 font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        Profesor
                      </h4>
                      {student.teacher ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {student.teacher.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{student.teacher.name}</p>
                            <p className="text-slate-400 text-xs">{student.teacher.specialization}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Sin profesor asignado</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Padre/Madre */}
                    <div className="space-y-2">
                      <h4 className="text-slate-300 font-medium flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        Familia
                      </h4>
                      {student.parent ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {student.parent.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{student.parent.name}</p>
                            <p className="text-slate-400 text-xs">{student.parent.relationship}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Sin familia registrada</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Necesidades de Aprendizaje */}
                  {student.learningNeeds && student.learningNeeds.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-slate-300 font-medium mb-2">Necesidades de Aprendizaje</h4>
                      <div className="flex flex-wrap gap-1">
                        {student.learningNeeds.map((need, idx) => (
                          <Badge key={idx} className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profesores del Equipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Profesores del Equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{teacher.name}</h3>
                      <p className="text-slate-400">{teacher.specialization}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{teacher.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{teacher.office}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {teacher.experience}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Casos Activos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              Casos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases.map((case_, index) => (
                <motion.div
                  key={case_.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{case_.title}</h3>
                      <p className="text-slate-400 text-sm">{case_.studentName}</p>
                    </div>
                    <Badge className={
                      case_.status === 'active' 
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }>
                      {case_.status === 'active' ? 'Activo' : 'Completado'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">{case_.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {case_.objectives?.map((objective, idx) => (
                        <Badge key={idx} className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          {objective}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {cases.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-400">No hay casos activos</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Los casos aparecerán aquí cuando se asignen estudiantes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PsychopedagogueConnections;


