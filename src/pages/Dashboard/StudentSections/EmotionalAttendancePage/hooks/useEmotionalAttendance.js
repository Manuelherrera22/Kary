import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import mockEmotionalAttendanceService from '@/services/mockEmotionalAttendanceService';

export const useEmotionalAttendance = (studentId) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCounseling, setShowCounseling] = useState(false);

  const checkCounselingSuggestion = useCallback(async () => {
    if (!studentId) return;
    try {
      const { data, error } = await mockEmotionalAttendanceService.checkCounselingSuggestion(studentId);

      if (error) throw error;

      setShowCounseling(data);
    } catch (error) {
      console.error('Error checking counseling suggestion:', error);
    }
  }, [studentId]);

  useEffect(() => {
    checkCounselingSuggestion();
  }, [checkCounselingSuggestion]);

  const handleRegister = async () => {
    if (!studentId || !selectedEmotion) {
      toast({
        title: t('toasts.errorTitle'),
        description: t('emotionalAttendance.errors.selectEmotion'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await mockEmotionalAttendanceService.registerEmotionalAttendance(
        studentId,
        selectedEmotion,
        comments
      );

      if (error) throw error;

      toast({
        title: t('toasts.successTitle'),
        description: t('emotionalAttendance.successMessage'),
        className: 'bg-green-500 text-white dark:bg-green-600',
      });
      
      // Reset form
      setSelectedEmotion('');
      setComments('');
      
      // Re-check for counseling suggestion after new registration
      await checkCounselingSuggestion();

    } catch (error) {
      console.error('Error registering attendance:', error);
      toast({
        title: t('toasts.errorTitle'),
        description: t('emotionalAttendance.errors.submitError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedEmotion,
    setSelectedEmotion,
    comments,
    setComments,
    isSubmitting,
    showCounseling,
    handleRegister,
  };
};