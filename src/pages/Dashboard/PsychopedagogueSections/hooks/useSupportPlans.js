import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import edgeFunctionService from '@/services/edgeFunctionService';

export const useSupportPlans = (initialStudentId = null) => {
    const [supportPlans, setSupportPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [complianceData, setComplianceData] = useState({});
    const [loadingCompliance, setLoadingCompliance] = useState({});
    const [summaryData, setSummaryData] = useState(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const { toast } = useToast();
    const { t } = useLanguage();

    const fetchSupportPlans = useCallback(async (userId, studentId) => {
        if (!studentId || studentId === 'all_students' || studentId === '') {
            setSupportPlans([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('support_plans')
                .select(`
                    id,
                    created_at,
                    plan_json,
                    support_goal,
                    support_strategy,
                    start_date,
                    end_date,
                    status,
                    type,
                    assigned,
                    assigned_at,
                    student:students!student_id(id, full_name),
                    responsible_person_profile:user_profiles!responsible_person(id, full_name)
                `)
                .order('created_at', { ascending: false });

            query = query.eq('student_id', studentId);
            
            const { data, error: queryError } = await query;

            if (queryError) throw queryError;
            
            setSupportPlans(data || []);
        } catch (err) {
            console.error("Error fetching support plans:", err);
            setError(err.message);
            toast({
                variant: 'destructive',
                title: t('toasts.errorLoadingInfoTitle'),
                description: t('toasts.errorLoadingInfoDescription'),
            });
            setSupportPlans([]);
        } finally {
            setIsLoading(false);
        }
    }, [t, toast]);
    
    const fetchSummaryData = useCallback(async (studentId) => {
      if (!studentId || studentId === 'all_students') {
        setSummaryData(null);
        return;
      }
      setIsLoadingSummary(true);
      try {
        const { data, error: summaryError } = await edgeFunctionService.getSupportPlanSummary({ student_id: studentId });
        if (summaryError) {
          console.error("Error fetching summary data:", summaryError);
          toast({ title: t('toasts.errorLoadingInfoTitle'), description: t('toasts.errorLoadingInfoDescription'), variant: 'destructive' });
          setSummaryData(null);
        } else {
          setSummaryData(data);
        }
      } catch (e) {
        console.error("Error fetching summary data (catch):", e);
        toast({ title: t('toasts.errorLoadingInfoTitle'), description: t('toasts.errorLoadingInfoDescription'), variant: 'destructive' });
        setSummaryData(null);
      } finally {
        setIsLoadingSummary(false);
      }
    }, [t, toast]);

    const fetchComplianceStatus = useCallback(async (studentId) => {
        if (!studentId || studentId === 'all_students') {
            setComplianceData(prev => ({ ...prev, [studentId]: { status: null, date: null } }));
            return;
        }
        setLoadingCompliance(prev => ({ ...prev, [studentId]: true }));
        try {
            const { data, error: complianceError } = await edgeFunctionService.validateSupportCompliance({ student_id: studentId });
            if (complianceError) throw complianceError;
            setComplianceData(prev => ({ ...prev, [studentId]: { status: data.is_compliant, date: data.last_review_date } }));
        } catch (e) {
            console.error(`Error fetching compliance for student ${studentId}:`, e);
            toast({ title: t('toast.errorTitle'), description: t('supportPlans.errorFetchingCompliance'), variant: 'destructive' });
            setComplianceData(prev => ({ ...prev, [studentId]: { status: null, date: null } }));
        } finally {
            setLoadingCompliance(prev => ({ ...prev, [studentId]: false }));
        }
    }, [t, toast]);

    useEffect(() => {
        if (initialStudentId && initialStudentId !== 'all_students') {
            fetchComplianceStatus(initialStudentId);
            fetchSummaryData(initialStudentId);
        }
    }, [initialStudentId, fetchComplianceStatus, fetchSummaryData]);


    const addSupportPlan = async (planData) => {
        try {
            const { data, error: insertError } = await supabase
                .from('support_plans')
                .insert(planData)
                .select(`
                    id,
                    created_at,
                    plan_json,
                    support_goal,
                    support_strategy,
                    start_date,
                    end_date,
                    status,
                    type,
                    assigned,
                    assigned_at,
                    student:students!student_id(id, full_name),
                    responsible_person_profile:user_profiles!responsible_person(id, full_name)
                `)
                .single();
            if (insertError) throw insertError;
            toast({ title: t('toast.successTitle'), description: t('supportPlans.addSuccess') });
            return data;
        } catch (err) {
            console.error("Error creating support plan:", err);
            toast({ variant: 'destructive', title: t('toast.errorTitle'), description: t('supportPlans.errorAddingPlan') });
            return null;
        }
    };

    const updateSupportPlan = async (planId, planData) => {
        try {
            const metadataPayload = {
                plan_id: planId,
                start_date: planData.start_date,
                end_date: planData.end_date,
                support_goal: planData.support_goal,
                support_strategy: planData.support_strategy,
                status: planData.status,
                plan_json: planData.plan_json,
            };
            
            const { data, error: edgeError } = await edgeFunctionService.updateSupportPlanMetadata(metadataPayload);

            if (edgeError || data?.error) {
                const errorMessage = edgeError?.message || data?.error?.message || t('supportPlans.errorUpdatingPlan');
                throw new Error(errorMessage);
            }
            
            const updatedPlan = { 
                ...supportPlans.find(p => p.id === planId), 
                ...planData,
                 student: planData.student_id ? { id: planData.student_id, full_name: planData.student_name || ''} : supportPlans.find(p => p.id === planId)?.student,
                responsible_person_profile: planData.responsible_person ? { id: planData.responsible_person, full_name: planData.responsible_person_name || ''} : supportPlans.find(p => p.id === planId)?.responsible_person_profile,
            };

            toast({ title: t('toast.successTitle'), description: t('supportPlans.updateSuccess') });
            return updatedPlan;
        } catch (err) {
            console.error("Error updating support plan:", err);
            toast({ variant: 'destructive', title: t('toast.errorTitle'), description: err.message || t('supportPlans.errorUpdatingPlan') });
            return null;
        }
    };

    const forceCompletePlan = async (planId) => {
        try {
            const { data, error: edgeError } = await edgeFunctionService.karyaiForceCompletePlan({ plan_id: planId });
            if (edgeError || data?.error) {
                const errorMessage = edgeError?.message || data?.error?.message || t('supportPlans.errorForceCompletingPlan');
                throw new Error(errorMessage);
            }
            toast({ title: t('toast.successTitle'), description: data?.message || t('supportPlans.forceCompleteSuccess') });
            return { success: true, data };
        } catch (err) {
            console.error("Error force completing support plan:", err);
            toast({ variant: 'destructive', title: t('toast.errorTitle'), description: err.message || t('supportPlans.errorForceCompletingPlan') });
            return { success: false, error: err };
        }
    };

    const assignSupportPlanToStudent = async (planId) => {
        try {
            const { data, error: assignError } = await supabase
                .from('support_plans')
                .update({ assigned: true, assigned_at: new Date().toISOString(), status: 'active' })
                .eq('id', planId)
                .select('id, assigned, assigned_at, status')
                .single();
            if (assignError) throw assignError;
            return data;
        } catch (err) {
            console.error("Error assigning support plan:", err);
            toast({ variant: 'destructive', title: t('toast.errorTitle'), description: t('supportPlans.errorAssigningPlan') });
            return null;
        }
    };

    const deleteSupportPlan = async (planId) => {
        try {
            const { error: deleteError } = await supabase.from('support_plans').delete().eq('id', planId);
            if (deleteError) throw deleteError;
            toast({ title: t('toast.successTitle'), description: t('supportPlans.deleteSuccess') });
            return true;
        } catch (err) {
            console.error("Error deleting support plan:", err);
            toast({ variant: 'destructive', title: t('toast.errorTitle'), description: t('supportPlans.errorDeletingPlan') });
            return false;
        }
    };

    return {
        supportPlans,
        isLoading,
        error,
        fetchSupportPlans,
        addSupportPlan,
        updateSupportPlan,
        deleteSupportPlan,
        assignSupportPlanToStudent,
        forceCompletePlan,
        setSupportPlans,
        complianceData,
        loadingCompliance,
        fetchComplianceStatus,
        summaryData,
        isLoadingSummary,
        fetchSummaryData,
    };
};