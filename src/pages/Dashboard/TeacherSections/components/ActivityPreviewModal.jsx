import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, Send, ListChecks, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ActivityCard from './ActivityCard';

const ActivityPreviewModal = ({ 
  isOpen, 
  onOpenChange, 
  studentName, 
  activities: initialActivities, 
  isLoading, 
  onSave, 
  onSend,
  isSingleEditMode = false
}) => {
  const { t } = useLanguage();
  const [editableActivities, setEditableActivities] = useState([]);

  useEffect(() => {
    if (initialActivities) {
      // Ensure activities have a unique temporary ID if they don't have a real one yet
      setEditableActivities(initialActivities.map((act, index) => ({ ...act, tempId: act.id || `temp-${index}-${Date.now()}` })));
    }
  }, [initialActivities]);

  const handleActivityUpdate = (updatedActivity) => {
    setEditableActivities(prev => 
      prev.map(act => act.tempId === updatedActivity.tempId ? updatedActivity : act)
    );
  };
  
  const handleActivityRemove = (activityIdToRemove) => {
     setEditableActivities(prev => prev.filter(act => act.tempId !== activityIdToRemove));
  };

  const handleSaveAll = () => {
    if (isSingleEditMode && editableActivities.length === 1) {
        onSave(editableActivities[0]); // Pass single activity object for single edit
    } else {
        onSave(editableActivities); // Pass array for multiple
    }
  };

  const handleSendAll = () => {
     if (isSingleEditMode && editableActivities.length === 1) {
        onSend(editableActivities[0]); 
    } else {
        onSend(editableActivities);
    }
  };
  
  const title = isSingleEditMode 
    ? t('teacherDashboard.editActivityTitle', { studentName })
    : t('teacherDashboard.activityPreviewTitle', { studentName });

  const description = isSingleEditMode
    ? t('teacherDashboard.editActivityDescription')
    : t('teacherDashboard.activityPreviewDescription');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-4xl lg:max-w-5xl bg-slate-900/95 backdrop-blur-md border-slate-700 text-slate-100 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-500">
            <ListChecks size={28} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-4" />
              <p className="text-slate-300">{t('teacherDashboard.loadingActivities')}</p>
            </div>
          ) : editableActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
              <AlertTriangle size={40} className="text-amber-400 mb-3" />
              <p className="text-slate-300 font-semibold">{t('teacherDashboard.noActivitiesGenerated')}</p>
              <p className="text-xs text-slate-400">{t('teacherDashboard.tryGeneratingAgain')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {editableActivities.map(activity => (
                <ActivityCard 
                  key={activity.tempId} 
                  activity={activity} 
                  onUpdate={handleActivityUpdate}
                  onRemove={!isSingleEditMode ? handleActivityRemove : undefined} // Only allow remove if not single edit
                  isEditable={true}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {!isLoading && editableActivities.length > 0 && (
          <DialogFooter className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700">
              {t('common.cancelButton')}
            </Button>
            <Button onClick={handleSaveAll} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Save size={18} className="mr-2" />
              {isLoading ? t('common.saving') : t('common.saveChangesButton')}
            </Button>
            <Button onClick={handleSendAll} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
              <Send size={18} className="mr-2" />
              {isLoading ? t('teacherDashboard.sendingActivities') : t('teacherDashboard.sendToStudentButton')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActivityPreviewModal;