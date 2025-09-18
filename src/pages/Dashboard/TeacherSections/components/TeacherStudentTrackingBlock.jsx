import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Info, BarChart3, Edit3, Eye, Filter, User, CalendarDays, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeacherStudentTrackingBlock = ({ teacherId, onEditActivity }) => {
  const { t, currentLocale } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAssigned');
    try {
      return format(new Date(dateString), 'PPP p', { locale: currentLocale === 'es' ? es : undefined });
    } catch (error) {
      return dateString;
    }
  };

  const fetchStudentsForTeacher = useCallback(async () => {
    if (!teacherId) return;
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('teacher_student_assignments')
        .select('student_id, student:user_profiles!inner(id, full_name)')
        .eq('teacher_id', teacherId);

      if (assignmentsError) throw assignmentsError;
      
      const uniqueStudents = assignments.reduce((acc, current) => {
        if (current.student && !acc.find(item => item.id === current.student.id)) {
          acc.push(current.student);
        }
        return acc;
      }, []);
      setStudents(uniqueStudents);

    } catch (error) {
      console.error("Error fetching students for teacher:", error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.studentTracking.errorFetchingStudents'), variant: 'destructive' });
    }
  }, [teacherId, t]);

  const fetchStudentActivities = useCallback(async () => {
    if (!teacherId) return;
    setIsLoading(true);
    try {
      let query = supabase
        .from('student_activities')
        .select('*, student:user_profiles!student_id(id, full_name, email), plan:support_plans!support_plan_id(support_goal)')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (selectedStudent) {
        query = query.eq('student_id', selectedStudent);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching student activities:", error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.studentTracking.errorFetchingActivities'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, selectedStudent, t]);

  useEffect(() => {
    fetchStudentsForTeacher();
  }, [fetchStudentsForTeacher]);
  
  useEffect(() => {
    fetchStudentActivities();
  }, [fetchStudentActivities]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_approval': return <Badge variant="outline" className="border-yellow-500/70 text-yellow-400 bg-yellow-500/10"><Clock size={12} className="mr-1"/>{t('teacherDashboard.studentTracking.statusPendingApproval')}</Badge>;
      case 'sent_to_student': return <Badge variant="outline" className="border-sky-500/70 text-sky-400 bg-sky-500/10"><Send size={12} className="mr-1"/>{t('teacherDashboard.studentTracking.statusSent')}</Badge>;
      case 'in_progress': return <Badge variant="outline" className="border-blue-500/70 text-blue-400 bg-blue-500/10"><Loader2 size={12} className="mr-1 animate-spin"/>{t('teacherDashboard.studentTracking.statusInProgress')}</Badge>;
      case 'completed': return <Badge variant="outline" className="border-green-500/70 text-green-400 bg-green-500/10"><CheckCircle size={12} className="mr-1"/>{t('teacherDashboard.studentTracking.statusCompleted')}</Badge>;
      case 'discarded': return <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/40"><XCircle size={12} className="mr-1"/>{t('teacherDashboard.studentTracking.statusDiscarded')}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/80 border-slate-700 shadow-2xl h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-emerald-400 flex items-center text-2xl">
            <BarChart3 size={28} className="mr-3" />
            {t('teacherDashboard.studentTracking.title')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-slate-400" />
            <Select value={selectedStudent || ''} onValueChange={(value) => setSelectedStudent(value === 'all' ? null : value)}>
              <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-slate-200 focus:ring-emerald-500">
                <SelectValue placeholder={t('teacherDashboard.studentTracking.filterByStudent')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectItem value="all" className="hover:bg-slate-700 focus:bg-slate-700">{t('teacherDashboard.studentTracking.allStudents')}</SelectItem>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id} className="hover:bg-slate-700 focus:bg-slate-700">{student.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-slate-300 pt-1">{t('teacherDashboard.studentTracking.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[calc(100vh-400px)]">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-400px)] text-slate-400">
            <Info size={48} className="mb-4 text-slate-500" />
            <p className="text-lg">{selectedStudent ? t('teacherDashboard.studentTracking.noActivitiesForStudent') : t('teacherDashboard.studentTracking.noActivitiesFound')}</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-380px)] p-6 pt-0">
            <div className="space-y-4">
              {activities.map(activity => (
                <Card key={activity.id} className="bg-slate-700/40 border-slate-600 hover:shadow-emerald-500/10 transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-slate-100">{activity.title}</CardTitle>
                      {getStatusBadge(activity.status)}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-4">
                      <span className="flex items-center"><User size={12} className="mr-1"/> {activity.student?.full_name || t('common.unknownStudent')}</span>
                      <span className="flex items-center"><CalendarDays size={12} className="mr-1"/> {t('teacherDashboard.common.dueDate')}: {formatDate(activity.due_date)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">{activity.description}</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEditActivity(activity, activity.student)} className="border-sky-500/70 text-sky-400 hover:bg-sky-500/10">
                        <Edit3 size={16} className="mr-1.5" /> {t('teacherDashboard.generatedActivities.edit')}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: t('common.featureUnavailableTitle'), description: t('common.featureUnavailableMessage')})} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700">
                        <Eye size={16} className="mr-1.5" /> {t('teacherDashboard.studentTracking.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <div className="p-6 border-t border-slate-700">
        <Button onClick={() => toast({ title: t('common.featureUnavailableTitle'), description: t('common.featureUnavailableMessage')})} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
          {t('teacherDashboard.studentTracking.seeHistory')}
        </Button>
      </div>
    </Card>
  );
};

export default TeacherStudentTrackingBlock;