import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, BookOpen, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AsignarRecursoModal from '@/pages/Dashboard/PsychopedagogueSections/components/AsignarRecursoModal';

const StudentList = ({ onOpenSupportPlanModal }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, email, grade, status, admission_date')
          .eq('role', 'student')
          .eq('status', 'active')
          .order('full_name', { ascending: true });

        if (error) throw error;
        setStudents(data || []);
        setFilteredStudents(data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('studentList.errorFetchingStudents'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [t, toast]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleAssignmentSuccess = () => {
    toast({
      title: t('toast.successTitle'),
      description: t('psychopedagogueDashboard.assignmentSuccessToast'),
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/70 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-400 flex items-center">
            <Users className="mr-3" />
            {t('psychopedagogueDashboard.tabs.students')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                <div className="h-6 w-3/4 bg-slate-600 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/70 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-2xl text-amber-400 flex items-center">
          <Users className="mr-3" />
          {t('psychopedagogueDashboard.tabs.students')}
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder={t('dashboards.psychopedagogueDashboard.studentList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="mx-auto h-12 w-12 mb-4 text-slate-500" />
            <p className="text-lg">{searchTerm ? t('studentList.noStudentsFoundForSearch') : t('dashboards.psychopedagogueDashboard.studentList.noStudents')}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{student.full_name}</h3>
                    <p className="text-slate-400 text-sm">{student.email}</p>
                    {student.grade && (
                      <p className="text-slate-300 text-sm">{t('studentList.grade')}: {student.grade}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/dashboard/student/${student.id}/profile`}>
                    <Button size="sm" variant="outline" className="text-sky-300 border-sky-500 hover:bg-sky-500/20">
                      <Eye size={14} className="mr-1" />
                      {t('dashboards.psychopedagogueDashboard.studentList.viewProfile')}
                    </Button>
                  </Link>
                  
                  <AsignarRecursoModal 
                    onAssignmentSuccess={handleAssignmentSuccess}
                    preselectedStudentId={student.id}
                    preselectedStudentName={student.full_name}
                  >
                    <Button size="sm" variant="outline" className="text-green-300 border-green-500 hover:bg-green-500/20">
                      <BookOpen size={14} className="mr-1" />
                      {t('dashboards.psychopedagogueDashboard.studentList.assignResource')}
                    </Button>
                  </AsignarRecursoModal>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onOpenSupportPlanModal && onOpenSupportPlanModal(student)}
                    className="text-purple-300 border-purple-500 hover:bg-purple-500/20"
                  >
                    <UserPlus size={14} className="mr-1" />
                    {t('supportPlans.createPlan')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;