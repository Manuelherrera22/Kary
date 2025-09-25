import React, { useState } from 'react';
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
import { MessageSquare, Star, Send, X, ChevronRight, ChevronLeft, CheckCircle, BarChart3, Users, Settings, Shield } from 'lucide-react';

const FeedbackModal = () => {
  const { t } = useLanguage();
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

  const handleSubmit = () => {
    // Aquí podrías enviar los datos a un servidor
    console.log('Feedback profesional recopilado:', feedbackData);
    setIsSubmitted(true);
    
    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setCurrentStep(0);
      setCurrentRole('');
      setFeedbackData({
        personalInfo: {},
        roleSpecific: {},
        generalEvaluation: {},
        detailedFeedback: {},
        recommendations: {}
      });
    }, 3000);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
        <MessageSquare className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Encuesta de Evaluación Kary</h2>
        <p className="text-slate-600">Su opinión es fundamental para mejorar nuestra plataforma educativa</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tiempo estimado:</strong> 8-10 minutos<br/>
          <strong>Confidencialidad:</strong> Sus respuestas son completamente anónimas<br/>
          <strong>Propósito:</strong> Mejorar la experiencia educativa de Kary
        </p>
      </div>
    </div>
  );

  const renderRoleSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Identificación de Rol</h2>
        <p className="text-slate-600">Por favor, seleccione su rol principal en la institución educativa</p>
      </div>
      
      <RadioGroup 
        value={currentRole} 
        onValueChange={setCurrentRole}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-25 transition-colors">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Estudiante</div>
              <div className="text-sm text-slate-600">Usuario principal de la plataforma educativa</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-25 transition-colors">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Profesor/Educador</div>
              <div className="text-sm text-slate-600">Facilitador educativo y gestor de contenido</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-25 transition-colors">
          <RadioGroupItem value="psychopedagogue" id="psychopedagogue" />
          <Label htmlFor="psychopedagogue" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Psicopedagogo</div>
              <div className="text-sm text-slate-600">Especialista en apoyo y desarrollo educativo</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-25 transition-colors">
          <RadioGroupItem value="parent" id="parent" />
          <Label htmlFor="parent" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Padre/Madre</div>
              <div className="text-sm text-slate-600">Representante familiar del estudiante</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-25 transition-colors">
          <RadioGroupItem value="director" id="director" />
          <Label htmlFor="director" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Directivo/Administrador</div>
              <div className="text-sm text-slate-600">Gestor institucional y tomador de decisiones</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Información Personal</h2>
        <p className="text-slate-600">Esta información nos ayuda a contextualizar su experiencia</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Rango de edad</Label>
          <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'age', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione su rango de edad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-18">Menor de 18 años</SelectItem>
              <SelectItem value="18-25">18-25 años</SelectItem>
              <SelectItem value="26-35">26-35 años</SelectItem>
              <SelectItem value="36-45">36-45 años</SelectItem>
              <SelectItem value="46-55">46-55 años</SelectItem>
              <SelectItem value="over-55">Mayor de 55 años</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">Experiencia con tecnología educativa</Label>
          <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'techExperience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione su nivel de experiencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Principiante</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
              <SelectItem value="expert">Experto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="institution">Tipo de institución educativa</Label>
        <Select onValueChange={(value) => updateFeedbackData('personalInfo', 'institutionType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo de institución" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public-school">Escuela pública</SelectItem>
            <SelectItem value="private-school">Escuela privada</SelectItem>
            <SelectItem value="charter-school">Escuela charter</SelectItem>
            <SelectItem value="homeschool">Educación en casa</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderEvaluationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Evaluación de Kary</h2>
        <p className="text-gray-600">Califique diferentes aspectos de la plataforma</p>
      </div>
      
      <div className="space-y-6">
        {[
          { key: 'usability', label: 'Facilidad de uso', description: '¿Qué tan fácil es navegar y usar la plataforma?', color: 'blue' },
          { key: 'functionality', label: 'Funcionalidad', description: '¿Las herramientas cumplen con sus expectativas?', color: 'emerald' },
          { key: 'design', label: 'Diseño y estética', description: '¿El diseño es atractivo y profesional?', color: 'violet' },
          { key: 'performance', label: 'Rendimiento', description: '¿La plataforma funciona de manera rápida y estable?', color: 'amber' },
          { key: 'support', label: 'Soporte y ayuda', description: '¿El soporte técnico es efectivo?', color: 'rose' }
        ].map((item) => (
          <div key={item.key} className="space-y-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
            <div>
              <h4 className="font-semibold text-gray-800 text-lg">{item.label}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Muy malo</span>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFeedbackData('generalEvaluation', item.key, rating)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 font-semibold ${
                      feedbackData.generalEvaluation[item.key] >= rating
                        ? `border-${item.color}-500 bg-${item.color}-500 text-white shadow-lg transform scale-110`
                        : `border-gray-300 hover:border-${item.color}-300 hover:bg-${item.color}-50 text-gray-600 hover:text-${item.color}-700`
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">Excelente</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailedFeedbackStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Feedback Detallado</h2>
        <p className="text-slate-600">Comparta sus experiencias específicas con Kary</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="positive">¿Qué es lo que más le gusta de Kary?</Label>
          <Textarea
            id="positive"
            placeholder="Describa los aspectos positivos de su experiencia..."
            className="min-h-[100px]"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'positive', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="negative">¿Qué aspectos considera que necesitan mejora?</Label>
          <Textarea
            id="negative"
            placeholder="Describa las áreas que podrían mejorarse..."
            className="min-h-[100px]"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'negative', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="suggestions">¿Tiene alguna sugerencia específica?</Label>
          <Textarea
            id="suggestions"
            placeholder="Comparta sus ideas para mejorar la plataforma..."
            className="min-h-[100px]"
            onChange={(e) => updateFeedbackData('detailedFeedback', 'suggestions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderRecommendationsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Recomendaciones</h2>
        <p className="text-slate-600">Ayúdenos a entender el impacto de Kary</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>¿Recomendaría Kary a otros?</Label>
          <RadioGroup 
            value={feedbackData.recommendations.recommend} 
            onValueChange={(value) => updateFeedbackData('recommendations', 'recommend', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="definitely" id="definitely" />
              <Label htmlFor="definitely">Definitivamente sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="probably" id="probably" />
              <Label htmlFor="probably">Probablemente sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="neutral" id="neutral" />
              <Label htmlFor="neutral">No estoy seguro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="probably-not" id="probably-not" />
              <Label htmlFor="probably-not">Probablemente no</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="definitely-not" id="definitely-not" />
              <Label htmlFor="definitely-not">Definitivamente no</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="impact">¿Cómo ha impactado Kary en su experiencia educativa?</Label>
          <Textarea
            id="impact"
            placeholder="Describa el impacto que Kary ha tenido en su proceso educativo..."
            className="min-h-[100px]"
            onChange={(e) => updateFeedbackData('recommendations', 'impact', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additional">Comentarios adicionales</Label>
          <Textarea
            id="additional"
            placeholder="Cualquier comentario adicional que desee compartir..."
            className="min-h-[80px]"
            onChange={(e) => updateFeedbackData('recommendations', 'additional', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Gracias por su participación!</h2>
        <p className="text-slate-600">Su feedback es fundamental para mejorar Kary</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Hacer Encuesta
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                🚀 Feedback Kary
              </DialogTitle>
              <p className="text-center text-slate-600">Tu opinión es importante para mejorar la plataforma</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">
                Paso {currentStep + 1} de {steps.length}
              </div>
              <Progress value={getProgressPercentage()} className="w-32 mt-1" />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicador de pasos */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    index <= currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${
                      index < currentStep ? 'bg-purple-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Contenido del paso actual */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Navegación */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex space-x-2">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Encuesta
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !currentRole}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
