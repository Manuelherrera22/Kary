import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UserSelector from './UserSelector';
import AssignedUsersList from './AssignedUsersList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoleAssignments } from '@/pages/Dashboard/PsychopedagogueSections/hooks/useRoleAssignments.js';
import { Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ConfirmActionModal from '@/components/shared/ConfirmActionModal';


const AssignmentForm = () => {
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmDetails, setConfirmDetails] = useState({ title: '', description: '' });
  const [studentUserForModal, setStudentUserForModal] = useState(null);

  const { 
    assignedTeachers, 
    assignedGuardians, 
    loadingAssignments, 
    loadingAction,
    assignTeacherToStudent, 
    assignGuardianToStudent, 
    removeTeacherAssignment, 
    removeGuardianAssignment,
    fetchAssignmentsForStudent,
    users // Assuming users are fetched by the hook or passed some other way to get student name
  } = useRoleAssignments();

  useEffect(() => {
    if (selectedStudent) {
      fetchAssignmentsForStudent(selectedStudent);
      const studentDetails = users.find(u => u.value === selectedStudent);
      setStudentUserForModal(studentDetails);
    } else {
      setStudentUserForModal(null);
    }
  }, [selectedStudent, fetchAssignmentsForStudent, users]);
  
  const handleAssign = async (type) => {
    if (!selectedStudent) {
      toast({ title: t('assignments.errorFields'), description: t('assignments.selectStudentFirst'), variant: 'destructive' });
      return;
    }

    if (type === 'teacher') {
      if (!selectedTeacher) {
        toast({ title: t('assignments.errorFields'), description: t('assignments.teacherPlaceholder'), variant: 'destructive' });
        return;
      }
      await assignTeacherToStudent(selectedStudent, selectedTeacher);
      setSelectedTeacher(null); 
    } else if (type === 'guardian') {
      if (!selectedGuardian) {
        toast({ title: t('assignments.errorFields'), description: t('assignments.guardianPlaceholder'), variant: 'destructive' });
        return;
      }
      await assignGuardianToStudent(selectedStudent, selectedGuardian);
      setSelectedGuardian(null); 
    }
  };

  const openConfirmation = (action, title, description) => {
    setConfirmAction(() => action); 
    setConfirmDetails({ title, description });
    setConfirmModalOpen(true);
  };

  const handleRemove = (assignmentId, type) => {
    const assignment = type === 'teacher' 
      ? assignedTeachers.find(a => a.id === assignmentId)
      : assignedGuardians.find(a => a.id === assignmentId);
    
    openConfirmation(
      () => type === 'teacher' ? removeTeacherAssignment(assignmentId, selectedStudent) : removeGuardianAssignment(assignmentId, selectedStudent),
      t('assignments.confirmActionTitle'),
      t('assignments.confirmDeleteAssignment', { userName: assignment?.userFullName || 'Usuario', studentName: studentUserForModal?.label || 'Estudiante' })
    );
  };
  

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{t('assignments.studentPlaceholder')}</label>
        <UserSelector 
          value={selectedStudent}
          onSelect={setSelectedStudent}
          placeholder={t('assignments.studentPlaceholder')}
          filterRole="student"
        />
      </div>

      {selectedStudent && (
        <Tabs defaultValue="teacher" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 border-slate-600">
            <TabsTrigger value="teacher" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white text-slate-300">{t('assignments.tabAssignTeacher')}</TabsTrigger>
            <TabsTrigger value="guardian" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300">{t('assignments.tabAssignGuardian')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher" className="mt-4 p-4 bg-slate-700/30 rounded-md border border-slate-600">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('assignments.teacherPlaceholder')}</label>
                <UserSelector 
                  value={selectedTeacher}
                  onSelect={setSelectedTeacher}
                  placeholder={t('assignments.teacherPlaceholder')}
                  filterRole="teacher"
                  excludeIds={assignedTeachers.map(a => a.userId)}
                />
              </div>
              <Button onClick={() => handleAssign('teacher')} disabled={loadingAction || !selectedTeacher} className="w-full bg-pink-600 hover:bg-pink-700">
                {loadingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {t('assignments.assignTeacher')}
              </Button>
              <AssignedUsersList 
                title={t('assignments.assignedTeachers')}
                assignments={assignedTeachers}
                onRemove={(id) => handleRemove(id, 'teacher')}
                isLoading={loadingAssignments}
                itemType="teacher"
              />
            </div>
          </TabsContent>

          <TabsContent value="guardian" className="mt-4 p-4 bg-slate-700/30 rounded-md border border-slate-600">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t('assignments.guardianPlaceholder')}</label>
                <UserSelector 
                  value={selectedGuardian}
                  onSelect={setSelectedGuardian}
                  placeholder={t('assignments.guardianPlaceholder')}
                  filterRole="parent"
                  excludeIds={assignedGuardians.map(a => a.userId)}
                />
              </div>
              <Button onClick={() => handleAssign('guardian')} disabled={loadingAction || !selectedGuardian} className="w-full bg-purple-600 hover:bg-purple-700">
                {loadingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                {t('assignments.assignGuardian')}
              </Button>
               <AssignedUsersList 
                title={t('assignments.assignedGuardians')}
                assignments={assignedGuardians}
                onRemove={(id) => handleRemove(id, 'guardian')}
                isLoading={loadingAssignments}
                itemType="guardian"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <ConfirmActionModal
        isOpen={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={async () => {
          if (typeof confirmAction === 'function') {
            await confirmAction(); // Call the stored action
          }
          setConfirmModalOpen(false); // Ensure modal closes after action
        }}
        title={confirmDetails.title}
        description={confirmDetails.description}
        variant="destructive"
      />
    </div>
  );
};

export default AssignmentForm;