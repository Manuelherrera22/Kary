import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Smile, Meh, Frown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const EmotionOption = ({ icon: Icon, label, value, selected, onSelect, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onSelect(value)}
    className={cn(
      'flex flex-col items-center justify-center p-4 space-y-2 rounded-2xl cursor-pointer transition-all duration-300 border-2',
      selected ? 'shadow-lg' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500',
      selected && color === 'green' && 'bg-green-500/20 border-green-400',
      selected && color === 'yellow' && 'bg-yellow-500/20 border-yellow-400',
      selected && color === 'red' && 'bg-red-500/20 border-red-400'
    )}
  >
    <Icon size={48} className={cn(
      'transition-colors',
      selected ? 'text-white' : 'text-slate-400',
      selected && color === 'green' && 'text-green-300',
      selected && color === 'yellow' && 'text-yellow-300',
      selected && color === 'red' && 'text-red-300'
    )} />
    <span className={cn(
      'font-medium transition-colors',
      selected ? 'text-white' : 'text-slate-300'
    )}>{label}</span>
  </motion.div>
);

const AttendanceForm = ({ selectedEmotion, setSelectedEmotion, comments, setComments, isSubmitting, onRegister }) => {
  const { t } = useLanguage();

  const emotionOptions = [
    { value: 'feliz', label: t('emotionalAttendance.emotions.happy'), icon: Smile, color: 'green' },
    { value: 'neutral', label: t('emotionalAttendance.emotions.neutral'), icon: Meh, color: 'yellow' },
    { value: 'triste', label: t('emotionalAttendance.emotions.sad'), icon: Frown, color: 'red' },
  ];

  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700 shadow-2xl mb-6">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-200">
          {t('emotionalAttendance.formTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-slate-300 text-base mb-3 block text-center">
            {t('emotionalAttendance.emotionQuestion')}
          </Label>
          <div className="grid grid-cols-3 gap-4">
            {emotionOptions.map(opt => (
              <EmotionOption
                key={opt.value}
                {...opt}
                selected={selectedEmotion === opt.value}
                onSelect={setSelectedEmotion}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comments" className="text-slate-300 text-base mb-1 block">
            {t('emotionalAttendance.commentsLabel')}
          </Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder={t('emotionalAttendance.commentsPlaceholder')}
            className="bg-slate-700 border-slate-600 text-white focus:ring-emerald-500 min-h-[100px] text-base"
            rows={3}
          />
        </div>

        <Button
          onClick={onRegister}
          disabled={isSubmitting || !selectedEmotion}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-semibold py-3 text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {isSubmitting ? t('common.submitting') : t('emotionalAttendance.submitButton')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;