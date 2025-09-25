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
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import unifiedDataService from '@/services/unifiedDataService';

const StudentConnections = ({ studentId }) => {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchConnections();
    }
  }, [studentId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const result = unifiedDataService.getStudentWithConnections(studentId);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
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

  const { student, teacher, psychopedagogue, parent, connections: connectionStatus } = connections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Tu Equipo Educativo
            </CardTitle>
            <CardDescription className="text-slate-300">
              Conoce a las personas que forman parte de tu proceso educativo
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Profesor */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Tu Profesor/a
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teacher ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{teacher.name}</h3>
                    <p className="text-slate-400">{teacher.specialization}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{teacher.office}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">{teacher.grade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{teacher.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.map((subject, index) => (
                        <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No tienes profesor asignado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Psicopedagogo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Tu Psicopedagogo/a
            </CardTitle>
          </CardHeader>
          <CardContent>
            {psychopedagogue ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {psychopedagogue.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{psychopedagogue.name}</h3>
                    <p className="text-slate-400">{psychopedagogue.specialization}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.office}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.license}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{psychopedagogue.schedule}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No tienes psicopedagogo asignado</p>
                <p className="text-slate-500 text-sm mt-2">
                  Si necesitas apoyo especializado, contacta con la dirección
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Padre/Madre */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Tu Familia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {parent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {parent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{parent.name}</h3>
                    <p className="text-slate-400">{parent.relationship}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{parent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{parent.phone}</span>
                    </div>
                    {parent.workPhone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Trabajo: {parent.workPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{parent.address}</span>
                    </div>
                    {parent.emergencyContact && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Contacto de Emergencia
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No hay información de familia disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Estado de Conexiones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Estado de tu Equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${connectionStatus.hasTeacher ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-slate-300">Profesor</span>
                <Badge className={connectionStatus.hasTeacher ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {connectionStatus.hasTeacher ? 'Asignado' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${connectionStatus.hasPsychopedagogue ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-slate-300">Psicopedagogo</span>
                <Badge className={connectionStatus.hasPsychopedagogue ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {connectionStatus.hasPsychopedagogue ? 'Asignado' : 'Opcional'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${connectionStatus.hasParent ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-slate-300">Familia</span>
                <Badge className={connectionStatus.hasParent ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {connectionStatus.hasParent ? 'Registrada' : 'Pendiente'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
              <p className="text-slate-300 text-sm">
                <strong>Equipo completo:</strong> {connectionStatus.hasTeacher && connectionStatus.hasPsychopedagogue && connectionStatus.hasParent ? 'Sí' : 'No'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Un equipo completo te ayuda a tener el mejor apoyo educativo posible
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentConnections;


