import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Calendar,
  Target,
  BookOpen,
  Heart,
  Users,
  Settings,
  Download,
  Save,
  Send
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import geminiDashboardService from '@/services/geminiDashboardService';

const AdvancedPiarGenerator = ({ isOpen, onOpenChange, studentId, studentData, onPiarGenerated }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPiar, setGeneratedPiar] = useState(null);
  const [progress, setProgress] = useState(0);

  // Formulario de datos del estudiante
  const [studentInfo, setStudentInfo] = useState({
    fullName: studentData?.full_name || '',
    age: studentData?.age || '',
    grade: studentData?.grade || '',
    school: studentData?.school || '',
    previousDiagnosis: studentData?.piar_institutional_diagnosis || '',
    currentArea: studentData?.piar_assigned_area || '',
    familyContext: '',
    academicHistory: '',
    behavioralObservations: '',
    emotionalState: '',
    learningStyle: '',
    interests: '',
    strengths: '',
    challenges: '',
    supportNeeds: ''
  });

  // Configuración del PIAR
  const [piarConfig, setPiarConfig] = useState({
    focusAreas: [],
    priorityLevel: 'medium',
    duration: '6 months',
    reviewFrequency: 'monthly',
    teamMembers: [],
    familyInvolvement: 'high'
  });

  const steps = [
    { id: 1, title: 'Información del Estudiante', icon: User },
    { id: 2, title: 'Análisis Contextual', icon: BookOpen },
    { id: 3, title: 'Configuración PIAR', icon: Settings },
    { id: 4, title: 'Generación con IA', icon: Brain },
    { id: 5, title: 'Revisión y Guardado', icon: CheckCircle }
  ];

  useEffect(() => {
    if (isOpen && studentData) {
      setStudentInfo({
        fullName: studentData.full_name || '',
        age: studentData.age || '',
        grade: studentData.grade || '',
        school: studentData.school || '',
        previousDiagnosis: studentData.piar_institutional_diagnosis || '',
        currentArea: studentData.piar_assigned_area || '',
        familyContext: '',
        academicHistory: '',
        behavioralObservations: '',
        emotionalState: '',
        learningStyle: '',
        interests: '',
        strengths: '',
        challenges: '',
        supportNeeds: ''
      });
      setCurrentStep(1);
      setGeneratedPiar(null);
      setProgress(0);
    }
  }, [isOpen, studentData]);

  const handleInputChange = (field, value) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (field, value) => {
    setPiarConfig(prev => ({ ...prev, [field]: value }));
  };

  const generatePiarWithAI = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep(4);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Preparar datos para Gemini
      const piarData = {
        studentInfo,
        piarConfig,
        context: {
          generatedBy: authUser?.full_name || 'Psicopedagogo',
          generatedAt: new Date().toISOString(),
          studentId: studentId
        }
      };

      // Generar PIAR con Gemini AI
      const result = await geminiDashboardService.generateSupportPlan(
        studentInfo,
        piarData,
        piarConfig
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setGeneratedPiar(result.data);
        setCurrentStep(5);
        toast({
        title: t('psychopedagogue.piar.generator.successTitle'),
        description: t('psychopedagogue.piar.generator.successMessage'),
          variant: 'default'
        });
      } else {
        throw new Error(result.error || 'Error generando PIAR');
      }

    } catch (error) {
      console.error('Error generando PIAR:', error);
      toast({
        title: t('psychopedagogue.piar.generator.errorTitle'),
        description: error.message || t('psychopedagogue.piar.generator.errorMessage'),
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePiar = async () => {
    if (!generatedPiar || !studentId) return;

    try {
      const piarData = {
        student_id: studentId,
        piar_content: generatedPiar.supportPlan,
        piar_type: piarConfig.focusAreas.join(', '),
        status: 'active',
        created_by: authUser.id,
        created_at: new Date().toISOString(),
        metadata: {
          config: piarConfig,
          studentInfo: studentInfo,
          generatedBy: 'AI'
        }
      };

      const { error } = await supabase
        .from('piar_documents')
        .insert(piarData);

      if (error) throw error;

      toast({
        title: t('psychopedagogue.piar.generator.saveSuccessTitle'),
        description: t('psychopedagogue.piar.generator.saveSuccessMessage'),
        variant: 'default'
      });

      if (onPiarGenerated) {
        onPiarGenerated(piarData);
      }

      onOpenChange(false);

    } catch (error) {
      console.error('Error guardando PIAR:', error);
      toast({
        title: t('psychopedagogue.piar.generator.saveErrorTitle'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const downloadPiar = () => {
    if (!generatedPiar) return;

    const element = document.createElement('a');
    const file = new Blob([generatedPiar.supportPlan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `PIAR_${studentInfo.fullName}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t('psychopedagogue.piar.generator.studentName')}</Label>
                <Input
                  id="fullName"
                  value={studentInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={t('psychopedagogue.piar.generator.studentNamePlaceholder')}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="age">{t('psychopedagogue.piar.generator.age')}</Label>
                <Input
                  id="age"
                  type="number"
                  value={studentInfo.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder={t('psychopedagogue.piar.generator.agePlaceholder')}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="grade">{t('psychopedagogue.piar.generator.grade')}</Label>
                <Input
                  id="grade"
                  value={studentInfo.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder={t('psychopedagogue.piar.generator.gradePlaceholder')}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="school">{t('psychopedagogue.piar.generator.school')}</Label>
                <Input
                  id="school"
                  value={studentInfo.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder={t('psychopedagogue.piar.generator.schoolPlaceholder')}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="previousDiagnosis">{t('psychopedagogue.piar.generator.previousDiagnosis')}</Label>
              <Textarea
                id="previousDiagnosis"
                value={studentInfo.previousDiagnosis}
                onChange={(e) => handleInputChange('previousDiagnosis', e.target.value)}
                placeholder={t('psychopedagogue.piar.generator.previousDiagnosisPlaceholder')}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="familyContext">{t('psychopedagogue.piar.generator.familyContext')}</Label>
              <Textarea
                id="familyContext"
                value={studentInfo.familyContext}
                onChange={(e) => handleInputChange('familyContext', e.target.value)}
                placeholder={t('psychopedagogue.piar.generator.familyContextPlaceholder')}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="academicHistory">{t('psychopedagogue.piar.generator.academicHistory')}</Label>
              <Textarea
                id="academicHistory"
                value={studentInfo.academicHistory}
                onChange={(e) => handleInputChange('academicHistory', e.target.value)}
                placeholder={t('psychopedagogue.piar.generator.academicHistoryPlaceholder')}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="behavioralObservations">{t('psychopedagogue.piar.generator.behavioralObservations')}</Label>
              <Textarea
                id="behavioralObservations"
                value={studentInfo.behavioralObservations}
                onChange={(e) => handleInputChange('behavioralObservations', e.target.value)}
                placeholder={t('psychopedagogue.piar.generator.behavioralObservationsPlaceholder')}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
            
            <div>
              <Label htmlFor="emotionalState">{t('psychopedagogue.piar.generator.emotionalState')}</Label>
              <Textarea
                id="emotionalState"
                value={studentInfo.emotionalState}
                onChange={(e) => handleInputChange('emotionalState', e.target.value)}
                placeholder={t('psychopedagogue.piar.generator.emotionalStatePlaceholder')}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>{t('psychopedagogue.piar.generator.focusAreas')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {['academic', 'emotional', 'behavioral', 'social', 'communication', 'motor'].map(area => (
                  <Button
                    key={area}
                    variant={piarConfig.focusAreas.includes(area) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const newAreas = piarConfig.focusAreas.includes(area)
                        ? piarConfig.focusAreas.filter(a => a !== area)
                        : [...piarConfig.focusAreas, area];
                      handleConfigChange('focusAreas', newAreas);
                    }}
                  >
                    {t(`psychopedagogue.piar.generator.areas.${area}`)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priorityLevel">{t('psychopedagogue.piar.generator.priorityLevel')}</Label>
                <Select value={piarConfig.priorityLevel} onValueChange={(value) => handleConfigChange('priorityLevel', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="low" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.priority.low')}</SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.priority.medium')}</SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.priority.high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">{t('psychopedagogue.piar.generator.duration')}</Label>
                <Select value={piarConfig.duration} onValueChange={(value) => handleConfigChange('duration', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="3 months" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.durationOptions.3months')}</SelectItem>
                    <SelectItem value="6 months" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.durationOptions.6months')}</SelectItem>
                    <SelectItem value="12 months" className="text-white hover:bg-slate-600">{t('psychopedagogue.piar.generator.durationOptions.12months')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Brain className="h-16 w-16 text-blue-500 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('psychopedagogue.piar.generator.generatingTitle')}</h3>
              <p className="text-gray-600">{t('psychopedagogue.piar.generator.generatingMessage')}</p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{Math.round(progress)}% {t('psychopedagogue.piar.generator.complete')}</p>
            </div>
            
            {isGenerating && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{t('psychopedagogue.piar.generator.analyzing')}</span>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">{t('psychopedagogue.piar.generator.generationComplete')}</span>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>{t('psychopedagogue.piar.generator.generatedPiar')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedPiar?.supportPlan || t('psychopedagogue.piar.generator.noContent')}
                  </pre>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-2">
              <Button onClick={downloadPiar} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('psychopedagogue.piar.generator.download')}
              </Button>
              <Button onClick={savePiar}>
                <Save className="h-4 w-4 mr-2" />
                {t('psychopedagogue.piar.generator.save')}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <span>{t('psychopedagogue.piar.generator.title')}</span>
          </DialogTitle>
          <DialogDescription>
            {t('psychopedagogue.piar.generator.description')}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-blue-500 bg-blue-500 text-white' :
                  isCompleted ? 'border-green-500 bg-green-500 text-white' :
                  'border-gray-300 bg-white text-gray-500'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isGenerating}
          >
            {t('common.previous')}
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < 3 && (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                {t('common.next')}
              </Button>
            )}
            
            {currentStep === 3 && (
              <Button onClick={generatePiarWithAI} disabled={isGenerating}>
                <Brain className="h-4 w-4 mr-2" />
                {t('psychopedagogue.piar.generator.generate')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedPiarGenerator;
