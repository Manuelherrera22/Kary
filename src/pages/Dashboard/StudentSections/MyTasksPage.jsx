import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, ListTodo, Calendar, Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import mockTaskService from '@/services/mockTaskService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; 
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';
import StudentLayout from '@/components/StudentLayout';

const MyTasksPage = () => {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useMockAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = language === 'es' ? es : undefined;

  useEffect(() => {
    const fetchTasks = async () => {
      if (authLoading || !user) {
        setIsLoading(true);
        return;
      }
      setIsLoading(true);
      try {
        const data = await mockTaskService.getStudentTasks(user.id);
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('studentDashboard.myTasks.errorFetching'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [user, authLoading, t, toast]);

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!user) return;
    try {
      const data = await mockTaskService.updateTaskStatus(taskId, !currentStatus);
      
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? data : task)
      );
      toast({
        title: t('toast.successTitle'),
        description: t(currentStatus ? 'studentDashboard.myTasks.markedAsIncomplete' : 'studentDashboard.myTasks.markedAsComplete'),
        className: "bg-green-500 text-white dark:bg-green-600"
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.myTasks.errorUpdatingStatus'),
        variant: 'destructive',
      });
    }
  };
  
  const formatDateSafe = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'PPP', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date format for formatDateSafe: ${dateString}`);
      return t('common.invalidDate');
    }
  };

  const handleAddTask = async () => {
    if(!user) {
      toast({ title: t('toast.errorTitle'), description: t('common.mustBeLoggedIn'), variant: 'destructive' });
      return;
    }
    
    const newTask = {
      user_id: user.id, 
      title: t('studentDashboard.myTasks.newTaskDefaultTitle'),
      description: t('studentDashboard.myTasks.newTaskDefaultDesc'),
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], 
      completed: false,
    };

    try {
      const data = await mockTaskService.createTask(newTask);

      setTasks(prevTasks => [data, ...prevTasks]);
      toast({
        title: t('toast.successTitle'),
        description: t('studentDashboard.myTasks.taskAddedSuccess'),
        className: "bg-green-500 text-white dark:bg-green-600"
      });

    } catch (error) {
      console.error('Error adding new task:', error);
       toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.myTasks.addTaskError'),
        variant: 'destructive',
      });
    }
  };


  if (authLoading && isLoading) {
    return (
      <MagicBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
        </div>
      </MagicBackground>
    );
  }

  return (
    <StudentLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-all duration-200 group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToDashboard')}
            </Link>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ListTodo size={32} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {t('studentDashboard.myTasks.pageTitle')}
                    </h1>
                    <p className="text-white/90 text-lg">
                      {t('studentDashboard.myTasks.pageSubtitle')}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleAddTask}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105"
                >
                  <PlusCircle size={20} className="mr-2" />
                  {t('studentDashboard.myTasks.addTaskButton')}
                </Button>
              </div>
            </div>
          </div>


          {/* Tasks Section */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-violet-400 mx-auto mb-4" />
                <p className="text-slate-300 text-lg">{t('common.loadingData')}</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-slate-700/50 text-center">
              <div className="p-6 bg-violet-500/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <AlertTriangle size={48} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-200 mb-4">{t('studentDashboard.myTasks.noTasksTitle')}</h2>
              <p className="text-slate-400 text-lg mb-6">{t('studentDashboard.myTasks.noTasksSubtitle')}</p>
              <Button 
                onClick={handleAddTask}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <PlusCircle size={20} className="mr-2" />
                {t('studentDashboard.myTasks.addTaskButton')}
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-3xl shadow-2xl border transition-all duration-300 hover:shadow-3xl hover:scale-[1.02]
                    ${task.completed 
                      ? 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50' 
                      : 'bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 border-slate-700/50 hover:border-violet-500/50 hover:shadow-violet-500/20'
                    }`}
                >
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 opacity-5 ${task.completed ? 'bg-emerald-500' : 'bg-violet-500'}`} 
                       style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  
                  <div className="relative p-8">
                    <div className="flex items-start gap-6">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-2">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                          className={`h-7 w-7 rounded-xl border-2 transition-all duration-200 hover:scale-110 shadow-lg
                            ${task.completed 
                              ? 'border-emerald-400 data-[state=checked]:bg-emerald-500 text-white shadow-emerald-500/30' 
                              : 'border-slate-500 data-[state=checked]:bg-violet-500 text-white hover:border-violet-400 shadow-slate-500/20'
                            }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <label 
                          htmlFor={`task-${task.id}`} 
                          className={`block font-bold text-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] leading-tight ${
                            task.completed 
                              ? 'line-through text-slate-400' 
                              : 'text-slate-100 group-hover:text-violet-200'
                          }`}
                        >
                          {task.title}
                        </label>
                        
                        {task.description && (
                          <p className={`text-base mt-3 leading-relaxed ${
                            task.completed ? 'text-slate-500' : 'text-slate-300'
                          }`}>
                            {task.description}
                          </p>
                        )}

                        {task.due_date && (
                          <div className={`mt-4 flex items-center gap-3 ${
                            task.completed ? 'text-slate-500' : 'text-violet-300'
                          }`}>
                            <div className="p-2 bg-slate-700/50 rounded-lg">
                              <Calendar size={18} className="flex-shrink-0" />
                            </div>
                            <div>
                              <div className="text-sm text-slate-500 font-medium">
                                {t('studentDashboard.myTasks.dueDate')}
                              </div>
                              <div className="text-sm font-semibold">
                                {formatDateSafe(task.due_date)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <div className={`px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all duration-200 ${
                          task.completed 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 text-slate-300 border border-slate-600/50 group-hover:from-violet-500/20 group-hover:to-purple-500/20 group-hover:text-violet-300 group-hover:border-violet-500/30'
                        }`}>
                          {task.completed ? t('studentDashboard.myTasks.statusCompleted') : t('studentDashboard.myTasks.statusPending')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </StudentLayout>
  );
};

export default MyTasksPage;