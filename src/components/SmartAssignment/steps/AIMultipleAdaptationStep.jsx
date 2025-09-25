import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Eye, CheckSquare, Sparkles, Download, FileText } from 'lucide-react';
import { generateAdaptedActivity } from '@/services/geminiDashboardService';
import piarService from '@/services/piarService';

const AIMultipleAdaptationStep = ({ assignmentData, updateAssignmentData }) => {
  const { t } = useLanguage();
  const [adaptations, setAdaptations] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdaptations, setShowAdaptations] = useState(false);

  const showThisStep = assignmentData.selectedStudents.length > 1;

  const handleGenerateAdaptations = async () => {
    if (!assignmentData.aiEditedContent) return;
    
    setIsGenerating(true);
    try {
      const baseActivity = {
        content: assignmentData.aiEditedContent,
        type: assignmentData.type,
        title: assignmentData.customTitle || assignmentData.type
      };
      
      // Obtener perfiles de estudiantes con datos de PIAR
      const studentProfiles = assignmentData.selectedStudents.map(student => ({
        name: student.full_name,
        grade: student.grade,
        diagnostic: student.diagnostic_summary,
        needs: student.diagnostic_summary || 'Necesidades generales'
      }));

      // Obtener datos de PIAR para cada estudiante
      const piarData = assignmentData.selectedStudents.map(student => {
        const piar = piarService.getPiarByStudentId(student.id);
        return piar ? piarService.getPiarForActivityGeneration(student.id) : null;
      }).filter(Boolean);

      // Obtener planes de apoyo (simulados por ahora)
      const supportPlans = assignmentData.selectedStudents.map(student => {
        const piar = piarService.getPiarByStudentId(student.id);
        return piar ? {
          objectives: piar.objectives,
          adaptations: piar.adaptations,
          resources: piar.resources,
          evaluation: piar.evaluation
        } : null;
      }).filter(Boolean);

      const result = await generateAdaptedActivity(baseActivity, studentProfiles, supportPlans, piarData);
      
      if (result.success) {
        setAdaptations(result.data.adaptedActivities);
        setShowAdaptations(true);
        updateAssignmentData({ 
          adaptForEachStudent: true,
          generatedAdaptations: result.data.adaptedActivities,
          piarData: piarData,
          supportPlans: supportPlans
        });
      } else {
        console.error('Error generating adaptations:', result.error);
      }
    } catch (error) {
      console.error('Error generating adaptations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
          
          {!showAdaptations ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGenerateAdaptations}
                disabled={isGenerating || !assignmentData.aiEditedContent}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 text-base"
              >
                <Sparkles size={18} className="mr-2" /> 
                {isGenerating ? 'Generando adaptaciones...' : 'Generar adaptaciones con IA'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Label className="text-lg font-semibold text-green-300 mb-2 block">
                  Adaptaciones generadas para {assignmentData.selectedStudents.length} estudiantes:
                </Label>
                <Textarea
                  value={adaptations}
                  readOnly
                  rows={8}
                  className="bg-slate-800 border-slate-600 text-slate-100"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 text-sky-300 border-sky-500 hover:bg-sky-500/20 hover:text-sky-200 py-3 text-base"
                  onClick={() => setShowAdaptations(false)}
                >
                  <Eye size={18} className="mr-2" /> Editar adaptaciones
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-green-400 border-green-500 hover:bg-green-500/20 hover:text-green-300 py-3 text-base"
                >
                  <CheckSquare size={18} className="mr-2" /> Asignar directamente
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-blue-400 border-blue-500 hover:bg-blue-500/20 hover:text-blue-300 py-3 text-base"
                >
                  <Download size={18} className="mr-2" /> Exportar plan
                </Button>
              </div>
              
              <p className="text-xs text-slate-500">
                Las adaptaciones han sido generadas automáticamente por IA basándose en los perfiles de los estudiantes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIMultipleAdaptationStep;