import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, ListTodo, Calendar, Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; 
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

const MyTasksPage = () => {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
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
        const { data, error } = await supabase
          .from('student_tasks')
          .select('*')
          .order('due_date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
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
      const { data, error } = await supabase
        .from('student_tasks')
        .update({ completed: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('student_tasks')
        .insert(newTask)
        .select()
        .single();
      
      if (error) throw error;

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
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>

          <header className="page-header">
            <h1 className="page-title bg-gradient-to-r from-violet-400 to-purple-300">
              <ListTodo size={36} className="mr-3" />
              {t('studentDashboard.myTasks.pageTitle')}
            </h1>
            <p className="page-subtitle">{t('studentDashboard.myTasks.pageSubtitle')}</p>
          </header>
          
          <div className="text-right mb-6">
              <Button 
                  variant="outline" 
                  className="text-violet-300 border-violet-500 hover:bg-violet-500/20 hover:text-violet-200"
                  onClick={handleAddTask}
              >
                  <PlusCircle size={18} className="mr-2" /> {t('studentDashboard.myTasks.addTaskButton')}
              </Button>
          </div>


          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              <p className="ml-2">{t('common.loadingData')}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-slate-700/50 text-center">
              <AlertTriangle size={48} className="text-violet-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-200 mb-2">{t('studentDashboard.myTasks.noTasksTitle')}</h2>
              <p className="text-slate-400">{t('studentDashboard.myTasks.noTasksSubtitle')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl shadow-lg border flex items-start gap-4 transition-all duration-300
                    ${task.completed 
                      ? 'bg-green-600/20 border-green-500/30 hover:border-green-500/50' 
                      : 'bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-slate-600/70'
                    }`}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                    className={`mt-1 h-5 w-5 rounded border-2 transition-colors
                      ${task.completed 
                        ? 'border-green-400 data-[state=checked]:bg-green-500 text-white' 
                        : 'border-slate-500 data-[state=checked]:bg-violet-500 text-white'
                      }`}
                  />
                  <div className="flex-grow">
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`font-semibold cursor-pointer ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                        {task.description}
                      </p>
                    )}
                    {task.due_date && (
                      <p className={`text-xs mt-2 flex items-center ${task.completed ? 'text-slate-500' : 'text-violet-300'}`}>
                        <Calendar size={14} className="mr-1" /> 
                        {t('studentDashboard.myTasks.dueDate')}: {formatDateSafe(task.due_date)}
                      </p>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium
                    ${task.completed 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {task.completed ? t('studentDashboard.myTasks.statusCompleted') : t('studentDashboard.myTasks.statusPending')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default MyTasksPage;