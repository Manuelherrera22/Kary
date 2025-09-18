import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Users, UserPlus, Search, ListChecks, Filter, UserCheck, UserX, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import edgeFunctionService from '@/services/edgeFunctionService';

const AssignmentSection = ({ professionalRole, professionals, allStudents, t, toast }) => {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [searchTermStudents, setSearchTermStudents] = useState('');
  const [studentFilters, setStudentFilters] = useState({ grade: 'all', status: 'all' });
  const [assignedStudents, setAssignedStudents] = useState(new Set());
  const [studentsToAssign, setStudentsToAssign] = useState(new Set());
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professionalType = professionalRole === 'teacher' ? 'teacher' : 'guardian';

  const fetchAssignedStudentsForProfessional = useCallback(async () => {
    if (!selectedProfessionalId) {
      setAssignedStudents(new Set());
      return;
    }
    setIsLoadingAssignments(true);
    try {
      const assignmentTable = professionalRole === 'teacher' ? 'teacher_student_assignments' : 'guardian_student_assignments';
      const professionalIdColumn = professionalRole === 'teacher' ? 'teacher_id' : 'guardian_id';
      
      const { data, error } = await supabase
        .from(assignmentTable)
        .select('student_id')
        .eq(professionalIdColumn, selectedProfessionalId);

      if (error) throw error;
      setAssignedStudents(new Set(data.map(item => item.student_id)));
    } catch (error) {
      console.error(`Error fetching assigned students for ${professionalRole}:`, error);
      toast({ title: t('common.error'), description: t(`directiveDashboard.accessManagement.fetchAssignedStudentsError`), variant: 'destructive' });
    } finally {
      setIsLoadingAssignments(false);
    }
  }, [selectedProfessionalId, professionalRole, toast, t]);

  useEffect(() => {
    fetchAssignedStudentsForProfessional();
    setStudentsToAssign(new Set()); // Reset selection when professional changes
  }, [selectedProfessionalId, fetchAssignedStudentsForProfessional]);

  const filteredStudents = useMemo(() => 
    allStudents.filter(student => {
      const nameMatch = student.full_name?.toLowerCase().includes(searchTermStudents.toLowerCase());
      const gradeMatch = studentFilters.grade === 'all' || student.grade === studentFilters.grade;
      const statusMatch = studentFilters.status === 'all' || student.status === studentFilters.status;
      return nameMatch && gradeMatch && statusMatch;
    }), [allStudents, searchTermStudents, studentFilters]);

  const handleStudentSelectionChange = (studentId) => {
    setStudentsToAssign(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleAssignSelectedStudents = async () => {
    if (!selectedProfessionalId || studentsToAssign.size === 0) return;
    setIsSubmitting(true);

    const assignmentFunction = professionalRole === 'teacher' 
      ? edgeFunctionService.assignTeacherToStudent 
      : edgeFunctionService.assignGuardianToStudent;
    
    const professionalIdKey = professionalRole === 'teacher' ? 'teacher_id' : 'guardian_id';

    try {
      // The edge functions assign_teacher_to_student and assign_guardian_to_student
      // expect a single student_id and professional_id. We need to call them iteratively.
      // For a more robust solution, an edge function that handles multiple assignments would be better.
      
      for (const studentId of studentsToAssign) {
        if (assignedStudents.has(studentId)) {
          console.warn(`Student ${studentId} already assigned to ${selectedProfessionalId}. Skipping.`);
          continue; // Skip if already assigned to avoid errors from unique constraints
        }
        const payload = { student_id: studentId, [professionalIdKey]: selectedProfessionalId };
        const { data, error } = await assignmentFunction(payload);
        if (error || !data.success) {
          // If one assignment fails, we might want to stop or collect errors
          throw new Error(data?.error || `Failed to assign student ${studentId}`);
        }
      }
      
      toast({ title: t('common.success'), description: t(`toasts.assign${professionalType.charAt(0).toUpperCase() + professionalType.slice(1)}Success`) });
      fetchAssignedStudentsForProfessional(); // Refresh assignments
      setStudentsToAssign(new Set()); // Clear selection
    } catch (error) {
      console.error(`Error assigning students to ${professionalRole}:`, error);
      toast({ title: t('common.error'), description: t('toasts.assignError') + ` Detalle: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueGrades = useMemo(() => Array.from(new Set(allStudents.map(s => s.grade).filter(Boolean))).sort(), [allStudents]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(allStudents.map(s => s.status).filter(Boolean))).sort(), [allStudents]);

  if (professionals.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        <AlertCircle className="mx-auto mb-2 h-8 w-8" />
        <p>{t('directiveDashboard.accessManagement.noUsersFound', {role: professionalRole})}</p>
        <p className="text-sm mt-1">No se encontraron {professionalRole === 'teacher' ? 'docentes' : 'acudientes'} registrados en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white focus:ring-pink-500">
          <SelectValue placeholder={t(`directiveDashboard.accessManagement.select${professionalType.charAt(0).toUpperCase() + professionalType.slice(1)}Placeholder`)} />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700 text-white">
          {professionals.map(prof => (
            <SelectItem key={prof.id} value={prof.id} className="hover:bg-slate-700 focus:bg-slate-700">
              {prof.full_name} ({prof.email || 'Sin email'})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedProfessionalId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder={t('directiveDashboard.accessManagement.searchStudentPlaceholder')}
              value={searchTermStudents}
              onChange={(e) => setSearchTermStudents(e.target.value)}
              className="md:col-span-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-pink-500"
            />
            <Select value={studentFilters.grade} onValueChange={(value) => setStudentFilters(prev => ({ ...prev, grade: value }))}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue placeholder={t('directiveDashboard.accessManagement.filterByGrade')} /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-slate-700">{t('common.all')}</SelectItem>
                {uniqueGrades.map(grade => <SelectItem key={grade} value={grade} className="hover:bg-slate-700">{grade}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={studentFilters.status} onValueChange={(value) => setStudentFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue placeholder={t('directiveDashboard.accessManagement.filterByStatus')} /></SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                 <SelectItem value="all" className="hover:bg-slate-700">{t('common.all')}</SelectItem>
                {uniqueStatuses.map(status => <SelectItem key={status} value={status} className="hover:bg-slate-700">{t(`common.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          {isLoadingAssignments ? (
             <div className="flex justify-center items-center h-40"><LoadingScreen text={t('common.loadingText')} /></div>
          ) : (
            <ScrollArea className="h-[300px] border border-slate-700 rounded-md p-4">
              {filteredStudents.length > 0 ? (
                <ul className="space-y-2">
                  {filteredStudents.map(student => {
                    const isCurrentlyAssigned = assignedStudents.has(student.id);
                    return (
                      <li key={student.id} className={`flex items-center space-x-3 p-2 rounded transition-colors ${isCurrentlyAssigned ? 'bg-green-900/30' : 'hover:bg-slate-700/50'}`}>
                        <Checkbox
                          id={`student-${professionalRole}-${student.id}`}
                          checked={studentsToAssign.has(student.id) || isCurrentlyAssigned}
                          onCheckedChange={() => handleStudentSelectionChange(student.id)}
                          disabled={isCurrentlyAssigned}
                          className={`border-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white ${isCurrentlyAssigned ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                        <Label htmlFor={`student-${professionalRole}-${student.id}`} className={`flex-1 ${isCurrentlyAssigned ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          <span className="font-medium text-purple-300">{student.full_name}</span>
                          <span className="text-xs text-slate-400 ml-2">({student.grade || 'N/A'})</span>
                          {isCurrentlyAssigned && <span className="text-xs text-green-400 ml-2">({t('directiveDashboard.accessManagement.currentlyAssigned')})</span>}
                        </Label>
                        {isCurrentlyAssigned ? <UserCheck className="h-5 w-5 text-green-400" /> : <UserX className="h-5 w-5 text-slate-500" />}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-center text-slate-400 py-4">{t('directiveDashboard.accessManagement.noStudentsMatchFilters')}</p>
              )}
            </ScrollArea>
          )}
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handleAssignSelectedStudents} 
              disabled={isSubmitting || studentsToAssign.size === 0 || isLoadingAssignments}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              {isSubmitting ? t('directiveDashboard.accessManagement.assigningStudents') : t('directiveDashboard.accessManagement.assignButton')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};


const AccessManagementPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [teachers, setTeachers] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Consulta sin filtro de status para obtener TODOS los usuarios registrados
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, grade, status')
        .order('full_name', { ascending: true });

      if (usersError) throw usersError;
      
      // Separar por roles sin filtrar por status
      const teacherUsers = usersData.filter(u => u.role === 'teacher');
      const guardianUsers = usersData.filter(u => u.role === 'parent');
      const studentUsers = usersData.filter(u => u.role === 'student');
      
      setTeachers(teacherUsers);
      setGuardians(guardianUsers);
      setAllStudents(studentUsers);

      console.log('Teachers found:', teacherUsers.length);
      console.log('Guardians found:', guardianUsers.length);
      console.log('Students found:', studentUsers.length);

      // Log detallado para debugging
      console.log('Sample teachers:', teacherUsers.slice(0, 3));
      console.log('Sample guardians:', guardianUsers.slice(0, 3));

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: t('common.error'), description: t('directiveDashboard.accessManagement.fetchProfessionalsError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-rose-900 to-purple-800 min-h-screen text-white"
    >
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <ShieldCheck size={40} className="mr-3 text-rose-400" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">
            {t('directiveDashboard.accessManagementPage.pageTitle')}
          </h1>
        </div>
        <p className="text-slate-400">
          {t('directiveDashboard.accessManagementPage.pageDescription')}
        </p>
      </header>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700/50 border border-slate-600 mb-6">
          <TabsTrigger value="teachers" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" /> {t('directiveDashboard.accessManagement.assignTeacherTitle')}
          </TabsTrigger>
          <TabsTrigger value="guardians" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <UserPlus className="mr-2 h-4 w-4" /> {t('directiveDashboard.accessManagement.assignGuardianTitle')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-pink-400">
                {t('directiveDashboard.accessManagement.assignTeacherTitle')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('directiveDashboard.accessManagement.assignTeacherDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentSection
                professionalRole="teacher"
                professionals={teachers}
                allStudents={allStudents}
                t={t}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guardians">
          <Card className="bg-slate-800/70 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-purple-400">
                {t('directiveDashboard.accessManagement.assignGuardianTitle')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('directiveDashboard.accessManagement.assignGuardianDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <AssignmentSection
                professionalRole="parent" 
                professionals={guardians}
                allStudents={allStudents}
                t={t}
                toast={toast}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AccessManagementPage;