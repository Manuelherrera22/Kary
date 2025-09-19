import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity as ActivityIcon, Users, Filter, Search, CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const RoleActivityPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activityLog, setActivityLog] = useState([]);
  const [filteredLog, setFilteredLog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: 'all',
    actionType: 'all',
    dateRange: 'all', 
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchActivityLog = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos para San Luis Gonzaga
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos de actividad realistas para San Luis Gonzaga
      const mockActivityData = [
        {
          id: 'activity-1',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
          action_type: 'login',
          target_entity: 'user_session',
          target_id: 'session-123',
          details: { description: 'Inicio de sesión exitoso' },
          user: { id: 'directive-1', full_name: 'Dr. María Elena Rodríguez', role: 'directive' }
        },
        {
          id: 'activity-2',
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutos atrás
          action_type: 'create_student',
          target_entity: 'student',
          target_id: 'student-new-001',
          details: { description: 'Nuevo estudiante registrado: Juan Pérez' },
          user: { id: 'teacher-1', full_name: 'Prof. Ana García', role: 'teacher' }
        },
        {
          id: 'activity-3',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hora atrás
          action_type: 'update_grades',
          target_entity: 'academic_record',
          target_id: 'record-456',
          details: { description: 'Calificaciones actualizadas para Grado 3° A' },
          user: { id: 'teacher-2', full_name: 'Prof. Carlos López', role: 'teacher' }
        },
        {
          id: 'activity-4',
          created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 horas atrás
          action_type: 'schedule_appointment',
          target_entity: 'appointment',
          target_id: 'appt-789',
          details: { description: 'Cita agendada con acudiente de María García' },
          user: { id: 'psychopedagogue-1', full_name: 'Lic. Laura Martínez', role: 'psychopedagogue' }
        },
        {
          id: 'activity-5',
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
          action_type: 'view_progress',
          target_entity: 'student_progress',
          target_id: 'progress-321',
          details: { description: 'Revisión de progreso académico de estudiante' },
          user: { id: 'parent-1', full_name: 'Ana Rodríguez', role: 'parent' }
        },
        {
          id: 'activity-6',
          created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 horas atrás
          action_type: 'create_alert',
          target_entity: 'institutional_alert',
          target_id: 'alert-654',
          details: { description: 'Alerta institucional creada: Riesgo académico detectado' },
          user: { id: 'directive-2', full_name: 'Dr. Roberto Silva', role: 'directive' }
        },
        {
          id: 'activity-7',
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 horas atrás
          action_type: 'update_profile',
          target_entity: 'user_profile',
          target_id: 'profile-987',
          details: { description: 'Perfil de usuario actualizado' },
          user: { id: 'teacher-3', full_name: 'Prof. Carmen Ruiz', role: 'teacher' }
        },
        {
          id: 'activity-8',
          created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 horas atrás
          action_type: 'send_notification',
          target_entity: 'notification',
          target_id: 'notif-147',
          details: { description: 'Notificación enviada a padres de familia' },
          user: { id: 'directive-1', full_name: 'Dr. María Elena Rodríguez', role: 'directive' }
        },
        {
          id: 'activity-9',
          created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 horas atrás
          action_type: 'create_support_plan',
          target_entity: 'support_plan',
          target_id: 'plan-258',
          details: { description: 'Plan de apoyo creado para estudiante con necesidades especiales' },
          user: { id: 'psychopedagogue-2', full_name: 'Lic. Diego Herrera', role: 'psychopedagogue' }
        },
        {
          id: 'activity-10',
          created_at: new Date(Date.now() - 1000 * 60 * 270).toISOString(), // 4.5 horas atrás
          action_type: 'view_report',
          target_entity: 'report',
          target_id: 'report-369',
          details: { description: 'Reporte de rendimiento académico consultado' },
          user: { id: 'parent-2', full_name: 'Carlos Mendoza', role: 'parent' }
        }
      ];

      setActivityLog(mockActivityData);
      setFilteredLog(mockActivityData);
      
      console.log("✅ Actividad de roles de San Luis Gonzaga cargada:", {
        total: mockActivityData.length,
        porRol: mockActivityData.reduce((acc, log) => {
          acc[log.user.role] = (acc[log.user.role] || 0) + 1;
          return acc;
        }, {})
      });

    } catch (error) {
      console.error('Error fetching activity log:', error);
      toast({ title: t('common.errorTitle'), description: t('dashboards.directive.roleActivity.fetchError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchActivityLog();
  }, [fetchActivityLog]);

  useEffect(() => {
    let currentLog = [...activityLog];
    if (filters.role !== 'all') {
      currentLog = currentLog.filter(log => log.user?.role === filters.role);
    }
    if (filters.actionType !== 'all') {
      currentLog = currentLog.filter(log => log.action_type === filters.actionType);
    }

    if (searchTerm) {
      currentLog = currentLog.filter(log => 
        log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details?.description && typeof log.details.description === 'string' && log.details.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredLog(currentLog);
  }, [filters, searchTerm, activityLog]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const uniqueRoles = useMemo(() => Array.from(new Set(activityLog.map(log => log.user?.role).filter(Boolean))).sort(), [activityLog]);
  const uniqueActionTypes = useMemo(() => Array.from(new Set(activityLog.map(log => log.action_type).filter(Boolean))).sort(), [activityLog]);


  if (isLoading && activityLog.length === 0) return <LoadingScreen text={t('common.loadingText')} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-800 min-h-screen text-white"
      >
      {/* Botón de regreso */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-indigo-300 hover:text-indigo-100 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">{t('common.backToDashboard')}</span>
        </button>
      </div>

      <header className="mb-8 text-center">
        <ActivityIcon size={48} className="mx-auto mb-4 text-indigo-300" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-300">
          {t('dashboards.directive.roleActivity.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 max-w-2xl mx-auto">
          {t('dashboards.directive.roleActivity.pageDescription')}
        </p>
      </header>

      <Card className="bg-slate-800/90 border-slate-600 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-sky-300 flex items-center">
             {t('dashboards.directive.roleActivity.logTitle')}
          </CardTitle>
          <CardDescription className="text-slate-400">{t('dashboards.directive.roleActivity.logDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Select onValueChange={(value) => handleFilterChange('role', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-500 text-white"><SelectValue placeholder={t('dashboards.directive.roleActivity.filterRole')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-500 text-white">
                <SelectItem value="all">{t('common.allRoles')}</SelectItem>
                {uniqueRoles.map(role => <SelectItem key={role} value={role}>{t(`roles.${role}`, role)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('actionType', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-500 text-white"><SelectValue placeholder={t('dashboards.directive.roleActivity.filterActionType')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-500 text-white">
                 <SelectItem value="all">{t('common.allActions')}</SelectItem>
                {uniqueActionTypes.map(type => <SelectItem key={type} value={type}>{t(`auditLogActions.${type}`, type)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-slate-700 border-slate-500 text-slate-300 hover:bg-slate-600 hover:border-slate-400 flex items-center justify-start text-left">
                <CalendarDays size={16} className="mr-2" /> {t('dashboards.directive.roleActivity.filterDateRange')}
            </Button>
          </div>
          <div className="mb-4 relative">
             <Input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border-slate-500 text-white placeholder-slate-300 focus:ring-sky-500 focus:border-sky-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>

          {isLoading && filteredLog.length === 0 ? <p className="text-center text-slate-400 py-4">{t('common.loadingText')}</p> : 
            filteredLog.length === 0 ? <p className="text-center text-slate-400 py-4">{t('dashboards.directive.roleActivity.noActivityFound')}</p> : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600 hover:bg-slate-700/40">
                    <TableHead className="text-sky-300">{t('dashboards.directive.roleActivity.table.user')}</TableHead>
                    <TableHead className="text-sky-300">{t('dashboards.directive.roleActivity.table.role')}</TableHead>
                    <TableHead className="text-sky-300">{t('dashboards.directive.roleActivity.table.action')}</TableHead>
                    <TableHead className="text-sky-300">{t('dashboards.directive.roleActivity.table.details')}</TableHead>
                    <TableHead className="text-sky-300">{t('dashboards.directive.roleActivity.table.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLog.map(log => (
                    <TableRow key={log.id} className="border-slate-600 hover:bg-slate-700/40">
                      <TableCell>{log.user?.full_name || t('common.unknownUser')}</TableCell>
                      <TableCell>{t(`roles.${log.user?.role || 'unknownRole'}`, log.user?.role || t('common.unknownRole'))}</TableCell>
                      <TableCell>{t(`auditLogActions.${log.action_type}`, log.action_type)}</TableCell>
                      <TableCell 
                        className="max-w-xs truncate" 
                        title={log.details?.description || `${log.target_entity}${log.target_id ? `: ${log.target_id}` : ''}`}
                      >
                        {log.details?.description || `${log.target_entity}${log.target_id ? `: ${log.target_id.substring(0,8)}...` : ''}`}
                      </TableCell>
                      <TableCell title={format(new Date(log.created_at), 'PPP p', { locale: es })}>
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: es })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoleActivityPage;