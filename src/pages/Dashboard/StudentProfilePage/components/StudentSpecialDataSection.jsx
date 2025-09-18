import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Edit3, CheckCircle, XCircle, Brain, MessageSquare, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const StudentSpecialDataSection = ({ studentData, studentId, canEditSpecialData, currentUserRole }) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [belongsToMeteora, setBelongsToMeteora] = useState(studentData?.special_data_meteora || false);
  const [requiresCAA, setRequiresCAA] = useState(studentData?.special_data_caa || false);
  const [softObservations, setSoftObservations] = useState(studentData?.special_data_observations || '');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveSpecialData = async () => {
    if (!softObservations && isEditing) {
        toast({
            title: t('toast.warningTitle'),
            description: t('studentProfilePage.specialData.observationsRequired'),
            variant: "default"
        });
        return;
    }

    try {
      const updateData = {
        special_data_meteora: belongsToMeteora,
        special_data_caa: requiresCAA,
        special_data_observations: softObservations,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', studentId);

      if (error) throw error;

      setIsEditing(false);
      toast({ title: t('toast.successTitle'), description: t('studentProfilePage.specialData.updateSuccess'), className: "bg-green-500 dark:bg-green-700 text-white" });
    } catch (error) {
      console.error("Error saving special data:", error);
      toast({ title: t('toast.errorTitle'), description: t('studentProfilePage.specialData.updateError'), variant: 'destructive' });
    }
  };

  const handleCancelEdit = () => {
    setBelongsToMeteora(studentData?.special_data_meteora || false);
    setRequiresCAA(studentData?.special_data_caa || false);
    setSoftObservations(studentData?.special_data_observations || '');
    setIsEditing(false);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/60 border-slate-700/70 text-white shadow-xl hover:shadow-teal-500/10 transition-shadow duration-300">
        <CardHeader className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mic size={28} className="mr-3 text-teal-400" />
              <div>
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  {t('studentProfilePage.specialData.title')}
                </CardTitle>
                <CardDescription className="text-slate-400">{t('studentProfilePage.specialData.description')}</CardDescription>
              </div>
            </div>
            {canEditSpecialData && !isEditing && (
              <Button variant="outline" onClick={handleEditToggle} className="text-teal-300 border-teal-500 hover:bg-teal-500/20">
                <Edit3 size={16} className="mr-2" /> {t('common.editButton')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${belongsToMeteora ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-700/40 border-slate-600/50'} border`}>
              <div className="flex items-center justify-between mb-2">
                <Label className={`text-lg font-semibold ${belongsToMeteora ? 'text-yellow-300' : 'text-slate-300'} flex items-center`}>
                  <Brain size={20} className={`mr-2 ${belongsToMeteora ? 'text-yellow-400' : 'text-slate-400'}`} /> {t('studentProfilePage.specialData.meteoraLabel')}
                </Label>
                {isEditing && canEditSpecialData ? (
                  <Switch
                    checked={belongsToMeteora}
                    onCheckedChange={setBelongsToMeteora}
                    className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-slate-600"
                  />
                ) : (
                   <span className={`font-bold text-xl ${belongsToMeteora ? 'text-yellow-400' : 'text-slate-400'}`}>
                     {belongsToMeteora ? t('common.yes') : t('common.no')}
                   </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{t('studentProfilePage.specialData.meteoraDescription')}</p>
            </div>

            <div className={`p-4 rounded-lg ${requiresCAA ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-700/40 border-slate-600/50'} border`}>
              <div className="flex items-center justify-between mb-2">
                <Label className={`text-lg font-semibold ${requiresCAA ? 'text-cyan-300' : 'text-slate-300'} flex items-center`}>
                  <MessageSquare size={20} className={`mr-2 ${requiresCAA ? 'text-cyan-400' : 'text-slate-400'}`} /> {t('studentProfilePage.specialData.caaLabel')}
                </Label>
                 {isEditing && canEditSpecialData ? (
                  <Switch
                    checked={requiresCAA}
                    onCheckedChange={setRequiresCAA}
                    className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-slate-600"
                  />
                ) : (
                   <span className={`font-bold text-xl ${requiresCAA ? 'text-cyan-400' : 'text-slate-400'}`}>
                     {requiresCAA ? t('common.yes') : t('common.no')}
                   </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{t('studentProfilePage.specialData.caaDescription')}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="softObservations" className="text-lg font-semibold text-teal-200 flex items-center mb-2">
                <Info size={20} className="mr-2" />{t('studentProfilePage.specialData.softObservationsLabel')}
            </Label>
            {isEditing && canEditSpecialData ? (
              <Textarea
                id="softObservations"
                value={softObservations}
                onChange={(e) => setSoftObservations(e.target.value)}
                placeholder={t('studentProfilePage.specialData.softObservationsPlaceholder')}
                rows={5}
                className="bg-slate-700 border-slate-600 text-white focus:ring-teal-500"
              />
            ) : (
              <p className="text-slate-300 p-3 bg-slate-700/50 rounded-md min-h-[100px] whitespace-pre-wrap">
                {softObservations || t('studentProfilePage.specialData.softObservationsPlaceholder')}
              </p>
            )}
          </div>

          {isEditing && canEditSpecialData && (
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
              <Button variant="outline" onClick={handleCancelEdit} className="text-slate-300 border-slate-500 hover:bg-slate-600">
                <XCircle size={18} className="mr-2" /> {t('common.cancelButton')}
              </Button>
              <Button onClick={handleSaveSpecialData} className="bg-teal-600 hover:bg-teal-700">
                <CheckCircle size={18} className="mr-2" /> {t('common.saveChangesButton')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentSpecialDataSection;