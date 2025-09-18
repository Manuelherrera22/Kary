import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardEdit, Users, CalendarDays, Send, Loader2, Layers, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import RegisterStudentButton from '@/pages/Dashboard/PsychopedagogueSections/components/RegisterStudentButton';

const AssignTaskPage = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { toast } = useToast();

  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignToAllFiltered, setAssignToAllFiltered] = useState(false);

  const fetchStudentsAndGrades = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, grade')
        .eq('role', 'student')
        .order('grade', { ascending: true })
        .order('full_name', { ascending: true });

      if (studentsError) throw studentsError;
      
      setAllStudents(studentsData || []);
      const uniqueGrades = [...new Set(studentsData.map(s => s.grade).filter(g => g))].sort();
      setGrades(uniqueGrades);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('assignTaskPage.errorFetchingStudentsOrGrades'),
        variant: 'destructive',
      });
      setAllStudents([]);
      setGrades([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchStudentsAndGrades();
  }, [fetchStudentsAndGrades]);

  useEffect(() => {
    if (selectedGrade === 'all') {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(allStudents.filter(student => student.grade === selectedGrade));
    }
    setSelectedStudentIds([]); 
    setAssignToAllFiltered(false);
  }, [selectedGrade, allStudents]);
  
  const handleSelectStudent = (studentId) => {
    setSelectedStudentIds(prevSelected =>
      prevSelected.includes(studentId)
        ? prevSelected.filter(id => id !== studentId)
        : [...prevSelected, studentId]
    );
    setAssignToAllFiltered(false); 
  };

  const handleSelectAllFilteredStudents = (checked) => {
    setAssignToAllFiltered(checked);
    if (checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };
  
  const getSelectedStudentsText = () => {
    if (isLoadingData) return t('assignTaskPage.loadingStudents');
    if (allStudents.length === 0) return t('assignTaskPage.noStudentsAvailable');
    if (filteredStudents.length === 0 && selectedGrade !== 'all') return t('assignTaskPage.noStudentsInThisGrade');

    if (assignToAllFiltered && filteredStudents.length > 0) {
      return t('assignTaskPage.allStudentsInGradeSelected', { count: filteredStudents.length, grade: selectedGrade === 'all' ? t('assignTaskPage.allGrades') : selectedGrade });
    }
    if (selectedStudentIds.length === 0) {
      return t('assignTaskPage.selectStudentsPlaceholder');
    }
    if (selectedStudentIds.length === 1) {
      const student = allStudents.find(s => s.id === selectedStudentIds[0]);
      return student ? student.full_name : t('assignTaskPage.oneStudentSelected');
    }
    return t('assignTaskPage.multipleStudentsSelected', { count: selectedStudentIds.length });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || selectedStudentIds.length === 0 || !taskTitle || !taskDueDate) {
      toast({
        title: t('toast.errorTitle'),
        description: t('assignTaskPage.errorAllFieldsRequiredMulti'),
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    const tasksToInsert = selectedStudentIds.map(studentId => ({
      user_id: studentId,
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate,
      created_by: user.id, 
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    try {
      const { error } = await supabase
        .from('student_tasks')
        .insert(tasksToInsert);

      if (error) throw error;

      toast({
        title: t('toast.successTitle'),
        description: t('assignTaskPage.tasksAssignedSuccess', { count: selectedStudentIds.length }),
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      setSelectedStudentIds([]);
      setAssignToAllFiltered(false);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate('');

    } catch (error) {
      console.error('Error assigning tasks:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('assignTaskPage.errorAssigningTask'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const noStudentsAvailable = !isLoadingData && allStudents.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-3xl"> {/* Increased max-width for better layout */}
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('common.backToDashboard')}
        </Link>

        <header className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 flex items-center">
              <ClipboardEdit size={36} className="mr-3" />
              {t('assignTaskPage.title')}
            </h1>
            <p className="text-slate-400 text-lg mt-1">{t('assignTaskPage.subtitle')}</p>
          </div>
          <div className="flex justify-end"> {/* Aligns button to the right */}
            <RegisterStudentButton onStudentCreated={fetchStudentsAndGrades} />
          </div>
        </header>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8 bg-slate-700/30 backdrop-blur-md rounded-xl shadow-2xl border border-slate-600"
        >
          <div>
            <Label htmlFor="task-title" className="text-slate-300">{t('assignTaskPage.taskTitleLabel')}</Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t('assignTaskPage.taskTitlePlaceholder')}
              required
              className="bg-slate-700 border-slate-600 text-white focus:ring-teal-500"
            />
          </div>

          <div>
            <Label htmlFor="task-description" className="text-slate-300">{t('assignTaskPage.taskDescriptionLabel')}</Label>
            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder={t('assignTaskPage.taskDescriptionPlaceholder')}
              className="bg-slate-700 border-slate-600 text-white focus:ring-teal-500 min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="task-due-date" className="text-slate-300 flex items-center mb-1">
              <CalendarDays size={18} className="mr-2 text-teal-400" />
              {t('assignTaskPage.taskDueDateLabel')}
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              className="bg-slate-700 border-slate-600 text-white focus:ring-teal-500"
            />
          </div>

          <div>
            <Label htmlFor="grade-select" className="text-slate-300 flex items-center mb-1">
              <Layers size={18} className="mr-2 text-teal-400" />
              {t('assignTaskPage.selectGradeLabel')}
            </Label>
            <Select 
              value={selectedGrade} 
              onValueChange={setSelectedGrade} 
              name="selectedGrade"
              disabled={isLoadingData || noStudentsAvailable}
            >
              <SelectTrigger id="grade-select" className="w-full bg-slate-700 border-slate-600 text-white focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder={isLoadingData ? t('assignTaskPage.loadingGrades') : t('assignTaskPage.selectGradePlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="all" className="hover:bg-slate-600 focus:bg-slate-600">{t('assignTaskPage.allGrades')}</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade} className="hover:bg-slate-600 focus:bg-slate-600">
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="student-select-trigger" className="text-slate-300 flex items-center mb-1">
              <Users size={18} className="mr-2 text-teal-400" />
              {t('assignTaskPage.selectStudentsLabel')}
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  id="student-select-trigger" 
                  variant="outline" 
                  className="w-full justify-start bg-slate-700 border-slate-600 text-white hover:bg-slate-600 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isLoadingData || noStudentsAvailable || (filteredStudents.length === 0 && selectedGrade !== 'all')}
                >
                  <span className="truncate max-w-[calc(100%-30px)]">{getSelectedStudentsText()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-slate-700 border-slate-600 text-white max-h-60 overflow-y-auto">
                <DropdownMenuLabel>{t('assignTaskPage.studentListLabel')} ({selectedGrade === 'all' ? t('assignTaskPage.allGrades') : selectedGrade})</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-500" />
                {isLoadingData ? (
                  <DropdownMenuItem disabled className="text-slate-400 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> {t('assignTaskPage.loadingStudents')}
                  </DropdownMenuItem>
                ) : noStudentsAvailable ? (
                  <DropdownMenuItem disabled className="text-slate-400">{t('assignTaskPage.noStudentsAvailable')}</DropdownMenuItem>
                ) : filteredStudents.length > 0 ? (
                  <>
                    <DropdownMenuCheckboxItem
                      checked={assignToAllFiltered}
                      onCheckedChange={handleSelectAllFilteredStudents}
                      className="hover:bg-slate-600 focus:bg-slate-600"
                    >
                      {t('assignTaskPage.selectAllStudentsInGrade', { grade: selectedGrade === 'all' ? t('assignTaskPage.allGrades') : selectedGrade })}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator className="bg-slate-500" />
                    {filteredStudents.map(student => (
                      <DropdownMenuCheckboxItem
                        key={student.id}
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                        className="hover:bg-slate-600 focus:bg-slate-600"
                      >
                        {student.full_name} ({student.email})
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                ) : (
                  <DropdownMenuItem disabled className="text-slate-400">{t('assignTaskPage.noStudentsInThisGrade')}</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {noStudentsAvailable && (
            <div className="flex items-center p-3 text-sm text-yellow-300 bg-yellow-700/30 rounded-md border border-yellow-600">
              <Info size={18} className="mr-2 shrink-0" />
              <p>{t('assignTaskPage.noStudentsFoundDescTooltip')}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || selectedStudentIds.length === 0 || noStudentsAvailable} 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 disabled:opacity-70 disabled:cursor-not-allowed"
            title={noStudentsAvailable ? t('assignTaskPage.noStudentsFoundDescTooltip') : (selectedStudentIds.length === 0 ? t('assignTaskPage.selectAtLeastOneStudentTooltip') : '')}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send size={18} className="mr-2" />}
            {t('assignTaskPage.assignTaskButton')}
          </Button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default AssignTaskPage;