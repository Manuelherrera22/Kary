import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Edit, RefreshCw, FileText } from 'lucide-react';
import { getAISuggestion } from '@/services/geminiDashboardService';
import piarService from '@/services/piarService';

const AIContentSuggestionStep = ({ assignmentData, updateAssignmentData }) => {
  const { t } = useLanguage();
  const [editingSuggestion, setEditingSuggestion] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Generar sugerencia de IA basada en PIAR y planes de apoyo
  const generateAISuggestion = async () => {
    if (assignmentData.selectedStudents.length === 0) return;
    
    setIsGenerating(true);
    try {
      const context = {
        assignmentType: assignmentData.type,
        customTitle: assignmentData.customTitle,
        students: assignmentData.selectedStudents.map(s => ({
          name: s.full_name,
          grade: s.grade,
          diagnostic: s.diagnostic_summary
        })),
        needs: assignmentData.selectedStudents.map(s => s.diagnostic_summary).filter(Boolean)
      };

      // Obtener datos de PIAR para el primer estudiante (o combinados si son múltiples)
      const piarData = assignmentData.selectedStudents.map(student => {
        const piar = piarService.getPiarByStudentId(student.id);
        return piar ? piarService.getPiarForActivityGeneration(student.id) : null;
      }).filter(Boolean);

      // Obtener plan de apoyo basado en PIAR
      const supportPlan = piarData.length > 0 ? {
        objectives: piarData[0].objectives,
        adaptations: piarData[0].adaptations,
        resources: piarData[0].resources,
        evaluation: piarData[0].evaluation
      } : null;

      const result = await getAISuggestion(context, piarData, supportPlan);
      
      if (result.success) {
        setAiSuggestion(result.data.suggestion);
        updateAssignmentData({ 
          aiEditedContent: result.data.suggestion,
          piarData: piarData,
          supportPlan: supportPlan
        });
      } else {
        console.error('Error generating AI suggestion:', result.error);
        // Fallback a sugerencia básica
        setAiSuggestion(getBasicSuggestion());
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
      setAiSuggestion(getBasicSuggestion());
    } finally {
      setIsGenerating(false);
    }
  };

  // Sugerencia básica como fallback
  const getBasicSuggestion = () => {
    if (assignmentData.selectedStudents.length > 0) {
      const studentNames = assignmentData.selectedStudents.map(s => s.full_name).join(', ');
      const firstStudentDiag = assignmentData.selectedStudents[0]?.diagnostic_summary;
      let suggestion = `Actividad educativa para: ${studentNames}\n\n`;
      if (firstStudentDiag) {
        suggestion += `Considerando las necesidades específicas: ${firstStudentDiag}\n\n`;
      }
      suggestion += `Objetivos:\n- Desarrollar habilidades específicas\n- Fomentar el aprendizaje inclusivo\n- Promover la participación activa\n\nMateriales:\n- Recursos adaptados\n- Apoyos visuales\n- Herramientas tecnológicas\n\nEvaluación:\n- Criterios adaptados\n- Observación continua\n- Retroalimentación positiva`;
      return suggestion;
    }
    return 'Selecciona estudiantes para generar una sugerencia personalizada.';
  };

  const currentContent = assignmentData.aiEditedContent || aiSuggestion || getBasicSuggestion();

  const handleUseSuggestion = () => {
    updateAssignmentData({ aiSuggestionUsed: true, aiEditedContent: currentContent });
    setEditingSuggestion(false); 
  };

  const handleEditSuggestion = () => {
    setEditingSuggestion(true);
    // Initialize aiEditedContent if it's not already set
    if (!assignmentData.aiEditedContent) {
      updateAssignmentData({ aiEditedContent: currentContent });
    }
  };

  // Generar sugerencia automáticamente cuando se seleccionan estudiantes
  React.useEffect(() => {
    if (assignmentData.selectedStudents.length > 0 && !aiSuggestion && !assignmentData.aiEditedContent) {
      generateAISuggestion();
    }
  }, [assignmentData.selectedStudents]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-800/70 border border-purple-700/50 rounded-xl shadow-lg">
        <Label className="text-xl font-semibold text-purple-300 mb-3 block flex items-center">
          <Sparkles size={24} className="mr-2 text-yellow-400 animate-pulse" />
          {t('smartAssignment.aiSuggestionTitle')}
        </Label>
        
        {/* Información de PIAR */}
        {assignmentData.selectedStudents.length > 0 && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Información de PIAR:</span>
            </div>
            <div className="text-xs text-blue-200 space-y-1">
              {assignmentData.selectedStudents.map(student => {
                const piar = piarService.getPiarByStudentId(student.id);
                return piar ? (
                  <div key={student.id} className="flex items-center gap-2">
                    <span className="font-medium">{student.full_name}:</span>
                    <span>{piar.diagnostic}</span>
                    <span className="text-blue-300">•</span>
                    <span>{piar.objectives.shortTerm.length} objetivos a corto plazo</span>
                  </div>
                ) : (
                  <div key={student.id} className="flex items-center gap-2">
                    <span className="font-medium">{student.full_name}:</span>
                    <span className="text-yellow-400">Sin PIAR registrado</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {!editingSuggestion ? (
          <p className="text-slate-300 whitespace-pre-wrap min-h-[100px]">
            {currentContent}
          </p>
        ) : (
          <Textarea
            value={assignmentData.aiEditedContent}
            onChange={(e) => updateAssignmentData({ aiEditedContent: e.target.value })}
            rows={5}
            className="bg-slate-700 border-slate-600 text-slate-100 focus:ring-purple-500 min-h-[120px]"
            placeholder={t('smartAssignment.aiEditPlaceholder')}
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={generateAISuggestion}
          disabled={isGenerating || assignmentData.selectedStudents.length === 0}
          variant="outline" 
          className="flex-1 text-yellow-300 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-200 py-3 text-base"
        >
          <RefreshCw size={18} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} /> 
          {isGenerating ? 'Generando...' : 'Generar nueva sugerencia'}
        </Button>
        <Button onClick={handleUseSuggestion} variant="outline" className="flex-1 text-purple-300 border-purple-500 hover:bg-purple-500/20 hover:text-purple-200 py-3 text-base">
          <Sparkles size={18} className="mr-2" /> {t('smartAssignment.aiUseSuggestionButton')}
        </Button>
        <Button onClick={handleEditSuggestion} variant="outline" className="flex-1 text-sky-300 border-sky-500 hover:bg-sky-500/20 hover:text-sky-200 py-3 text-base">
          <Edit size={18} className="mr-2" /> {t('smartAssignment.aiEditSuggestionButton')}
        </Button>
      </div>
      {assignmentData.aiSuggestionUsed && !editingSuggestion && (
         <p className="text-sm text-green-400 flex items-center"><Sparkles size={14} className="mr-1" />{t('smartAssignment.aiSuggestionAccepted')}</p>
      )}
       {editingSuggestion && (
         <p className="text-sm text-sky-400 flex items-center"><Edit size={14} className="mr-1" />{t('smartAssignment.aiEditingSuggestion')}</p>
      )}
    </div>
  );
};

export default AIContentSuggestionStep;