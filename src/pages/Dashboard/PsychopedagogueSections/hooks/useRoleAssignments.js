import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import edgeFunctionService from '@/services/edgeFunctionService';

export const useRoleAssignments = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState([]); // For UserSelector, student names
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [assignedGuardians, setAssignedGuardians] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const fetchAllUsersForSelector = useCallback(async () => {
    // This function is primarily for populating the UserSelector with student names
    // for the confirmation modal, not for general user selection which is handled within UserSelector.
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      if (error) throw error;
      setUsers(data.map(user => ({
        value: user.id,
        label: `${user.full_name || t('common.notSpecified')} (${user.email || t('common.notSpecified')})`,
        role: user.role,
      })));
    } catch (error) {
      console.error("Error fetching all users for modal:", error);
    }
  }, [t]);

  useEffect(() => {
    fetchAllUsersForSelector();
  }, [fetchAllUsersForSelector]);


  const fetchAssignmentsForStudent = useCallback(async (studentId) => {
    if (!studentId) {
      setAssignedTeachers([]);
      setAssignedGuardians([]);
      return;
    }
    setLoadingAssignments(true);
    try {
      const [
        { data: teachersData, error: teachersError },
        { data: guardiansData, error: guardiansError }
      ] = await Promise.all([
        supabase
          .from('teacher_student_assignments')
          .select('id, teacher:teacher_id(id, full_name, email)')
          .eq('student_id', studentId),
        supabase
          .from('guardian_student_assignments')
          .select('id, guardian:guardian_id(id, full_name, email)')
          .eq('student_id', studentId)
      ]);

      if (teachersError) throw teachersError;
      if (guardiansError) throw guardiansError;

      setAssignedTeachers(teachersData.map(a => ({ id: a.id, userId: a.teacher.id, userFullName: a.teacher.full_name, userEmail: a.teacher.email })));
      setAssignedGuardians(guardiansData.map(a => ({ id: a.id, userId: a.guardian.id, userFullName: a.guardian.full_name, userEmail: a.guardian.email })));
      
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({ title: t('toasts.errorTitle'), description: t('assignments.fetchAssignmentsError'), variant: 'destructive' });
      setAssignedTeachers([]);
      setAssignedGuardians([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, [t, toast]);

  const assignTeacherToStudent = async (studentId, teacherId) => {
    setLoadingAction(true);
    try {
      const { error } = await edgeFunctionService.assignTeacherToStudent({ // Direct call
        student_id: studentId,
        teacher_id: teacherId,
      });
      if (error) throw error;
      toast({ title: t('toasts.successTitle'), description: t('assignments.assignSuccess') });
      fetchAssignmentsForStudent(studentId); 
    } catch (error) {
      console.error("Error assigning teacher:", error);
      toast({ title: t('toasts.errorTitle'), description: error.message || t('assignments.assignError'), variant: 'destructive' });
    } finally {
      setLoadingAction(false);
    }
  };

  const assignGuardianToStudent = async (studentId, guardianId) => {
    setLoadingAction(true);
    try {
      const { error } = await edgeFunctionService.assignGuardianToStudent({ // Direct call
        student_id: studentId,
        guardian_id: guardianId,
      });
      if (error) throw error;
      toast({ title: t('toasts.successTitle'), description: t('assignments.assignSuccess') });
      fetchAssignmentsForStudent(studentId); 
    } catch (error) {
      console.error("Error assigning guardian:", error);
      toast({ title: t('toasts.errorTitle'), description: error.message || t('assignments.assignError'), variant: 'destructive' });
    } finally {
      setLoadingAction(false);
    }
  };

  const removeTeacherAssignment = async (assignmentId, studentIdToRefresh) => {
    setLoadingAction(true);
    try {
      const { error } = await supabase.from('teacher_student_assignments').delete().eq('id', assignmentId);
      if (error) throw error;
      toast({ title: t('toasts.successTitle'), description: t('assignments.deleteSuccess') });
      if (studentIdToRefresh) fetchAssignmentsForStudent(studentIdToRefresh);
      else setAssignedTeachers(prev => prev.filter(a => a.id !== assignmentId)); // Fallback if studentIdToRefresh is not passed
    } catch (error) {
      console.error("Error removing teacher assignment:", error);
      toast({ title: t('toasts.errorTitle'), description: t('assignments.deleteError'), variant: 'destructive' });
    } finally {
      setLoadingAction(false);
    }
  };

  const removeGuardianAssignment = async (assignmentId, studentIdToRefresh) => {
    setLoadingAction(true);
    try {
      const { error } = await supabase.from('guardian_student_assignments').delete().eq('id', assignmentId);
      if (error) throw error;
      toast({ title: t('toasts.successTitle'), description: t('assignments.deleteSuccess') });
      if (studentIdToRefresh) fetchAssignmentsForStudent(studentIdToRefresh);
      else setAssignedGuardians(prev => prev.filter(a => a.id !== assignmentId)); // Fallback
    } catch (error) {
      console.error("Error removing guardian assignment:", error);
      toast({ title: t('toasts.errorTitle'), description: t('assignments.deleteError'), variant: 'destructive' });
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    users, // Expose users list
    assignedTeachers,
    assignedGuardians,
    loadingAssignments,
    loadingAction,
    fetchAssignmentsForStudent,
    assignTeacherToStudent,
    assignGuardianToStudent,
    removeTeacherAssignment,
    removeGuardianAssignment,
  };
};