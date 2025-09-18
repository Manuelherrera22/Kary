import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderKanban, Filter, Search, User, AlertTriangle, Loader2, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from "@/components/ui/use-toast";
import edgeFunctionService from '@/services/edgeFunctionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const RecentCasesPage = () => {
  const { t, language: currentLanguage } = useLanguage();
  const { user: authUser, userProfile } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const dateLocale = currentLanguage === 'es' ? es : enUS;

  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  
  const [filterOptions, setFilterOptions] = useState({
    status: [],
    riskLevel: [],
  });

  const fetchCases = useCallback(async (studentId = null) => {
    if (!authUser || !userProfile) return;
    setIsLoading(true);
    try {
      const payload = studentId ? { student_id: studentId } : {};
      
      const { data, error } = await edgeFunctionService.getStudentCaseOverview(payload);

      if (error) {
        // Check for specific error message from the Edge Function
        if (error.message && error.message.includes("student_id is required")) {
          // This is the expected error when no student_id is passed.
          // We can fetch all cases or show a specific message.
          // For now, let's assume an empty payload means "fetch all".
          // The Edge Function should be designed to handle an empty payload gracefully.
          // If it *always* requires a student_id, the logic here needs to change.
          // Let's proceed assuming the function can handle an empty payload for "all cases".
        }
        throw new Error(error.message || t('common.errorLoadingData'));
      }
      
      setCases(data?.cases || data || []);
    } catch (error) {
      console.error('Error fetching recent cases:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, [authUser, userProfile, t, toast]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data: statusData, error: statusError } = await edgeFunctionService.getDistinctKeyValuePairs({
        p_table_name: 'support_plans', 
        p_value_column: 'status',
        p_key_column: 'status' 
      });
      if (statusError) console.warn("Error fetching status filters:", statusError.message);
      else setFilterOptions(prev => ({ ...prev, status: statusData || [] }));

      const { data: riskData, error: riskError } = await edgeFunctionService.getDistinctKeyValuePairs({
        p_table_name: 'user_profiles', 
        p_value_column: 'emotional_risk', 
        p_key_column: 'emotional_risk'
      });
      if (riskError) console.warn("Error fetching risk filters:", riskError.message);
      else setFilterOptions(prev => ({ ...prev, riskLevel: riskData || [] }));

    } catch (error) {
      console.warn("Error fetching filter options:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchCases(); 
    fetchFilterOptions();
  }, [fetchCases, fetchFilterOptions]);

  const filteredCases = cases.filter(c => {
    const nameMatch = c.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || c.case_status?.toLowerCase() === statusFilter.toLowerCase();
    const riskMatch = riskFilter === 'all' || c.risk_level?.toLowerCase() === riskFilter.toLowerCase();
    return nameMatch && statusMatch && riskMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      return format(parseISO(dateString), 'PPpp', { locale: dateLocale });
    } catch (e) {
      return dateString; 
    }
  };

  const getRiskBadgeVariant = (riskLevel) => {
    const level = riskLevel?.toLowerCase();
    if (level === 'alto' || level === 'high') return 'destructive';
    if (level === 'medio' || level === 'medium') return 'warning';
    if (level === 'bajo' || level === 'low') return 'success';
    return 'outline';
  };
  
  const getStatusBadgeVariant = (status) => {
    const s = status?.toLowerCase();
    if (s === 'activo' || s === 'active' || s === 'en progreso' || s === 'in progress') return 'info';
    if (s === 'resuelto' || s === 'resolved' || s === 'completado' || s === 'completed') return 'success';
    if (s === 'pendiente' || s === 'pending') return 'warning';
    if (s === 'cerrado' || s === 'closed' || s === 'cancelado' || s === 'cancelled') return 'secondary';
    return 'outline';
  };

  const CaseCard = ({ caseItem }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/60 border border-slate-700 rounded-lg shadow-lg overflow-hidden"
      >
        <CardHeader className="p-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-sky-300 flex items-center">
              <User size={20} className="mr-2" /> {caseItem.student_name || t('common.notSpecified')}
            </CardTitle>
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <CardDescription className="text-xs text-slate-400 mt-1">
            {t('recentCasesPage.lastIntervention')}: {formatDate(caseItem.last_intervention_date)}
          </CardDescription>
        </CardHeader>
        {expanded && (
          <CardContent className="p-4 border-t border-slate-700 bg-slate-800/30">
            <div className="space-y-2 text-sm">
              <p><strong className="text-slate-300">{t('recentCasesPage.caseStatus')}:</strong> <Badge variant={getStatusBadgeVariant(caseItem.case_status)}>{caseItem.case_status || t('common.notSpecified')}</Badge></p>
              <p><strong className="text-slate-300">{t('recentCasesPage.riskLevel')}:</strong> <Badge variant={getRiskBadgeVariant(caseItem.risk_level)}>{caseItem.risk_level || t('common.notSpecified')}</Badge></p>
              <p><strong className="text-slate-300">{t('recentCasesPage.interventionType')}:</strong> {caseItem.last_intervention_type || t('common.notSpecified')}</p>
              <p><strong className="text-slate-300">{t('recentCasesPage.summary')}:</strong> {caseItem.case_summary || t('common.notSpecified')}</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4 text-sky-400 border-sky-500 hover:bg-sky-500/20 hover:text-sky-300"
              onClick={() => navigate(`/dashboard/student/${caseItem.student_id}/profile`)}
            >
              <Eye size={16} className="mr-2" /> {t('recentCasesPage.viewProfile')}
            </Button>
          </CardContent>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center">
              <FolderKanban size={36} className="mr-4 text-sky-400" />
              <div>
                <h1 className="text-3xl font-bold">{t('dashboards.psychopedagogue.latestCasesTitle')}</h1>
                <p className="text-slate-400">{t('dashboards.psychopedagogue.latestCasesPageSubtitle')}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('recentCasesPage.searchByName')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white focus:ring-sky-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <SelectValue placeholder={t('recentCasesPage.filterByStatus')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all" className="hover:bg-slate-600 focus:bg-slate-600">{t('recentCasesPage.allStatuses')}</SelectItem>
                {filterOptions.status.map(opt => <SelectItem key={opt.clave} value={opt.valor} className="hover:bg-slate-600 focus:bg-slate-600">{opt.valor}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <SelectValue placeholder={t('recentCasesPage.filterByRisk')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all" className="hover:bg-slate-600 focus:bg-slate-600">{t('recentCasesPage.allRiskLevels')}</SelectItem>
                {filterOptions.riskLevel.map(opt => <SelectItem key={opt.clave} value={opt.valor} className="hover:bg-slate-600 focus:bg-slate-600">{opt.valor}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-lg">
              <AlertTriangle size={48} className="mx-auto text-yellow-400 mb-4" />
              <p className="text-xl text-slate-300">{t('common.noDataAvailable')}</p>
              <p className="text-slate-400 mt-2">{t('recentCasesPage.noCasesFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCases.map(caseItem => (
                <CaseCard key={caseItem.student_id || caseItem.id} caseItem={caseItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentCasesPage;