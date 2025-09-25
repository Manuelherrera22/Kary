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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import unifiedDataService from '@/services/unifiedDataService';

const TeacherConnections = ({ teacherId }) => {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId) {
      fetchConnections();
    }
  }, [teacherId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const result = unifiedDataService.getTeacherWithStudents(teacherId);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
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

  const { teacher, students, psychopedagogues, stats } = connections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Tu Grupo de Estudiantes
            </CardTitle>
            <CardDescription className="text-slate-300">
              Información completa de tus estudiantes y su equipo de apoyo
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Estadísticas del Grupo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-400" />
              Estadísticas del Grupo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
                <div className="text-sm text-blue-400">Estudiantes Totales</div>
              </div>
              
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-white">{stats.studentsWithPsychopedagogue}</div>
                <div className="text-sm text-green-400">Con Apoyo Psicológico</div>
              </div>
              
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-white">{stats.studentsWithParent}</div>
                <div className="text-sm text-purple-400">Con Familia Registrada</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Estudiantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              Tus Estudiantes
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
                    {/* Psicopedagogo */}
                    <div className="space-y-2">
                      <h4 className="text-slate-300 font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        Psicopedagogo
                      </h4>
                      {student.psychopedagogue ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {student.psychopedagogue.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{student.psychopedagogue.name}</p>
                            <p className="text-slate-400 text-xs">{student.psychopedagogue.specialization}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">Sin psicopedagogo asignado</span>
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

      {/* Psicopedagogos del Equipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Psicopedagogos del Equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {psychopedagogues.map((psychopedagogue, index) => (
                <motion.div
                  key={psychopedagogue.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {psychopedagogue.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{psychopedagogue.name}</h3>
                      <p className="text-slate-400">{psychopedagogue.specialization}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{psychopedagogue.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">{psychopedagogue.office}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {psychopedagogue.experience}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {psychopedagogues.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-slate-400">No hay psicopedagogos asignados a tu grupo</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Contacta con la dirección para asignar apoyo psicológico
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

export default TeacherConnections;


