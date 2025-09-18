import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, FileText, Info, Loader2, UserX, CalendarDays, BookOpen, Activity, ShieldCheck, ArrowRightCircle, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import edgeFunctionService from '@/services/edgeFunctionService';
import { toast } from '@/components/ui/use-toast';
import DetailedPlanModal from '@/pages/Dashboard/PsychopedagogueSections/SupportPlanPageComponents/DetailedPlanModal';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';

const StudentStatusIndicator = ({ statusKey, t }) => {
  let bgColor = 'bg-slate-500';
  let textColor = 'text-slate-100';
  const normalizedStatusKey = statusKey ? statusKey.toLowerCase() : 'unknown';

  switch (normalizedStatusKey) {
    case 'active':
    case 'activo':
      bgColor = 'bg-green-500';
      break;
    case 'inactive':
    case 'inactivo':
      bgColor = 'bg-red-500';
      break;
    case 'graduated':
    case 'graduado':
      bgColor = 'bg-blue-500';
      break;
    case 'suspended':
    case 'suspendido':
      bgColor = 'bg-yellow-500';
      break;
    default:
      bgColor = 'bg-gray-400';
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {t(`parentDashboard.status${normalizedStatusKey.charAt(0).toUpperCase() + normalizedStatusKey.slice(1)}`, statusKey)}
    </span>
  );
};


const AssignedChildrenList = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChildForPlan, setSelectedChildForPlan] = useState(null);
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
    } catch (error) {
      return dateString; 
    }
  };

  useEffect(() => {
    const fetchAssignedChildren = async () => {
      if (!userProfile || userProfile.role !== 'parent') return;
      setIsLoading(true);
      try {
        const { data, error } = await edgeFunctionService.getAssignedStudentsByGuardian({ guardian_id: userProfile.id });
        if (error) throw error;
        
        // The data structure from the function is an array of students: { student_id, full_name, academic_level, assigned_at, support_plan_id, status }
        const childrenWithDetails = (data || []).map(child => ({
          ...child,
          id: child.student_id, // Ensure 'id' is present
          academicLevel: child.academic_level || t('common.notAvailable'),
          status: child.status || t('parentDashboard.statusUnknown'),
          assignedAt: child.assigned_at ? formatDate(child.assigned_at) : t('common.notAvailable'),
          planId: child.support_plan_id,
        }));
        setChildren(childrenWithDetails);

      } catch (error) {
        console.error("Error fetching assigned children:", error);
        toast({ title: t('toasts.error'), description: t('parentDashboard.loading'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignedChildren();
  }, [userProfile, t, language]);

  const viewSupportPlan = async (studentId) => {
    const child = children.find(c => c.id === studentId);
    if (!child || !child.planId) {
      toast({ title: t('common.info'), description: t('parentDashboard.noSupportPlan'), variant: 'default' });
      return;
    }

    setSelectedChildForPlan(child);
    try {
      const { data: planDetails, error: planError } = await supabase
        .from('support_plans')
        .select('*, student:user_profiles!student_id(full_name)')
        .eq('id', child.planId)
        .single();

      if (planError) throw planError;
      
      setSelectedPlanData({
          id: planDetails.id,
          plan_json: planDetails.plan_json || { preview: t('parentDashboard.noPlanAvailable') },
          student_id: child.student_id, 
          student_name: child.full_name,
          status: planDetails.status, 
          start_date: planDetails.start_date,
          end_date: planDetails.end_date,
          emotional_support: planDetails.plan_json?.emotional_support,
          academic_support: planDetails.plan_json?.academic_support,
          recommendations: planDetails.plan_json?.recommendations,
          plan_preview: planDetails.plan_json?.preview,
      });
      setIsPlanModalOpen(true);
    } catch(error) {
      toast({ title: t('toasts.error'), description: t('parentDashboard.errorFetchingPlanDetails', 'Error al cargar detalles del plan.'), variant: 'destructive' });
      setSelectedPlanData({ 
          id: child.planId,
          plan_json: { preview: t('parentDashboard.noPlanAvailable') },
          student_id: child.student_id,
          student_name: child.full_name
      });
      setIsPlanModalOpen(true);
    }
  };

  const handleViewDetails = (childId) => {
    // This could navigate to a more detailed student profile page if available
    // For now, let's assume it navigates to the generic student profile
    navigate(`/dashboard/student/${childId}/profile`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
        <p className="text-lg text-slate-300">{t('parentDashboard.loading')}</p>
      </div>
    );
  }
  
  if (children.length === 0) {
     return (
      <Card className="bg-slate-800/70 border-slate-700 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center"><UserX size={24} className="mr-2" />{t('dashboard.guardianDashboard.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Info size={48} className="text-slate-500 mb-4" />
          <p className="text-slate-300">{t('parentDashboard.noStudents')}</p>
          <p className="text-sm text-slate-400 mt-1">{t('parentDashboard.noChildrenAssigned')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-6">
      <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {t('dashboard.guardianDashboard.title')}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t('parentDashboard.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[calc(100vh-400px)] p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: children.indexOf(child) * 0.05 }}
                  className="h-full"
                >
                  <Card className="bg-slate-700/50 border-slate-600 hover:shadow-purple-500/20 transition-all duration-300 flex flex-col justify-between h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-lg text-slate-100 flex items-center">
                          <User size={20} className="mr-2 text-purple-300"/> {child.full_name}
                        </CardTitle>
                        <StudentStatusIndicator statusKey={child.status} t={t} />
                      </div>
                      <div className="text-sm text-slate-300 space-y-1">
                        <p className="flex items-center"><BookOpen size={14} className="mr-2 text-sky-400"/>{t('parentDashboard.academicLevel')}: {child.academicLevel}</p>
                        <p className="flex items-center"><CalendarDays size={14} className="mr-2 text-green-400"/>{t('parentDashboard.assignedAt')}: {child.assignedAt}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end pt-2">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-auto">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(child.id)} className="flex-1 sm:flex-initial border-sky-500/70 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 transition-colors">
                          <ArrowRightCircle size={16} className="mr-1.5" /> {t('parentDashboard.viewDetails')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => viewSupportPlan(child.id)} className="flex-1 sm:flex-initial border-pink-500/70 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 transition-colors" disabled={!child.planId}>
                          <Eye size={16} className="mr-1.5" /> {t('dashboard.guardianDashboard.viewSupportPlan')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedPlanData && isPlanModalOpen && (
        <DetailedPlanModal
          isOpen={isPlanModalOpen}
          onOpenChange={setIsPlanModalOpen}
          plan={selectedPlanData}
          student={selectedChildForPlan}
          currentUserRole={userProfile?.role}
        />
      )}
    </motion.div>
  );
};

export default AssignedChildrenList;