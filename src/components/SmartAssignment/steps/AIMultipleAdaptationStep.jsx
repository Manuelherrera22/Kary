import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Eye, CheckSquare } from 'lucide-react';

const AIMultipleAdaptationStep = ({ assignmentData, updateAssignmentData }) => {
  const { t } = useLanguage();

  const showThisStep = assignmentData.selectedStudents.length > 1;

  if (!showThisStep) {
    return (
      <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-xl">
        <p className="text-slate-400 text-center">{t('smartAssignment.aiMultipleSkipCondition')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-800/70 border border-purple-700/50 rounded-xl shadow-lg">
        <Label className="text-xl font-semibold text-purple-300 mb-4 block flex items-center">
          <Users size={24} className="mr-2 text-yellow-400" />
          {t('smartAssignment.aiMultipleTitle')}
        </Label>
        <p className="text-slate-300 mb-6">
          {t('smartAssignment.aiMultipleDescription', { count: assignmentData.selectedStudents.length })}
        </p>
        <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-md">
          <Switch
            id="adapt-for-each"
            checked={assignmentData.adaptForEachStudent}
            onCheckedChange={(checked) => updateAssignmentData({ adaptForEachStudent: checked })}
            className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-600"
          />
          <Label htmlFor="adapt-for-each" className="text-slate-200 text-base">
            {t('smartAssignment.aiMultipleToggleLabel')}
          </Label>
        </div>
      </div>

      {assignmentData.adaptForEachStudent && (
        <div className="animate-fadeIn space-y-4">
          <p className="text-slate-400">{t('smartAssignment.aiMultipleReviewPrompt')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 text-sky-300 border-sky-500 hover:bg-sky-500/20 hover:text-sky-200 py-3 text-base">
              <Eye size={18} className="mr-2" /> {t('smartAssignment.aiMultipleViewAllButton')}
            </Button>
            <Button variant="outline" className="flex-1 text-green-400 border-green-500 hover:bg-green-500/20 hover:text-green-300 py-3 text-base">
              <CheckSquare size={18} className="mr-2" /> {t('smartAssignment.aiMultipleAssignDirectlyButton')}
            </Button>
          </div>
           <p className="text-xs text-slate-500">{t('smartAssignment.aiMultipleViewAllNote')}</p>
        </div>
      )}
    </div>
  );
};

export default AIMultipleAdaptationStep;