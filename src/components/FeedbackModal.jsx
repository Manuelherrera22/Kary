import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Star, Send, X, ChevronRight, ChevronLeft, CheckCircle, BarChart3, Users, Settings, Shield, Loader2 } from 'lucide-react';
import surveyService from '@/services/surveyService';
import { useToast } from '@/components/ui/use-toast';

const FeedbackModal = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRole, setCurrentRole] = useState('');
  const [feedbackData, setFeedbackData] = useState({
    personalInfo: {},
    roleSpecific: {},
    generalEvaluation: {},
    detailedFeedback: {},
    recommendations: {}
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const steps = [
    { id: 'welcome', title: 'Bienvenida', icon: MessageSquare },
    { id: 'role', title: 'Identificación', icon: Users },
    { id: 'personal', title: 'Información Personal', icon: Settings },
    { id: 'evaluation', title: 'Evaluación', icon: BarChart3 },
    { id: 'detailed', title: 'Feedback Detallado', icon: MessageSquare },
    { id: 'recommendations', title: 'Recomendaciones', icon: Star },
    { id: 'completion', title: 'Finalización', icon: CheckCircle }
  ];

  const updateFeedbackData = (section, field, value) => {
    setFeedbackData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Inicializar tiempo de inicio cuando se abre el modal
  useEffect(() => {
    if (isOpen && !startTime) {
      setStartTime(Date.now());
    }
  }, [isOpen, startTime]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Preparar datos para envío
      const surveyData = {
        ...feedbackData,
        user_role: currentRole,
        completionTime: startTime ? surveyService.calculateCompletionTime(startTime) : null
      };

      // Validar datos
      const validation = surveyService.validateSurveyData(surveyData);
      if (!validation.isValid) {
        toast({
          title: "Error de validación",
          description: validation.errors.join(', '),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Enviar a Supabase
      const result = await surveyService.submitSurvey(surveyData);
      
      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "¡Encuesta enviada exitosamente!",
          description: "Gracias por tu valiosa contribución a mejorar Kary",
          variant: "default"
        });
        
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          setCurrentStep(0);
          setCurrentRole('');
          setStartTime(null);
          setFeedbackData({
            personalInfo: {},
            roleSpecific: {},
            generalEvaluation: {},
            detailedFeedback: {},
            recommendations: {}
          });
        }, 3000);
      } else {
        throw new Error(result.error || 'Error al enviar la encuesta');
      }
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      toast({
        title: "Error al enviar encuesta",
        description: error.message || "Por favor, inténtalo de nuevo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Encuesta de Evaluación Kary</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Su opinión es fundamental para mejorar nuestra plataforma educativa</p>
      </div>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3 sm:p-4 mx-2 sm:mx-0">
        <p className="text-xs sm:text-sm text-emerald-800 space-y-1 sm:space-y-0">
          <div><strong>Tiempo estimado:</strong> 8-10 minutos</div>
          <div><strong>Confidencialidad:</strong> Sus respuestas son completamente anónimas</div>
          <div><strong>Propósito:</strong> Mejorar la experiencia educativa de Kary</div>
        </p>
      </div>
    </div>
  );

  const renderRoleSelectionStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Identificación de Rol</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Por favor, seleccione su rol principal en la institución educativa</p>
      </div>
      
      <RadioGroup 
        value={currentRole} 
        onValueChange={setCurrentRole}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-25 transition-colors">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 text-sm sm:text-base">Estudiante</div>
              <div className="text-xs sm:text-sm text-slate-600">Usuario principal de la plataforma educativa</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-25 transition-colors">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 text-sm sm:text-base">Profesor/Educador</div>
              <div className="text-xs sm:text-sm text-slate-600">Facilitador educativo y gestor de contenido</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-25 transition-colors">
          <RadioGroupItem value="psychopedagogue" id="psychopedagogue" />
          <Label htmlFor="psychopedagogue" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-100 to-violet-200 rounded-full flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 text-sm sm:text-base">Psicopedagogo</div>
              <div className="text-xs sm:text-sm text-slate-600">Especialista en apoyo y desarrollo educativo</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-25 transition-colors">
          <RadioGroupItem value="parent" id="parent" />
          <Label htmlFor="parent" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 text-sm sm:text-base">Padre/Madre</div>
              <div className="text-xs sm:text-sm text-slate-600">Representante familiar del estudiante</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-25 transition-colors">
          <RadioGroupItem value="director" id="director" />
          <Label htmlFor="director" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-100 to-rose-200 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-800 text-sm sm:text-base">Directivo/Administrador</div>
              <div className="text-xs sm:text-sm text-slate-600">Gestor institucional y tomador de decisiones</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Información Personal</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Esta información nos ayuda a contextualizar su experiencia</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="age" className="text-sm sm:text-base text-slate-700 font-medium">Rango de edad</Label>
          <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'age', value)}>
            <SelectTrigger className="bg-white border-slate-300 text-slate-800 hover:border-emerald-400 focus:border-emerald-500">
              <SelectValue placeholder="Seleccione su rango de edad" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="under-18" className="text-slate-800 hover:bg-emerald-50">Menor de 18 años</SelectItem>
              <SelectItem value="18-25" className="text-slate-800 hover:bg-emerald-50">18-25 años</SelectItem>
              <SelectItem value="26-35" className="text-slate-800 hover:bg-emerald-50">26-35 años</SelectItem>
              <SelectItem value="36-45" className="text-slate-800 hover:bg-emerald-50">36-45 años</SelectItem>
              <SelectItem value="46-55" className="text-slate-800 hover:bg-emerald-50">46-55 años</SelectItem>
              <SelectItem value="over-55" className="text-slate-800 hover:bg-emerald-50">Mayor de 55 años</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-sm sm:text-base text-slate-700 font-medium">Experiencia con tecnología educativa</Label>
          <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'techExperience', value)}>
            <SelectTrigger className="bg-white border-slate-300 text-slate-800 hover:border-emerald-400 focus:border-emerald-500">
              <SelectValue placeholder="Seleccione su nivel de experiencia" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="beginner" className="text-slate-800 hover:bg-emerald-50">Principiante</SelectItem>
              <SelectItem value="intermediate" className="text-slate-800 hover:bg-emerald-50">Intermedio</SelectItem>
              <SelectItem value="advanced" className="text-slate-800 hover:bg-emerald-50">Avanzado</SelectItem>
              <SelectItem value="expert" className="text-slate-800 hover:bg-emerald-50">Experto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="institution" className="text-sm sm:text-base text-slate-700 font-medium">Tipo de institución educativa</Label>
        <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'institutionType', value)}>
          <SelectTrigger className="bg-white border-slate-300 text-slate-800 hover:border-emerald-400 focus:border-emerald-500">
            <SelectValue placeholder="Seleccione el tipo de institución" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            <SelectItem value="public-school" className="text-slate-800 hover:bg-emerald-50">Escuela pública</SelectItem>
            <SelectItem value="private-school" className="text-slate-800 hover:bg-emerald-50">Escuela privada</SelectItem>
            <SelectItem value="charter-school" className="text-slate-800 hover:bg-emerald-50">Escuela charter</SelectItem>
            <SelectItem value="homeschool" className="text-slate-800 hover:bg-emerald-50">Educación en casa</SelectItem>
            <SelectItem value="other" className="text-slate-800 hover:bg-emerald-50">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderEvaluationStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Evaluación de Kary</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Califique diferentes aspectos de la plataforma</p>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {[
          { key: 'usability', label: 'Facilidad de uso', description: '¿Qué tan fácil es navegar y usar la plataforma?', color: 'blue' },
          { key: 'functionality', label: 'Funcionalidad', description: '¿Las herramientas cumplen con sus expectativas?', color: 'emerald' },
          { key: 'design', label: 'Diseño y estética', description: '¿El diseño es atractivo y profesional?', color: 'violet' },
          { key: 'performance', label: 'Rendimiento', description: '¿La plataforma funciona de manera rápida y estable?', color: 'amber' },
          { key: 'support', label: 'Soporte y ayuda', description: '¿El soporte técnico es efectivo?', color: 'rose' }
        ].map((item) => (
          <div key={item.key} className="space-y-3 sm:space-y-4 p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-semibold text-slate-800 text-base sm:text-lg">{item.label}</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{item.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-500 font-medium">Muy malo</span>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFeedbackData('generalEvaluation', item.key, rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 font-semibold ${
                      feedbackData.generalEvaluation[item.key] >= rating
                        ? `border-emerald-500 bg-emerald-500 text-white shadow-lg transform scale-110`
                        : `border-slate-300 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700`
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">Excelente</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailedFeedbackStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Feedback Detallado</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Comparta sus experiencias específicas con Kary</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="positive" className="text-sm sm:text-base text-slate-700 font-medium">¿Qué es lo que más le gusta de Kary?</Label>
          <Textarea
            id="positive"
            placeholder="Describa los aspectos positivos de su experiencia..."
            className="min-h-[100px] bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'positive', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="negative" className="text-sm sm:text-base text-slate-700 font-medium">¿Qué aspectos considera que necesitan mejora?</Label>
          <Textarea
            id="negative"
            placeholder="Describa las áreas que podrían mejorarse..."
            className="min-h-[100px] bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'negative', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="suggestions" className="text-sm sm:text-base text-slate-700 font-medium">¿Tiene alguna sugerencia específica?</Label>
          <Textarea
            id="suggestions"
            placeholder="Comparta sus ideas para mejorar la plataforma..."
            className="min-h-[100px] bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'suggestions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderRecommendationsStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Recomendaciones</h2>
        <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">Ayúdenos a entender el impacto de Kary</p>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Sección de recomendación - Responsive */}
        <div className="space-y-4">
          <Label className="text-sm sm:text-base text-slate-700 font-medium">¿Recomendaría Kary a otros?</Label>
          <RadioGroup 
            value={feedbackData.recommendations.recommend} 
            onValueChange={(value) => updateFeedbackData('recommendations', 'recommend', value)}
            className="space-y-3"
          >
            {/* Grid responsive para opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="definitely" id="definitely" className="border-slate-400" />
                <Label htmlFor="definitely" className="text-sm sm:text-base text-slate-800 font-medium cursor-pointer flex-1">Definitivamente sí</Label>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="probably" id="probably" className="border-slate-400" />
                <Label htmlFor="probably" className="text-sm sm:text-base text-slate-800 font-medium cursor-pointer flex-1">Probablemente sí</Label>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="neutral" id="neutral" className="border-slate-400" />
                <Label htmlFor="neutral" className="text-sm sm:text-base text-slate-800 font-medium cursor-pointer flex-1">No estoy seguro</Label>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="probably-not" id="probably-not" className="border-slate-400" />
                <Label htmlFor="probably-not" className="text-sm sm:text-base text-slate-800 font-medium cursor-pointer flex-1">Probablemente no</Label>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                <RadioGroupItem value="definitely-not" id="definitely-not" className="border-slate-400" />
                <Label htmlFor="definitely-not" className="text-sm sm:text-base text-slate-800 font-medium cursor-pointer flex-1">Definitivamente no</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Sección de impacto - Responsive */}
        <div className="space-y-2">
          <Label htmlFor="impact" className="text-slate-700 font-medium text-base">¿Cómo ha impactado Kary en su experiencia educativa?</Label>
          <Textarea
            id="impact"
            placeholder="Describa el impacto que Kary ha tenido en su proceso educativo..."
            className="min-h-[120px] bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
            onChange={(e) => updateFeedbackData('recommendations', 'impact', e.target.value)}
          />
        </div>
        
        {/* Sección de comentarios adicionales - Responsive */}
        <div className="space-y-2">
          <Label htmlFor="additional" className="text-slate-700 font-medium text-base">Comentarios adicionales</Label>
          <Textarea
            id="additional"
            placeholder="Cualquier comentario adicional que desee compartir..."
            className="min-h-[100px] bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
            onChange={(e) => updateFeedbackData('recommendations', 'additional', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Gracias por su participación!</h2>
        <p className="text-slate-600">Su feedback es fundamental para mejorar Kary</p>
      </div>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm text-emerald-800">
          <strong>Próximos pasos:</strong><br/>
          • Analizaremos su feedback cuidadosamente<br/>
          • Implementaremos mejoras basadas en sus sugerencias<br/>
          • Le mantendremos informado sobre los avances
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderRoleSelectionStep();
      case 2: return renderPersonalInfoStep();
      case 3: return renderEvaluationStep();
      case 4: return renderDetailedFeedbackStep();
      case 5: return renderRecommendationsStep();
      case 6: return renderCompletionStep();
      default: return renderWelcomeStep();
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">¡Feedback enviado exitosamente!</h3>
            <p className="text-slate-600">Gracias por su valiosa contribución</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Hacer Encuesta
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-emerald-50 border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 sm:p-6 rounded-t-lg -m-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                🚀 Feedback Kary
              </DialogTitle>
              <p className="text-sm sm:text-base text-white/90">Tu opinión es importante para mejorar la plataforma</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-sm text-white/80">
                Paso {currentStep + 1} de {steps.length}
              </div>
              <Progress value={getProgressPercentage()} className="w-24 sm:w-32 mt-1 bg-white/20" />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6">
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-1 ${
                      index < currentStep ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Contenido del paso actual */}
          <div className="min-h-[300px] sm:min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Navegación */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-4 sm:pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="w-full sm:w-auto flex items-center justify-center border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <div className="w-full sm:w-auto flex justify-center">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Encuesta
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !currentRole}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
