import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity as ActivityIcon, Users, Filter, Search, CalendarDays } from 'lucide-react';
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

const RoleActivityPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          id, created_at, action_type, target_entity, target_id, details,
          user:user_id (id, full_name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(100); 

      if (error) throw error;
      setActivityLog(data || []);
      setFilteredLog(data || []);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      toast({ title: t('common.errorTitle'), description: t('directive.roleActivity.fetchError'), variant: 'destructive' });
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
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-indigo-800 to-sky-700 min-h-screen text-white"
    >
      <header className="mb-8 text-center">
        <ActivityIcon size={48} className="mx-auto mb-4 text-indigo-300" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-300">
          {t('directive.roleActivity.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 max-w-2xl mx-auto">
          {t('directive.roleActivity.pageDescription')}
        </p>
      </header>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-sky-300 flex items-center">
             {t('directive.roleActivity.logTitle')}
          </CardTitle>
          <CardDescription className="text-slate-400">{t('directive.roleActivity.logDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Select onValueChange={(value) => handleFilterChange('role', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder={t('directive.roleActivity.filterRole')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all">{t('common.allRoles')}</SelectItem>
                {uniqueRoles.map(role => <SelectItem key={role} value={role}>{t(`roles.${role}`, role)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('actionType', value)} defaultValue="all">
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder={t('directive.roleActivity.filterActionType')} /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                 <SelectItem value="all">{t('common.allActions')}</SelectItem>
                {uniqueActionTypes.map(type => <SelectItem key={type} value={type}>{t(`auditLogActions.${type}`, type)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 flex items-center justify-start text-left">
                <CalendarDays size={16} className="mr-2" /> {t('directive.roleActivity.filterDateRange')}
            </Button>
          </div>
          <div className="mb-4 relative">
             <Input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>

          {isLoading && filteredLog.length === 0 ? <p className="text-center text-slate-400 py-4">{t('common.loadingText')}</p> : 
            filteredLog.length === 0 ? <p className="text-center text-slate-400 py-4">{t('directive.roleActivity.noActivityFound')}</p> : (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-sky-300">{t('directive.roleActivity.table.user')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.roleActivity.table.role')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.roleActivity.table.action')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.roleActivity.table.details')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.roleActivity.table.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLog.map(log => (
                    <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/30">
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