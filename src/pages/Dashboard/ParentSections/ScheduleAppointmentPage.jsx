import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, User, Clock, MessageSquare as MessageSquareText, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';

const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

const ScheduleAppointmentPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast({ title: t('toast.errorTitle'), description: t('toast.mustBeLoggedIn'), variant: "destructive" });
      return;
    }
    if (!appointmentDate || !appointmentTimeSlot || !reason) {
      toast({ title: t('toast.errorTitle'), description: t('appointments.errorAllFieldsRequired'), variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ 
          parent_user_id: user.id, 
          appointment_date: appointmentDate, 
          appointment_time_slot: appointmentTimeSlot, 
          reason: reason,
          status: 'pending' 
        }]);

      if (error) throw error;

      toast({
        title: t('appointments.successTitle'),
        description: t('appointments.successDescription', { date: appointmentDate, time: appointmentTimeSlot }),
        className: "bg-green-500 text-white dark:bg-green-700",
      });
      setAppointmentDate('');
      setAppointmentTimeSlot('');
      setReason('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('appointments.errorScheduling'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <CalendarPlus size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('parentDashboard.scheduleAppointment.title')}</h1>
              <p className="text-slate-400">{t('parentDashboard.scheduleAppointment.pageSubtitle')}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="appointmentDate" className="text-slate-300 flex items-center mb-1">
                <CalendarPlus size={16} className="mr-2 text-sky-400" />
                {t('appointments.dateLabel')}
              </Label>
              <Input 
                type="date" 
                id="appointmentDate" 
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="appointmentTimeSlot" className="text-slate-300 flex items-center mb-1">
                <Clock size={16} className="mr-2 text-sky-400" />
                {t('appointments.timeSlotLabel')}
              </Label>
              <select 
                id="appointmentTimeSlot"
                value={appointmentTimeSlot}
                onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border-slate-600 text-white rounded-md focus:ring-sky-500 focus:border-sky-500"
                required
              >
                <option value="">{t('appointments.selectTimeSlot')}</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="reason" className="text-slate-300 flex items-center mb-1">
                <MessageSquareText size={16} className="mr-2 text-sky-400" />
                {t('appointments.reasonLabel')}
              </Label>
              <Input
                as="textarea"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('appointments.reasonPlaceholder')}
                className="min-h-[100px] bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 text-base font-semibold" disabled={isLoading}>
              {isLoading ? t('common.loading') : (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  {t('appointments.confirmButton')}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleAppointmentPage;