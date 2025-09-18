import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle as AlertTriangleIcon, Filter, Users, BarChart2, Thermometer, CalendarX, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
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
  academic: <BarChart2 className="h-5 w-5 text-blue-400 mr-2" />,
  emotional: <Thermometer className="h-5 w-5 text-yellow-400 mr-2" />,
  attendance: <CalendarX className="h-5 w-5 text-red-400 mr-2" />,
  default: <AlertTriangleIcon className="h-5 w-5 text-orange-400 mr-2" />,
};

const InstitutionalAlertsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id, created_at, type, title, message, nivel_alerta, tipo_evento, is_read,
          student:estudiante_id (id, full_name, grade),
          user:user_id (id, full_name, role)
        `)
        .in('tipo_evento', ['riesgo_academico_grupal', 'riesgo_emocional_multiple', 'inasistencias_bloque']) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedAlerts = data.map(a => ({
        id: a.id,
        date: a.created_at,
        type: a.tipo_evento, 
        title: a.title,
        description: a.message,
        severity: a.nivel_alerta, 
        studentName: a.student?.full_name, 
        studentGrade: a.student?.grade,
        status: a.is_read ? 'addressed' : 'pending', 
        raw: a
      }));
      setAlerts(mappedAlerts);
      setFilteredAlerts(mappedAlerts);

    } catch (error) {
      console.error('Error fetching institutional alerts:', error);
      toast({ title: t('common.errorTitle'), description: t('directive.institutionalAlerts.fetchError'), variant: 'destructive' });
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
      case 'alto': return <Badge variant="destructive" className="bg-red-600 text-white">{t('directive.institutionalAlerts.severityHigh')}</Badge>;
      case 'medio': return <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-yellow-900/30">{t('directive.institutionalAlerts.severityMedium')}</Badge>;
      case 'bajo': return <Badge variant="outline" className="border-green-500 text-green-400 bg-green-900/30">{t('directive.institutionalAlerts.severityLow')}</Badge>;
      default: return <Badge variant="secondary">{severity || t('common.notSpecified')}</Badge>;
    }
  };
  
  const getStatusIcon = (status) => {
    if (status === 'addressed') return <CheckCircle className="h-5 w-5 text-green-400" title={t('directive.institutionalAlerts.statusAddressed')} />;
    return <Clock className="h-5 w-5 text-yellow-400" title={t('directive.institutionalAlerts.statusPending')} />;
  };

  const chartData = [
    { name: t('directive.institutionalAlerts.chart.academic'), count: alerts.filter(a=>a.type === 'riesgo_academico_grupal').length },
    { name: t('directive.institutionalAlerts.chart.emotional'), count: alerts.filter(a=>a.type === 'riesgo_emocional_multiple').length },
    { name: t('directive.institutionalAlerts.chart.attendance'), count: alerts.filter(a=>a.type === 'inasistencias_bloque').length },
  ];

  if (isLoading && alerts.length === 0) return <LoadingScreen text={t('common.loadingText')} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-red-800 to-orange-700 min-h-screen text-white"
    >
      <header className="mb-8 text-center">
        <AlertTriangleIcon size={48} className="mx-auto mb-4 text-red-300" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300">
          {t('directive.institutionalAlerts.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 max-w-2xl mx-auto">
          {t('directive.institutionalAlerts.pageDescription')}
        </p>
      </header>

      <Card className="mb-8 bg-slate-800/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-orange-300">{t('directive.institutionalAlerts.summaryTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid #475569', borderRadius: '0.5rem' }} itemStyle={{ color: '#e2e8f0' }}/>
              <Legend />
              <Bar dataKey="count" fill="#fb923c" name={t('directive.institutionalAlerts.chart.alertCount')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-orange-300 flex items-center">
            {t('directive.institutionalAlerts.alertsListTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Select onValueChange={(value) => handleFilterChange('course', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder={t('directive.institutionalAlerts.filterCourse')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white"><SelectItem value="all">{t('common.allCourses')}</SelectItem></SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('severity', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder={t('directive.institutionalAlerts.filterSeverity')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">{t('common.allSeverities')}</SelectItem>
                <SelectItem value="alto">{t('directive.institutionalAlerts.severityHigh')}</SelectItem>
                <SelectItem value="medio">{t('directive.institutionalAlerts.severityMedium')}</SelectItem>
                <SelectItem value="bajo">{t('directive.institutionalAlerts.severityLow')}</SelectItem>
              </SelectContent>
            </Select>
             <Select onValueChange={(value) => handleFilterChange('status', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder={t('directive.institutionalAlerts.filterStatus')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                <SelectItem value="pending">{t('directive.institutionalAlerts.statusPending')}</SelectItem>
                <SelectItem value="addressed">{t('directive.institutionalAlerts.statusAddressed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="mb-4 relative">
            <Input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 pl-10"
            />
          </div>

          {isLoading && filteredAlerts.length === 0 ? <p className="text-center text-slate-400 py-4">{t('common.loadingText')}</p> : 
            filteredAlerts.length === 0 ? <p className="text-center text-slate-400 py-4">{t('directive.institutionalAlerts.noAlertsFound')}</p> : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-orange-300">{t('directive.institutionalAlerts.table.type')}</TableHead>
                    <TableHead className="text-orange-300">{t('directive.institutionalAlerts.table.title')}</TableHead>
                    <TableHead className="text-orange-300">{t('directive.institutionalAlerts.table.severity')}</TableHead>
                    <TableHead className="text-orange-300">{t('directive.institutionalAlerts.table.date')}</TableHead>
                    <TableHead className="text-orange-300">{t('directive.institutionalAlerts.table.status')}</TableHead>
                    <TableHead className="text-right text-orange-300">{t('directive.institutionalAlerts.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map(alert => (
                    <TableRow key={alert.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>{alertTypeIcons[alert.type] || alertTypeIcons.default} {t(`directive.institutionalAlerts.alertTypes.${alert.type}`, alert.type)}</TableCell>
                      <TableCell className="max-w-xs truncate" title={alert.title}>{alert.title}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{format(new Date(alert.date), 'PPP', { locale: es })}</TableCell>
                      <TableCell>{getStatusIcon(alert.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300"><Eye size={16}/> {t('common.viewDetailsButton')}</Button>
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