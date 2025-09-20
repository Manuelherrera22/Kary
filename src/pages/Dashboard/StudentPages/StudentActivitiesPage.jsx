import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import GenericPage from '../GenericPage';
import { BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const StudentActivitiesPage = () => {
  const { t } = useLanguage();

  // Datos mock para demostración
  const activities = [
    {
      id: 1,
      title: 'Matemáticas - Fracciones',
      description: 'Resolver ejercicios de fracciones equivalentes',
      status: 'completed',
      progress: 100,
      dueDate: '2025-01-15',
      subject: 'Matemáticas',
      grade: '5°'
    },
    {
      id: 2,
      title: 'Ciencias - Sistema Solar',
      description: 'Investigar los planetas del sistema solar',
      status: 'in_progress',
      progress: 65,
      dueDate: '2025-01-20',
      subject: 'Ciencias',
      grade: '5°'
    },
    {
      id: 3,
      title: 'Español - Redacción',
      description: 'Escribir un cuento corto',
      status: 'pending',
      progress: 0,
      dueDate: '2025-01-25',
      subject: 'Español',
      grade: '5°'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'in_progress':
        return <Clock size={20} className="text-yellow-400" />;
      case 'pending':
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('common.completed', 'Completada');
      case 'in_progress':
        return t('common.inProgress', 'En Progreso');
      case 'pending':
        return t('common.pending', 'Pendiente');
      default:
        return t('common.unknown', 'Desconocido');
    }
  };

  return (
    <GenericPage
      title={t('common.activities', 'Mis Actividades')}
      description={t('studentDashboard.activitiesDescription', 'Gestiona y completa tus actividades asignadas')}
      icon={BookOpen}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(activity.status)}
                  <CardTitle className="text-white text-lg">
                    {activity.title}
                  </CardTitle>
                </div>
                <Badge className={`${getStatusColor(activity.status)} text-white`}>
                  {getStatusText(activity.status)}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">
                {activity.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>{t('common.progress', 'Progreso')}</span>
                  <span>{activity.progress}%</span>
                </div>
                <Progress value={activity.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  {t('common.subject', 'Materia')}: {activity.subject}
                </span>
                <span className="text-slate-400">
                  {t('common.grade', 'Grado')}: {activity.grade}
                </span>
              </div>
              
              <div className="text-sm text-slate-400">
                {t('common.dueDate', 'Fecha límite')}: {new Date(activity.dueDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </GenericPage>
  );
};

export default StudentActivitiesPage;
