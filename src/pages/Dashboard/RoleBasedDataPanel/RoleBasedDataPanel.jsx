import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient';
import edgeFunctionService from '@/services/edgeFunctionService';
import { AlertTriangle, Filter, Users, BarChart2, Brain, FileText, Settings, BookOpen, Activity, HeartPulse, ChevronRight, MessageSquare, Loader2 } from 'lucide-react';

import InitialSelector from './components/InitialSelector';
import PriorityRadar from './components/PriorityRadar';
import AdvancedFilters from './components/AdvancedFilters';
import InformationModules from './components/InformationModules';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SkeletonCard } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast";

const RoleBasedDataPanel = () => {
  const { t } = useLanguage();
  const { userProfile, user: authUser } = useMockAuth(); // Renamed user to authUser to avoid conflict
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [studentsData, setStudentsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardSummary = useCallback(async (studentToFetchFor) => {
    if (!userProfile || !userProfile.role || !authUser) {
      console.log("User profile or authUser not available for summary fetch.");
      return;
    }

    let payload = { role: userProfile.role, user: authUser.id }; // Always include user and role

    if (userProfile.role === 'student') {
      payload.input_user_id = authUser.id;
    } else if (studentToFetchFor) {
      payload.student_id_for_professional_view = studentToFetchFor.id;
    }
    
    console.log("Fetching dashboard summary with payload:", payload);
    setSummaryLoading(true);
    try {
      // Usar datos mock para el resumen del dashboard
      const mockSummaryData = {
        totalStudents: userProfile.role === 'student' ? 1 : 15,
        activeSupportPlans: 8,
        completedActivities: 45,
        pendingTasks: 3,
        academicProgress: {
          excellent: 25,
          good: 50,
          needsImprovement: 20,
          atRisk: 5
        },
        emotionalWellbeing: {
          stable: 60,
          improving: 25,
          declining: 10,
          critical: 5
        },
        recentActivity: [
          {
            id: 1,
            type: 'activity_completed',
            description: 'Actividad de matemáticas completada',
            timestamp: new Date().toISOString(),
            student: 'María García'
          },
          {
            id: 2,
            type: 'support_plan_updated',
            description: 'Plan de apoyo actualizado',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            student: 'Carlos López'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'academic_concern',
            message: 'Estudiante requiere atención académica',
            priority: 'medium',
            timestamp: new Date().toISOString()
          }
        ]
      };

      console.log("Dashboard summary data:", mockSummaryData);
      setDashboardSummary(mockSummaryData);
    } catch (err) {
      console.error("Catch block error fetching dashboard summary:", err);
      toast({
        variant: "destructive",
        title: t('toasts.errorTitle'),
        description: t('roleBasedDataPanel.error.summaryFetchFailed'),
      });
      setDashboardSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, [userProfile, authUser, t, toast]);


  const fetchDataBasedOnRole = useCallback(async () => {
    if (!userProfile || !userProfile.role) {
      setError(t('roleBasedDataPanel.error.noRole'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('user_profiles').select(`
        id, full_name, email, role, status, grade, admission_date, avatar_url,
        academic_risk, emotional_risk, diagnostic_summary,
        teacher_observations (id, observation_date, situation),
        support_plans!fk_support_plans_student (id, support_goal, status, start_date),
        recursos_asignados (id, created_at, learning_resources (id, title, type)),
        tracking_data (id, created_at, mood_score, notes)
      `);

      if (userProfile.role === 'teacher') {
        const { data: assignments, error: assignmentError } = await supabase
          .from('teacher_student_assignments')
          .select('student_id')
          .eq('teacher_id', userProfile.id);
        if (assignmentError) throw assignmentError;
        const studentIds = assignments.map(a => a.student_id);
        query = query.in('id', studentIds);
      } else if (userProfile.role === 'parent') {
        const { data: links, error: linkError } = await supabase
          .from('parent_student_links')
          .select('student_user_id')
          .eq('parent_user_id', userProfile.id);
        if (linkError) throw linkError;
        const studentIds = links.map(l => l.student_user_id);
        query = query.in('id', studentIds);
      } else if (userProfile.role === 'student') {
        query = query.eq('id', userProfile.id);
      }
      
      const { data, error: dataError } = await query;
      if (dataError) throw dataError;
      
      const processedData = (data || []).map(student => ({
        ...student,
        support_plans: student.support_plans || [] 
      }));

      setStudentsData(processedData);
      setFilteredData(processedData); 
      
      const sortedByRisk = [...processedData]
        .sort((a, b) => (Number(b.academic_risk) || 0) + (Number(b.emotional_risk) || 0) - ((Number(a.academic_risk) || 0) + (Number(a.emotional_risk) || 0)))
        .slice(0, 5);
      setPriorityData(sortedByRisk);

      if (userProfile.role === 'student' && processedData.length > 0) {
        setSelectedStudent(processedData[0]);
        fetchDashboardSummary(processedData[0]); 
      } else if (userProfile.role !== 'student') {
        fetchDashboardSummary(null); 
      }


    } catch (err) {
      console.error("Error fetching data for panel:", err);
      setError(t('roleBasedDataPanel.error.fetchFailed', { details: err.message }));
      setStudentsData([]);
      setFilteredData([]);
      setPriorityData([]);
    } finally {
      setLoading(false);
    }
  }, [userProfile, t, fetchDashboardSummary]);

  useEffect(() => {
    fetchDataBasedOnRole();
  }, [fetchDataBasedOnRole]);

  const handleStudentSelection = (student) => {
    if (!student?.id) {
      toast({
        title: t('toasts.infoTitle'),
        description: t('roleBasedDataPanel.error.selectStudentBeforeProceeding'),
        variant: "default",
      });
      return;
    }
    setSelectedStudent(student);
    setSelectedGroup(null);
    if (userProfile.role !== 'student') {
      fetchDashboardSummary(student);
    }
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setSelectedStudent(null);
    fetchDashboardSummary(null); 
  };

  const handleFilterChange = (filters) => {
    let newFilteredData = [...studentsData];
    if (filters.diagnostic && filters.diagnostic !== 'all') {
      newFilteredData = newFilteredData.filter(s => s.diagnostic_summary?.condition === filters.diagnostic);
    }
    if (filters.performance && filters.performance !== 'all') {
      newFilteredData = newFilteredData.filter(s => {
        const risk = parseFloat(s.academic_risk);
        if (filters.performance === 'high') return risk < 30;
        if (filters.performance === 'medium') return risk >= 30 && risk < 70;
        if (filters.performance === 'low') return risk >= 70;
        return true;
      });
    }
    setFilteredData(newFilteredData);
    if (newFilteredData.length > 0 && !selectedStudent && !selectedGroup) {
      if (userProfile.role !== 'directive' && userProfile.role !== 'program_coordinator' && userProfile.role !== 'student') {
         
      }
    } else if (newFilteredData.length === 0) {
      setSelectedStudent(null);
      setSelectedGroup(null);
      if (userProfile.role !== 'student') fetchDashboardSummary(null); 
    }
  };
  
  const handleQuickAction = (action, item) => {
    console.log(`Action: ${action} on item:`, item);
    toast({
      title: t('common.featureInProgress'),
      description: t('common.featureUnavailableToast', { featureName: action }),
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard className="lg:col-span-1" />
          <SkeletonCard className="lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4 sm:m-6 bg-red-900/30 border-red-700 text-red-200">
        <CardHeader>
          <CardTitle className="flex items-center"><AlertTriangle className="mr-2" />{t('common.error')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={fetchDataBasedOnRole} variant="destructive" className="mt-4">
            {t('common.retryButton')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 space-y-6 text-white"
    >
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
          {t('roleBasedDataPanel.title')}
        </h1>
        <p className="text-slate-400">{t('roleBasedDataPanel.subtitle')}</p>
         {summaryLoading && <Loader2 className="animate-spin mr-2 inline-block" />}
         {dashboardSummary && userProfile.role === 'student' && (
          <Card className="mt-2 bg-slate-800/40 border-slate-700/50 p-3 text-xs">
            <p>{t('roleBasedDataPanel.summary.totalPlans')}: {dashboardSummary.total_planes ?? 'N/A'}</p>
            <p>{t('roleBasedDataPanel.summary.activePlans')}: {dashboardSummary.planes_activos ?? 'N/A'}</p>
          </Card>
        )}
      </header>

      <InitialSelector 
        role={userProfile.role} 
        students={studentsData}
        onStudentSelect={handleStudentSelection}
        onGroupSelect={handleGroupSelection} 
        currentSelection={selectedStudent || selectedGroup}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1 space-y-6">
          <PriorityRadar 
            priorityData={priorityData} 
            onSelect={handleStudentSelection} 
            onQuickAction={handleQuickAction}
          />
          <AdvancedFilters onFilterChange={handleFilterChange} />
        </aside>

        <main className="lg:col-span-2">
          {(selectedStudent || selectedGroup) ? (
            <InformationModules 
              role={userProfile.role} 
              selectedItem={selectedStudent || selectedGroup} 
              isGroup={!!selectedGroup}
              onQuickAction={handleQuickAction}
              dashboardSummary={dashboardSummary}
              summaryLoading={summaryLoading}
            />
          ) : (
             userProfile.role === 'student' && !selectedStudent ? (
              <Card className="bg-slate-800/50 border-slate-700/60">
                <CardContent className="p-10 text-center text-slate-400">
                  <Loader2 size={48} className="mx-auto mb-4 text-purple-400 animate-spin" />
                  <p>{t('roleBasedDataPanel.loadingStudentData')}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700/60">
                <CardContent className="p-10 text-center text-slate-400">
                  <Brain size={48} className="mx-auto mb-4 text-purple-400" />
                  <p>{t('roleBasedDataPanel.selectStudentOrGroupPrompt')}</p>
                </CardContent>
              </Card>
            )
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default RoleBasedDataPanel;