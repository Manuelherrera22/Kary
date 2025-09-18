import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Edit, Zap, BookOpen, Smile, HelpCircle } from 'lucide-react';

const assignmentTypes = [
  { value: 'recurso_educativo', labelKey: 'smartAssignment.typeResource', icon: BookOpen },
  { value: 'plan_apoyo', labelKey: 'smartAssignment.typeSupportPlan', icon: Package },
  { value: 'actividad_emocional', labelKey: 'smartAssignment.typeEmotionalActivity', icon: Smile },
  { value: 'indicador_personalizado', labelKey: 'smartAssignment.typeCustomIndicator', icon: Zap },
  { value: 'otro', labelKey: 'smartAssignment.typeOther', icon: HelpCircle },
];

const AssignmentTypeStep = ({ assignmentData, updateAssignmentData }) => {
  const { t } = useLanguage();

  const handleTypeChange = (value) => {
    updateAssignmentData({ type: value, customTitle: value === 'otro' ? assignmentData.customTitle : '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="assignment-type" className="text-lg font-semibold text-purple-300 mb-2 block">
          {t('smartAssignment.selectAssignmentTypeLabel')}
        </Label>
        <Select value={assignmentData.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="assignment-type" className="w-full text-base py-3 bg-slate-800 border-slate-700 hover:border-purple-500 focus:ring-purple-500">
            <SelectValue placeholder={t('smartAssignment.selectAssignmentTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
            {assignmentTypes.map(type => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.value} value={type.value} className="hover:bg-purple-700/30 focus:bg-purple-700/40 text-base py-2.5">
                  <div className="flex items-center">
                    <Icon size={20} className="mr-3 text-purple-400" />
                    {t(type.labelKey)}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {assignmentData.type === 'otro' && (
        <div className="space-y-2 animate-fadeIn">
          <Label htmlFor="custom-title" className="text-lg font-semibold text-purple-300 mb-1 block">
            <Edit size={18} className="inline mr-2 text-purple-400" /> {t('smartAssignment.customTitleLabel')}
          </Label>
          <Input
            id="custom-title"
            value={assignmentData.customTitle}
            onChange={(e) => updateAssignmentData({ customTitle: e.target.value })}
            placeholder={t('smartAssignment.customTitlePlaceholder')}
            className="text-base py-3 bg-slate-800 border-slate-700 hover:border-purple-500 focus:ring-purple-500"
          />
        </div>
      )}
    </div>
  );
};

export default AssignmentTypeStep;