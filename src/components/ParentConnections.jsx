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
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import unifiedDataService from '@/services/unifiedDataService';

const ParentConnections = ({ parentId }) => {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parentId) {
      fetchConnections();
    }
  }, [parentId]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const result = unifiedDataService.getParentWithChild(parentId);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
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

  const { parent, student, teacher, psychopedagogue, team } = connections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-pink-900/20 to-rose-900/20 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-400" />
              Equipo Educativo de {student.name}
            </CardTitle>
            <CardDescription className="text-slate-300">
              Conoce al equipo que trabaja con tu hijo/a
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Información del Hijo/a */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-400" />
              Información de {student.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl">{student.name}</h3>
                <p className="text-slate-400">{student.grade} - {student.school}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {student.academicLevel}
                  </Badge>
                  <span className="text-sm">Nivel Académico</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {student.emotionalState}
                  </Badge>
                  <span className="text-sm">Estado Emocional</span>
                </div>
                
                {student.learningNeeds && student.learningNeeds.length > 0 && (
                  <div>
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
              </div>
              
              <div className="space-y-3">
                {student.medicalInfo && student.medicalInfo !== 'Ninguna' && (
                  <div>
                    <h4 className="text-slate-300 font-medium mb-2">Información Médica</h4>
                    <p className="text-slate-400 text-sm">{student.medicalInfo}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-slate-300 font-medium mb-2">Contacto de Emergencia</h4>
                  <div className="text-slate-400 text-sm">
                    <p>{student.emergencyContact.name}</p>
                    <p>{student.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profesor */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Profesor/a de {student.name}
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
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                  <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Solicitar Reunión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No hay profesor asignado</p>
                <p className="text-slate-500 text-sm mt-2">
                  Contacta con la dirección para más información
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Psicopedagogo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Psicopedagogo/a de {student.name}
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
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Consultar Apoyo
                  </Button>
                  <Button size="sm" variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Solicitar Evaluación
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No hay psicopedagogo asignado</p>
                <p className="text-slate-500 text-sm mt-2">
                  Si tu hijo/a necesita apoyo especializado, puedes solicitarlo
                </p>
                <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Solicitar Apoyo Psicológico
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Estado del Equipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Estado del Equipo Educativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${team.hasTeacher ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-slate-300">Profesor</span>
                <Badge className={team.hasTeacher ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                  {team.hasTeacher ? 'Asignado' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${team.hasPsychopedagogue ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-slate-300">Psicopedagogo</span>
                <Badge className={team.hasPsychopedagogue ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {team.hasPsychopedagogue ? 'Asignado' : 'Opcional'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
              <p className="text-slate-300 text-sm">
                <strong>Equipo completo:</strong> {team.teamComplete ? 'Sí' : 'No'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Un equipo completo asegura el mejor apoyo educativo para tu hijo/a
              </p>
            </div>
            
            {!team.teamComplete && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <strong>Recomendación:</strong> Considera solicitar apoyo psicológico si tu hijo/a presenta dificultades de aprendizaje
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentConnections;


