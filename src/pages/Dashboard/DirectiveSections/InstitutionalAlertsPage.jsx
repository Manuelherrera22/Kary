import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, AlertTriangle as AlertTriangleIcon, Filter, Users, BarChart2, Thermometer, CalendarX, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const alertTypeIcons = {
  academic: <BarChart2 className="h-5 w-5 text-blue-300 bg-blue-600/20 rounded-full p-1 mr-2" />,
  emotional: <Thermometer className="h-5 w-5 text-yellow-300 bg-yellow-600/20 rounded-full p-1 mr-2" />,
  attendance: <CalendarX className="h-5 w-5 text-red-300 bg-red-600/20 rounded-full p-1 mr-2" />,
  default: <AlertTriangleIcon className="h-5 w-5 text-orange-300 bg-orange-600/20 rounded-full p-1 mr-2" />,
};

const InstitutionalAlertsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    group: 'all',
    dateRange: 'all',
    severity: 'all',
    status: 'all', 
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 800));

      // Datos mock de alertas para San Luis Gonzaga
      const mockAlerts = [
        {
          id: 'alert-1',
          date: '2025-01-15T10:30:00Z',
          type: 'riesgo_academico_grupal',
          title: 'Bajo rendimiento en Matemáticas - Grado 3°',
          description: 'Se detectó una disminución significativa en el rendimiento académico del grado 3° en la materia de Matemáticas. Promedio actual: 6.2/10',
          severity: 'alto',
          studentName: 'Grado 3° A',
          studentGrade: '3°',
          status: 'pending',
          raw: { institution: 'san-luis-gonzaga' }
        },
        {
          id: 'alert-2',
          date: '2025-01-14T14:20:00Z',
          type: 'riesgo_emocional_multiple',
          title: 'Indicadores de ansiedad en estudiantes',
          description: 'Se han identificado múltiples casos de ansiedad en estudiantes de primaria. Se requiere intervención del equipo psicopedagógico.',
          severity: 'alto',
          studentName: 'Múltiples estudiantes',
          studentGrade: 'Primaria',
          status: 'pending',
          raw: { institution: 'san-luis-gonzaga' }
        },
        {
          id: 'alert-3',
          date: '2025-01-13T09:15:00Z',
          type: 'inasistencias_bloque',
          title: 'Inasistencias frecuentes - Grado 2°',
          description: 'Se registran inasistencias recurrentes en el grado 2°, afectando el proceso de aprendizaje. Tasa de asistencia: 78%',
          severity: 'medio',
          studentName: 'Grado 2° A',
          studentGrade: '2°',
          status: 'addressed',
          raw: { institution: 'san-luis-gonzaga' }
        },
        {
          id: 'alert-4',
          date: '2025-01-12T16:45:00Z',
          type: 'riesgo_academico_grupal',
          title: 'Mejora en Ciencias - Grado 4°',
          description: 'Excelente progreso en la materia de Ciencias Naturales. El grado 4° ha mostrado una mejora significativa en sus calificaciones.',
          severity: 'bajo',
          studentName: 'Grado 4° A',
          studentGrade: '4°',
          status: 'addressed',
          raw: { institution: 'san-luis-gonzaga' }
        },
        {
          id: 'alert-5',
          date: '2025-01-11T11:30:00Z',
          type: 'riesgo_emocional_multiple',
          title: 'Necesidad de apoyo emocional',
          description: 'Estudiantes del grado 1° requieren apoyo adicional en habilidades socioemocionales. Se recomienda implementar actividades grupales.',
          severity: 'medio',
          studentName: 'Grado 1° A',
          studentGrade: '1°',
          status: 'pending',
          raw: { institution: 'san-luis-gonzaga' }
        }
      ];

      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);

      console.log('✅ Alertas institucionales de San Luis Gonzaga cargadas:', mockAlerts.length);

    } catch (error) {
      console.error('Error fetching institutional alerts:', error);
      toast({ 
        title: t('common.errorTitle'), 
        description: t('dashboards.directive.institutionalAlerts.fetchError'), 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    let currentAlerts = [...alerts];
    if (filters.course !== 'all') {
      currentAlerts = currentAlerts.filter(a => a.studentGrade === filters.course);
    }
    if (filters.severity !== 'all') {
      currentAlerts = currentAlerts.filter(a => a.severity === filters.severity);
    }
    if (filters.status !== 'all') {
        currentAlerts = currentAlerts.filter(a => a.status === filters.status);
    }

    if (searchTerm) {
      currentAlerts = currentAlerts.filter(a => 
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAlerts(currentAlerts);
  }, [filters, searchTerm, alerts]);
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'alto': return <Badge className="bg-red-600 text-white font-semibold border-red-500 shadow-lg">{t('dashboards.directive.institutionalAlerts.severityHigh')}</Badge>;
      case 'medio': return <Badge className="bg-orange-500 text-white font-semibold border-orange-400 shadow-lg">{t('dashboards.directive.institutionalAlerts.severityMedium')}</Badge>;
      case 'bajo': return <Badge className="bg-green-600 text-white font-semibold border-green-500 shadow-lg">{t('dashboards.directive.institutionalAlerts.severityLow')}</Badge>;
      default: return <Badge className="bg-gray-500 text-white font-semibold border-gray-400 shadow-lg">{severity || t('common.notSpecified')}</Badge>;
    }
  };
  
  const getStatusIcon = (status) => {
    if (status === 'addressed') return <CheckCircle className="h-5 w-5 text-green-300 bg-green-600/20 rounded-full p-1" title={t('dashboards.directive.institutionalAlerts.statusAddressed')} />;
    return <Clock className="h-5 w-5 text-orange-300 bg-orange-600/20 rounded-full p-1" title={t('dashboards.directive.institutionalAlerts.statusPending')} />;
  };

  const chartData = [
    { name: t('dashboards.directive.institutionalAlerts.chart.academic'), count: alerts.filter(a=>a.type === 'riesgo_academico_grupal').length },
    { name: t('dashboards.directive.institutionalAlerts.chart.emotional'), count: alerts.filter(a=>a.type === 'riesgo_emocional_multiple').length },
    { name: t('dashboards.directive.institutionalAlerts.chart.attendance'), count: alerts.filter(a=>a.type === 'inasistencias_bloque').length },
  ];

  if (isLoading && alerts.length === 0) return <LoadingScreen text={t('common.loadingText')} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-slate-900 via-red-900 to-orange-800 min-h-screen text-white"
    >
      {/* Botón de regreso */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-red-300 hover:text-red-100 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200 sm:hidden" />
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200 hidden sm:block" />
          <span className="text-xs sm:text-sm font-medium">{t('common.backToDashboard')}</span>
        </button>
      </div>

      <header className="mb-6 sm:mb-8 text-center">
        <AlertTriangleIcon size={32} className="mx-auto mb-3 sm:mb-4 text-red-300 sm:hidden" />
        <AlertTriangleIcon size={48} className="mx-auto mb-4 text-red-300 hidden sm:block" />
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300">
          {t('dashboards.directive.institutionalAlerts.pageTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto px-2">
          {t('dashboards.directive.institutionalAlerts.pageDescription')}
        </p>
      </header>

      <Card className="mb-6 sm:mb-8 bg-slate-800/80 border-slate-600 shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-orange-300">{t('dashboards.directive.institutionalAlerts.summaryTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem' }} itemStyle={{ color: '#e2e8f0' }}/>
              <Legend />
              <Bar dataKey="count" fill="#f97316" name={t('dashboards.directive.institutionalAlerts.chart.alertCount')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      <Card className="bg-slate-800/90 border-slate-600 shadow-2xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-orange-300 flex items-center">
            {t('dashboards.directive.institutionalAlerts.alertsListTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Select onValueChange={(value) => handleFilterChange('course', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-500 text-white text-sm">
                <SelectValue placeholder={t('dashboards.directive.institutionalAlerts.filterCourse')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-500 text-white">
                <SelectItem value="all">{t('common.allCourses')}</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('severity', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-500 text-white text-sm">
                <SelectValue placeholder={t('dashboards.directive.institutionalAlerts.filterSeverity')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-500 text-white">
                <SelectItem value="all">{t('common.allSeverities')}</SelectItem>
                <SelectItem value="alto">{t('dashboards.directive.institutionalAlerts.severityHigh')}</SelectItem>
                <SelectItem value="medio">{t('dashboards.directive.institutionalAlerts.severityMedium')}</SelectItem>
                <SelectItem value="bajo">{t('dashboards.directive.institutionalAlerts.severityLow')}</SelectItem>
              </SelectContent>
            </Select>
             <Select onValueChange={(value) => handleFilterChange('status', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-500 text-white text-sm">
                <SelectValue placeholder={t('dashboards.directive.institutionalAlerts.filterStatus')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-500 text-white">
                <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('dashboards.directive.institutionalAlerts.statusPending')}</SelectItem>
                <SelectItem value="addressed">{t('dashboards.directive.institutionalAlerts.statusAddressed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="mb-4 relative">
            <Input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border-slate-500 text-white placeholder-slate-300 focus:ring-orange-500 focus:border-orange-500 pl-8 sm:pl-10 text-sm sm:text-base"
            />
          </div>

          {isLoading && filteredAlerts.length === 0 ? <p className="text-center text-slate-400 py-4 text-sm sm:text-base">{t('common.loadingText')}</p> : 
            filteredAlerts.length === 0 ? <p className="text-center text-slate-400 py-4 text-sm sm:text-base">{t('dashboards.directive.institutionalAlerts.noAlertsFound')}</p> : (
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600 hover:bg-slate-700/40">
                    <TableHead className="text-orange-300 text-xs sm:text-sm">{t('dashboards.directive.institutionalAlerts.table.type')}</TableHead>
                    <TableHead className="text-orange-300 text-xs sm:text-sm">{t('dashboards.directive.institutionalAlerts.table.title')}</TableHead>
                    <TableHead className="text-orange-300 text-xs sm:text-sm">{t('dashboards.directive.institutionalAlerts.table.severity')}</TableHead>
                    <TableHead className="text-orange-300 text-xs sm:text-sm hidden sm:table-cell">{t('dashboards.directive.institutionalAlerts.table.date')}</TableHead>
                    <TableHead className="text-orange-300 text-xs sm:text-sm">{t('dashboards.directive.institutionalAlerts.table.status')}</TableHead>
                    <TableHead className="text-right text-orange-300 text-xs sm:text-sm">{t('dashboards.directive.institutionalAlerts.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map(alert => (
                    <TableRow key={alert.id} className="border-slate-600 hover:bg-slate-700/40">
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center">
                          {alertTypeIcons[alert.type] || alertTypeIcons.default}
                          <span className="hidden sm:inline">{t(`dashboards.directive.institutionalAlerts.alertTypes.${alert.type}`, alert.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-xs sm:text-sm" title={alert.title}>{alert.title}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{format(new Date(alert.date), 'PPP', { locale: es })}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{getStatusIcon(alert.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-orange-300 hover:text-white hover:bg-orange-600/20 border border-orange-600/30 text-xs sm:text-sm py-1 px-2">
                          <Eye size={14} className="sm:hidden"/>
                          <Eye size={16} className="hidden sm:block"/>
                          <span className="hidden sm:inline ml-1">{t('common.viewDetailsButton')}</span>
                        </Button>
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

export default InstitutionalAlertsPage;