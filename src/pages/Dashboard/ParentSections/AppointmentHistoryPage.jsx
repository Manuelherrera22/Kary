import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, History, CalendarDays, Clock, UserCircle, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const AppointmentHistoryPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('parent_user_id', user.id)
          .order('appointment_date', { ascending: false })
          .order('appointment_time_slot', { ascending: false });

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('appointments.errorFetchingHistory'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, t, toast]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertTriangle size={18} className="text-yellow-400" />;
      case 'confirmed': return <CheckCircle size={18} className="text-green-400" />;
      case 'cancelled': return <XCircle size={18} className="text-red-400" />;
      case 'completed': return <CheckCircle size={18} className="text-sky-400" />;
      default: return <Info size={18} className="text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <History size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.appointmentHistory.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.appointmentHistory.pageSubtitle')}</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('common.loading')}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-slate-300">{t('appointments.noHistoryFound')}</p>
              <Link to="/dashboard/schedule-appointment" className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700">
                {t('parentDashboard.scheduleAppointment.scheduleNowButton')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-sky-300">{appt.reason || t('appointments.noReasonProvided')}</h3>
                      <p className="text-sm text-slate-400 flex items-center mt-1">
                        <CalendarDays size={14} className="mr-1.5" /> {new Date(appt.appointment_date).toLocaleDateString(t('common.locale'), { year: 'numeric', month: 'long', day: 'numeric' })}
                        <Clock size={14} className="ml-3 mr-1.5" /> {appt.appointment_time_slot}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-300 capitalize">
                      {getStatusIcon(appt.status)}
                      <span>{t(`appointments.status.${appt.status}`)}</span>
                    </div>
                  </div>
                  {appt.professional_user_id && (
                     <p className="text-sm text-slate-400 flex items-center mt-2">
                       <UserCircle size={14} className="mr-1.5" /> {t('appointments.withProfessional')}: {appt.professional_user_id} 
                     </p>
                  )}
                   {appt.notes && (
                     <p className="text-sm text-slate-300 mt-2 pt-2 border-t border-slate-700">
                       <Info size={14} className="inline mr-1.5" />{t('appointments.notesLabel')}: {appt.notes}
                     </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentHistoryPage;