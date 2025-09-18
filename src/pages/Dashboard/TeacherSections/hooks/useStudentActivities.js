import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import edgeFunctionService from '@/services/edgeFunctionService';

export const useStudentActivities = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchActivitiesByTeacher = useCallback(async (teacherId) => {
    if (!teacherId) return [];
    const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching activities by teacher:', error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingActivities'), variant: 'destructive' });
      return [];
    }
    return data || [];
  }, [t, toast]);

  const fetchActivitiesByStudent = useCallback(async (studentId) => {
    if (!studentId) return [];
     const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .eq('status', 'sent_to_student') // Only activities sent to student
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching activities for student:', error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingStudentActivities'), variant: 'destructive' });
      return [];
    }
    return data || [];
  }, [t, toast]);


  const saveActivities = useCallback(async (activities, studentId, teacherId, planId) => {
    const activitiesToUpsert = activities.map(act => ({
      id: act.id?.startsWith('temp-') ? undefined : act.id, // Use undefined for new temp IDs to let Supabase generate
      support_plan_id: planId,
      student_id: studentId,
      teacher_id: teacherId,
      title: act.title,
      description: act.description,
      due_date: act.due_date,
      type: act.type,
      status: 'saved', // Mark as saved by teacher
      raw_ai_suggestion: act.raw_ai_suggestion || null, // Store original AI suggestion if available
    }));

    const { error } = await supabase.from('student_activities').upsert(activitiesToUpsert, { onConflict: 'id' });

    if (error) {
      console.error('Error saving activities:', error);
      throw new Error(t('teacherDashboard.errorSavingActivities') + `: ${error.message}`);
    }
    return true;
  }, [t]);

  const sendActivitiesToStudent = useCallback(async (activities, studentId, teacherId, planId) => {
    // First, ensure activities are saved or updated with 'sent_to_student' status
    const activitiesToUpsert = activities.map(act => ({
      id: act.id?.startsWith('temp-') ? undefined : act.id,
      support_plan_id: planId,
      student_id: studentId,
      teacher_id: teacherId,
      title: act.title,
      description: act.description,
      due_date: act.due_date,
      type: act.type,
      status: 'sent_to_student',
      sent_at: new Date().toISOString(),
      raw_ai_suggestion: act.raw_ai_suggestion || null,
    }));
    
    const { data: savedActivities, error } = await supabase
        .from('student_activities')
        .upsert(activitiesToUpsert, { onConflict: 'id' })
        .select();


    if (error) {
      console.error('Error sending activities:', error);
      throw new Error(t('teacherDashboard.errorSendingActivities') + `: ${error.message}`);
    }
    
    // TODO: Here you might call another Edge Function to notify the student
    // For now, just updating the status is considered "sent"

    return savedActivities;
  }, [t]);
  
  const updateActivity = useCallback(async (activityId, updates) => {
    const { data, error } = await supabase
      .from('student_activities')
      .update(updates)
      .eq('id', activityId)
      .select()
      .single();

    if (error) {
      console.error('Error updating activity:', error);
      throw new Error(t('teacherDashboard.errorUpdatingActivity') + `: ${error.message}`);
    }
    return data;
  }, [t]);


  return {
    fetchActivitiesByTeacher,
    fetchActivitiesByStudent,
    saveActivities,
    sendActivitiesToStudent,
    updateActivity,
  };
};