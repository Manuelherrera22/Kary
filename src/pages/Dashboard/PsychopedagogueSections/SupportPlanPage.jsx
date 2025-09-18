import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

import SupportPlanModal from './components/SupportPlanModal';
import CreateSupportPlanCanvas from './components/CreateSupportPlanCanvas';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ConfirmForceCompleteModal from './components/ConfirmForceCompleteModal';
import { useSupportPlans } from './hooks/useSupportPlans';
import edgeFunctionService from '@/services/edgeFunctionService';

import SupportPlanHeader from './SupportPlanPageComponents/SupportPlanHeader';
import SupportPlanList from './SupportPlanPageComponents/SupportPlanList';
import SupportPlanCharts from './SupportPlanPageComponents/SupportPlanCharts';
import ComplianceIndicator from './SupportPlanPageComponents/ComplianceIndicator';
import SummaryCards from './SupportPlanPageComponents/SummaryCards';
import DownloadablePlansModal from './SupportPlanPageComponents/DownloadablePlansModal'; 
import GenerateContextModal from './components/GenerateContextModal';
import StudentSelector from './SupportPlanPageComponents/StudentSelector';
import HeaderActions from './SupportPlanPageComponents/HeaderActions';
import DetailedPlanModal from './SupportPlanPageComponents/DetailedPlanModal';

import { Info, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const SupportPlanPage = () => {
  const { t } = useLanguage(); 
  const { user: authUser, userProfile } = useMockAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(location.state?.studentIdToFocus || '');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isGenerateContextModalOpen, setIsGenerateContextModalOpen] = useState(false);
  const [generatedContextForPlan, setGeneratedContextForPlan] = useState('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isDetailedPlanModalOpen, setIsDetailedPlanModalOpen] = useState(false);
  const [planForDetailView, setPlanForDetailView] = useState(null);

  const { 
    supportPlans, 
    isLoading: isLoadingPlans, 
    fetchSupportPlans, 
    addSupportPlan, 
    updateSupportPlan, 
    deleteSupportPlan,
    forceCompletePlan,
    setSupportPlans,
    complianceData,
    loadingCompliance,
    fetchComplianceStatus,
    summaryData,
    isLoadingSummary,
    fetchSummaryData,
  } = useSupportPlans(selectedStudentId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [planToForceComplete, setPlanToForceComplete] = useState(null);
  const [isConfirmForceCompleteOpen, setIsConfirmForceCompleteOpen] = useState(false);
  

  useEffect(() => {
    if (selectedStudentId && selectedStudentId !== 'all_students') {
      fetchSupportPlans(userProfile?.id, selectedStudentId);
      fetchSummaryData(selectedStudentId);
      fetchComplianceStatus(selectedStudentId);
      const student = students.find(s => s.id === selectedStudentId);
      setSelectedStudentName(student?.full_name || '');
    } else {
      setSupportPlans([]);
      // setSummaryData(null); // Handled by useSupportPlans
      setSelectedStudentName('');
    }
  }, [selectedStudentId, fetchSupportPlans, userProfile?.id, fetchSummaryData, fetchComplianceStatus, setSupportPlans, students]);
  
  const fetchStudentsForDropdown = useCallback(async () => {
    if (!authUser) return;
    try {
      const { data: studentData, error: studentError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'student')
        .order('full_name', { ascending: true });
      if (studentError) throw studentError;
      setStudents(studentData || []);
      
      const studentIdFromState = location.state?.studentIdToFocus;
      if (studentIdFromState) {
        const student = studentData.find(s => s.id === studentIdFromState);
        setSelectedStudentName(student?.full_name || '');
      }

    } catch (e) {
      console.error("Error fetching students for support plan page:", e);
      toast({
        title: t('toast.errorTitle'),
        description: t('supportPlans.errorFetchingStudents'),
        variant: 'destructive',
      });
    }
  }, [authUser, t, toast, location.state?.studentIdToFocus]);

  useEffect(() => {
    fetchStudentsForDropdown();
  }, [fetchStudentsForDropdown]);

  const handleStudentChange = (studentId) => {
    const finalStudentId = studentId === 'all_students' ? '' : studentId;
    setSelectedStudentId(finalStudentId);
    const student = students.find(s => s.id === finalStudentId);
    setSelectedStudentName(student?.full_name || '');
    setGeneratedContextForPlan(''); 
    navigate(location.pathname, { replace: true, state: { studentIdToFocus: finalStudentId }});
  };
  
  const handleOpenManualPlanModal = (plan = null) => {
    if (!selectedStudentId && !plan?.student_id) {
      toast({
          title: t('toasts.selectStudentErrorTitle'),
          description: t('toasts.selectStudentErrorDescription'),
          variant: 'destructive'
      });
      return;
    }
    setEditingPlan(plan);
    setIsModalOpen(true);
  };
  
  const handleOpenCanvas = (initialContext = '') => {
    if (!selectedStudentId || selectedStudentId === 'all_students') {
        toast({
            title: t('toasts.selectStudentErrorTitle'),
            description: t('toasts.selectStudentErrorDescription'),
            variant: 'destructive'
        });
        return;
    }
    if (!initialContext && !generatedContextForPlan) {
      toast({
        title: t('toast.warningTitle'),
        description: t('supportPlans.errorNoContextForAIPlan'),
        variant: 'default',
        action: <Zap className="text-yellow-400" />
      });
      return;
    }
    setGeneratedContextForPlan(initialContext || generatedContextForPlan); 
    setIsCanvasOpen(true);
  }

  const openConfirmDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setIsConfirmDeleteOpen(true);
  };

  const openConfirmForceCompleteModal = (plan) => {
    setPlanToForceComplete(plan);
    setIsConfirmForceCompleteOpen(true);
  };

  const handlePlanCreatedOrUpdated = (newOrUpdatedPlan) => {
    setSupportPlans(prev => {
      const index = prev.findIndex(p => p.id === newOrUpdatedPlan.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newOrUpdatedPlan;
        return updated;
      }
      return [newOrUpdatedPlan, ...prev];
    });

    if (selectedStudentId && selectedStudentId !== 'all_students') {
      fetchSummaryData(selectedStudentId);
    }
    setGeneratedContextForPlan(''); 
  };

  const handleSubmitManualPlan = async (planData) => {
    setIsSubmitting(true);
    const studentIdToSubmit = editingPlan?.student_id || selectedStudentId;
    
    if (!studentIdToSubmit || studentIdToSubmit === 'all_students') {
      toast({ title: t('toast.errorTitle'), description: t('supportPlans.errorNoStudentId'), variant: 'destructive'});
      setIsSubmitting(false);
      return;
    }
    
    const payload = {
      ...planData,
      responsible_person: authUser.id,
      student_id: studentIdToSubmit,
      creado_por: authUser.id,
    };

    let result;
    if (editingPlan && editingPlan.id) {
      result = await updateSupportPlan(editingPlan.id, payload);
    } else {
      result = await addSupportPlan(payload);
    }
    
    if (result) {
        setIsModalOpen(false);
        setEditingPlan(null);
        handlePlanCreatedOrUpdated(result);
        if (selectedStudentId && selectedStudentId !== 'all_students') {
           fetchSupportPlans(userProfile?.id, selectedStudentId);
        }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    setIsSubmitting(true);
    const success = await deleteSupportPlan(id);
    if (success) {
      setIsConfirmDeleteOpen(false);
      setPlanToDelete(null);
      if (selectedStudentId && selectedStudentId !== 'all_students') {
        await fetchSupportPlans(userProfile?.id, selectedStudentId); 
        fetchSummaryData(selectedStudentId);
      }
    }
    setIsSubmitting(false);
  };

  const handleActualForceComplete = async (id) => {
    setIsSubmitting(true);
    const result = await forceCompletePlan(id);
    if (result.success) {
      setIsConfirmForceCompleteOpen(false);
      setPlanToForceComplete(null);
      if (selectedStudentId && selectedStudentId !== 'all_students') {
        await fetchSupportPlans(userProfile?.id, selectedStudentId);
        fetchSummaryData(selectedStudentId);
      }
    }
    setIsSubmitting(false);
  };

  const handleOpenGenerateContextModal = () => {
     if (!selectedStudentId || selectedStudentId === 'all_students') {
        toast({
            title: t('toasts.selectStudentErrorTitle'),
            description: t('toasts.selectStudentErrorDescription'),
            variant: 'destructive'
        });
        return;
    }
    setIsGenerateContextModalOpen(true);
  }

  const handleContextGenerated = (context, tags) => {
    setGeneratedContextForPlan(context);
    setIsGenerateContextModalOpen(false);
    toast({ title: t('supportPlans.contextGeneratedSuccessTitle'), description: t('supportPlans.contextGeneratedSuccessDesc') });
    handleOpenCanvas(context);
  };

  const handleTogglePlanDetail = (plan) => {
    setPlanForDetailView(plan);
    setIsDetailedPlanModalOpen(true);
  };

  const isGeneratePlanDisabled = !selectedStudentId || selectedStudentId === 'all_students' || isLoadingPlans || !generatedContextForPlan;


  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 min-h-screen text-white"
      >
        <div className="container mx-auto max-w-7xl">
          <SupportPlanHeader onOpenModal={() => handleOpenManualPlanModal()} />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-[-2.5rem] bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700/80"
          >
            <StudentSelector 
              t={t}
              students={students}
              selectedStudentId={selectedStudentId}
              onStudentChange={handleStudentChange}
            />
            
            <HeaderActions
              t={t}
              selectedStudentId={selectedStudentId}
              isLoadingContext={isLoadingContext}
              isGeneratePlanDisabled={isGeneratePlanDisabled}
              generatedContextForPlan={generatedContextForPlan}
              onOpenGenerateContextModal={handleOpenGenerateContextModal}
              onOpenCanvas={handleOpenCanvas}
              onOpenManualPlanModal={() => handleOpenManualPlanModal()}
              onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
            />

            {selectedStudentId && selectedStudentId !== 'all_students' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4 text-sm"
              >
                <span className="font-semibold text-slate-300">{t('supportPlans.complianceStatus')}: </span>
                <ComplianceIndicator 
                  studentId={selectedStudentId} 
                  complianceData={complianceData} 
                  loadingCompliance={loadingCompliance} 
                />
              </motion.div>
            )}
            
            {(!selectedStudentId || selectedStudentId === 'all_students') && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-8 p-8 bg-slate-700/40 border border-slate-600/60 rounded-xl text-center shadow-lg"
              >
                <Info size={40} className="mx-auto text-sky-400 mb-4" />
                <p className="text-xl text-slate-200 font-semibold">{t('supportPlans.noStudentSelected')}</p>
                <p className="text-slate-400 mt-1">{t('supportPlans.selectStudentToView')}</p>
              </motion.div>
            )}

            {selectedStudentId && selectedStudentId !== 'all_students' && (
              <>
                <SummaryCards 
                  selectedStudentId={selectedStudentId}
                  studentName={selectedStudentName}
                  summaryData={summaryData} 
                  isLoadingSummary={isLoadingSummary} 
                  allPlansForStudent={supportPlans}
                />
                <SupportPlanList 
                  supportPlans={supportPlans}
                  isLoading={isLoadingPlans}
                  onEditPlan={handleOpenManualPlanModal}
                  onDeletePlan={openConfirmDeleteModal}
                  onTogglePlanDetail={handleTogglePlanDetail}
                  onForceCompletePlan={openConfirmForceCompleteModal}
                  currentUserRole={userProfile?.role}
                />
                <SupportPlanCharts supportPlans={supportPlans} />
              </>
            )}
          </motion.div>

        </div>
      </motion.div>

      <SupportPlanModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingPlan={editingPlan}
        onSubmit={handleSubmitManualPlan}
        isSubmitting={isSubmitting}
        students={students}
        selectedStudentId={selectedStudentId}
      />
      
      <CreateSupportPlanCanvas 
        isOpen={isCanvasOpen} 
        onOpenChange={setIsCanvasOpen}
        preselectedStudentId={selectedStudentId}
        initialObservations={generatedContextForPlan} 
        onPlanCreated={handlePlanCreatedOrUpdated}
      />

      <GenerateContextModal
        isOpen={isGenerateContextModalOpen}
        onOpenChange={setIsGenerateContextModalOpen}
        studentId={selectedStudentId}
        studentName={selectedStudentName}
        onContextGenerated={handleContextGenerated}
        isLoading={isLoadingContext}
        setIsLoading={setIsLoadingContext}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        itemToDelete={planToDelete}
        onDelete={() => handleDelete(planToDelete?.id)}
        isSubmitting={isSubmitting}
        itemName={planToDelete?.student?.full_name || planToDelete?.student_name || t('supportPlans.thisPlan')}
        confirmationMessageKey="supportPlans.confirmDeleteMessage"
      />

      <ConfirmForceCompleteModal
        isOpen={isConfirmForceCompleteOpen}
        onOpenChange={setIsConfirmForceCompleteOpen}
        planToComplete={planToForceComplete}
        onConfirm={() => handleActualForceComplete(planToForceComplete?.id)}
        isSubmitting={isSubmitting}
      />

      <DownloadablePlansModal
        isOpen={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
        plans={supportPlans}
        studentName={selectedStudentName}
      />
      
      <DetailedPlanModal
        isOpen={isDetailedPlanModalOpen}
        onOpenChange={setIsDetailedPlanModalOpen}
        plan={planForDetailView}
        onForceCompletePlan={openConfirmForceCompleteModal} 
        currentUserRole={userProfile?.role}
      />
    </>
  );
};

export default SupportPlanPage;