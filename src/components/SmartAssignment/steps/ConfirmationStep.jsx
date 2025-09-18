import React from 'react';
import { Input } from '@/components/ui/input'; // Assuming you might want DatePicker later
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Users, Calendar, Package, Sparkles, Edit, FileText } from 'lucide-react';

const ConfirmationStep = ({ assignmentData, updateAssignmentData }) => {
  const { t } = useLanguage();

  const getAssignmentTypeName = () => {
    const typeMap = {
      recurso_educativo: t('smartAssignment.typeResource'),
      plan_apoyo: t('smartAssignment.typeSupportPlan'),
      actividad_emocional: t('smartAssignment.typeEmotionalActivity'),
      indicador_personalizado: t('smartAssignment.typeCustomIndicator'),
      otro: t('smartAssignment.typeOther'),
    };
    return typeMap[assignmentData.type] || assignmentData.type;
  };

  const resourcePlanName = assignmentData.type === 'otro' 
    ? assignmentData.customTitle 
    : getAssignmentTypeName();

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-800/70 border border-purple-700/50 rounded-xl shadow-lg">
        <Label className="text-xl font-semibold text-purple-300 mb-4 block flex items-center">
          <CheckCircle size={24} className="mr-2 text-green-400" />
          {t('smartAssignment.confirmationTitle')}
        </Label>
        
        <div className="space-y-4 text-slate-300">
          <div className="flex items-start">
            <Package size={20} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">{t('smartAssignment.confirmationAssignmentName')}:</p>
              <p>{resourcePlanName || t('common.notSpecified')}</p>
            </div>
          </div>

           {assignmentData.type !== 'otro' && assignmentData.customTitle && (
             <div className="flex items-start pl-8">
               <Edit size={18} className="mr-3 mt-1 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">{t('smartAssignment.customTitleLabel')}:</p>
                  <p className="text-slate-400">{assignmentData.customTitle}</p>
                </div>
             </div>
           )}

          <div className="flex items-start">
            <Users size={20} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">{t('smartAssignment.confirmationAssignedTo')}:</p>
              {assignmentData.selectedStudents.length > 0 ? (
                <ScrollArea className="max-h-32 pr-2">
                  <ul className="list-disc list-inside ml-1 text-sm">
                    {assignmentData.selectedStudents.map(student => (
                      <li key={student.id} className="truncate" title={student.full_name}>{student.full_name}</li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p>{t('common.noneSelected')}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Sparkles size={20} className="mr-3 text-yellow-400 flex-shrink-0" />
            <p className="font-semibold text-slate-200">{t('smartAssignment.confirmationAIAdaptation')}:</p>
            <p className={`ml-2 font-medium ${assignmentData.adaptForEachStudent ? 'text-green-400' : 'text-red-400'}`}>
              {assignmentData.adaptForEachStudent ? t('common.active') : t('common.inactive')}
            </p>
          </div>

          {assignmentData.aiSuggestionUsed && (
            <div className="flex items-start">
              <FileText size={20} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">{t('smartAssignment.confirmationAIContent')}:</p>
                <p className="text-sm text-slate-400 truncate max-w-md" title={assignmentData.aiEditedContent || t('smartAssignment.aiOriginalSuggestionUsed')}>
                    {assignmentData.aiEditedContent ? t('smartAssignment.aiEditedSuggestionUsed') : t('smartAssignment.aiOriginalSuggestionUsed')}
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="due-date" className="text-slate-200 flex items-center">
              <Calendar size={18} className="mr-2 text-purple-400" />
              {t('smartAssignment.confirmationDueDate')} (Opcional):
            </Label>
            <Input
              id="due-date"
              type="date"
              value={assignmentData.dueDate || ''}
              onChange={(e) => updateAssignmentData({ dueDate: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;