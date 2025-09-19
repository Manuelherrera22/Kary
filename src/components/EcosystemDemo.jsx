/**
 * Componente de Demostración del Ecosistema
 * Muestra cómo funciona la sincronización entre roles
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  BookOpen, 
  Brain, 
  Activity, 
  Bell, 
  ArrowRight,
  CheckCircle,
  Clock,
  Zap,
  Play
} from 'lucide-react';
import unifiedDataService from '../services/unifiedDataService';
import activityService from '../services/activityService';
import notificationService from '../services/notificationService';

const EcosystemDemo = () => {
  const [demoData, setDemoData] = useState({
    students: [],
    teachers: [],
    psychopedagogues: [],
    activities: [],
    notifications: [],
    cases: []
  });
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Profesor crea actividad",
      description: "El profesor crea una nueva actividad educativa",
      action: () => createDemoActivity(),
      icon: BookOpen
    },
    {
      title: "Actividad se asigna a estudiantes",
      description: "La actividad se asigna automáticamente a los estudiantes",
      action: () => assignDemoActivity(),
      icon: Users
    },
    {
      title: "Notificaciones en tiempo real",
      description: "Los estudiantes reciben notificaciones instantáneas",
      action: () => sendDemoNotifications(),
      icon: Bell
    },
    {
      title: "Psicopedagogo monitorea progreso",
      description: "El psicopedagogo puede ver el progreso en tiempo real",
      action: () => monitorProgress(),
      icon: Brain
    },
    {
      title: "Sincronización completa",
      description: "Todos los datos se sincronizan automáticamente",
      action: () => syncAllData(),
      icon: Zap
    }
  ];

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    const students = unifiedDataService.getStudents().data;
    const teachers = unifiedDataService.getTeachers().data;
    const psychopedagogues = unifiedDataService.getPsychopedagogues().data;
    const activities = unifiedDataService.getActivities().data;
    const notifications = unifiedDataService.getNotifications('student-1').data;
    const cases = unifiedDataService.getCases().data;

    setDemoData({
      students,
      teachers,
      psychopedagogues,
      activities,
      notifications,
      cases
    });
  };

  const createDemoActivity = () => {
    const activity = {
      title: 'Ejercicio de Lectura Comprensiva',
      description: 'Leer el cuento y responder preguntas de comprensión',
      type: 'reading',
      subject: 'Lengua',
      grade: '5to Grado',
      teacherId: 'teacher-1',
      assignedStudents: ['student-1', 'student-2'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const result = unifiedDataService.createActivity(activity);
    if (result.success) {
      loadDemoData();
    }
  };

  const assignDemoActivity = () => {
    const activityId = demoData.activities[demoData.activities.length - 1]?.id;
    if (activityId) {
      const result = activityService.assignActivityToStudents(activityId, ['student-1', 'student-2']);
      if (result.success) {
        loadDemoData();
      }
    }
  };

  const sendDemoNotifications = () => {
    const notifications = [
      {
        userId: 'student-1',
        type: 'activity_assigned',
        title: 'Nueva Actividad Asignada',
        message: 'Se te ha asignado una nueva actividad de lectura',
        priority: 'high'
      },
      {
        userId: 'student-2',
        type: 'activity_assigned',
        title: 'Nueva Actividad Asignada',
        message: 'Se te ha asignado una nueva actividad de lectura',
        priority: 'high'
      },
      {
        userId: 'teacher-1',
        type: 'activity_created',
        title: 'Actividad Creada',
        message: 'Has creado una nueva actividad y la has asignado a 2 estudiantes',
        priority: 'medium'
      }
    ];

    notifications.forEach(notif => {
      unifiedDataService.createNotification(notif);
    });

    loadDemoData();
  };

  const monitorProgress = () => {
    // Simular actualización de progreso
    const activityId = demoData.activities[demoData.activities.length - 1]?.id;
    if (activityId) {
      activityService.updateActivityProgress(activityId, 75, 'student-1');
      loadDemoData();
    }
  };

  const syncAllData = () => {
    loadDemoData();
  };

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
      demoSteps[i].action();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-blue-400" />
            Demostración del Ecosistema Kary
          </CardTitle>
          <p className="text-slate-400">
            Ve cómo funciona la sincronización en tiempo real entre estudiantes, profesores y psicopedagogos
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runDemo} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Ejecutando demostración...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Iniciar Demostración
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pasos de la demostración */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`transition-all duration-300 ${
                isActive 
                  ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                  : isCompleted 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-slate-800/50'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : isCompleted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-slate-700 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{step.title}</CardTitle>
                      <p className="text-xs text-slate-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Datos en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-400" />
              Estudiantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {demoData.students.length}
            </div>
            <p className="text-xs text-slate-400">
              Activos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-green-400" />
              Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {demoData.activities.length}
            </div>
            <p className="text-xs text-slate-400">
              Creadas y asignadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bell className="w-4 h-4 text-yellow-400" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {demoData.notifications.length}
            </div>
            <p className="text-xs text-slate-400">
              Enviadas en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-purple-400" />
              Casos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {demoData.cases.length}
            </div>
            <p className="text-xs text-slate-400">
              Seguimiento activo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de actividades recientes */}
      <Card className="bg-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Actividades Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoData.activities.slice(-3).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">{activity.title}</h4>
                  <p className="text-sm text-slate-400">{activity.subject} • {activity.grade}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemDemo;
