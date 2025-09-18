import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, BookOpen, Calendar, MessageSquare, Eye, Edit, FileText, Loader2, UserX, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const AssignedStudentsList = ({ teacherId }) => {
  const { t, language } = useLanguage();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      if (!teacherId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('list_students_by_teacher', { teacher_id_input: teacherId });
        if (error) throw error;
        
        const studentDetailsPromises = (data || []).map(async (student) => {
          const { data: activityData, error: activityError } = await supabase
            .from('student_activities')
            .select('completed_at')
            .eq('student_id', student.student_id)
            .order('completed_at', { ascending: false })
            .limit(1)
            .single();

          const { data: observationData, error: observationError } = await supabase
            .from('observations')
            .select('created_at')
            .eq('student_id', student.student_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...student,
            id: student.student_id,
            lastActivity: activityData?.completed_at ? `${t('teacherDashboard.assignedStudentsList.completedOn', { date: formatDate(activityData.completed_at) })}` : t('teacherDashboard.assignedStudentsList.noActivity'),
            lastObservation: observationData?.created_at ? formatDate(observationData.created_at) : t('teacherDashboard.assignedStudentsList.noObservation'),
            generalStatus: student.general_status || t('teacherDashboard.assignedStudentsList.needsFollowUp'),
            showEmotionalAlert: student.emotional_alert || false,
          };
        });

        const studentsWithDetails = await Promise.all(studentDetailsPromises);
        setStudents(studentsWithDetails);

      } catch (error) {
        console.error("Error fetching assigned students:", error);
        toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingStudents'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignedStudents();
  }, [teacherId, t, language]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-pink-400" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {t('teacherDashboard.assignedStudentsList.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <UserX size={48} className="text-slate-500 mb-4" />
              <p className="text-slate-300 font-semibold">{t('teacherDashboard.noStudents')}</p>
              <p className="text-sm text-slate-400">{t('common.noDataAvailable')}</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-all duration-300 p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User size={20} className="mr-2 text-pink-300"/>
                            <h4 className="text-lg font-semibold text-slate-100">{student.full_name}</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-slate-300">
                            <p className="flex items-center"><BookOpen size={14} className="mr-2 text-sky-400"/>{t('teacherDashboard.assignedStudentsList.lastActivity')}: {student.lastActivity}</p>
                            <p className="flex items-center"><Calendar size={14} className="mr-2 text-green-400"/>{t('teacherDashboard.assignedStudentsList.lastObservation')}: {student.lastObservation}</p>
                            <p className="flex items-center"><MessageSquare size={14} className="mr-2 text-yellow-400"/>{t('teacherDashboard.assignedStudentsList.generalStatus')}: {student.generalStatus}</p>
                          </div>
                          {student.showEmotionalAlert && (
                            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
                              {t('teacherDashboard.assignedStudentsList.emotionalAlert')}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row sm:flex-col lg:flex-row gap-2 self-start sm:self-center lg:self-center shrink-0">
                          <Button variant="outline" size="sm" className="border-sky-500/70 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300">
                            <Eye size={16} className="mr-1.5" /> {t('teacherDashboard.assignedStudentsList.view')}
                          </Button>
                          <Button variant="outline" size="sm" className="border-purple-500/70 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
                            <Edit size={16} className="mr-1.5" /> {t('teacherDashboard.assignedStudentsList.addObservation')}
                          </Button>
                          <Button variant="outline" size="sm" className="border-green-500/70 text-green-400 hover:bg-green-500/20 hover:text-green-300">
                            <FileText size={16} className="mr-1.5" /> {t('teacherDashboard.assignedStudentsList.supportPlan')}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssignedStudentsList;