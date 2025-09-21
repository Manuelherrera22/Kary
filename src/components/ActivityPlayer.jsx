import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { personalizeActivity, generatePersonalizedQuestions, applyAccessibilityAdjustments } from '@/services/activityPersonalizationService';
import { generateDynamicActivity, analyzeStudentResponse, generateDynamicQuestions, chatWithGemini } from '@/services/geminiActivityService';
import GeminiChatAssistant from '@/components/GeminiChatAssistant';
import GeminiResultsPanel from '@/components/GeminiResultsPanel';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Star,
  Clock,
  Target,
  BookOpen,
  User,
  Settings,
  Gamepad2,
  Book,
  Trophy,
  Zap,
  Heart,
  Sparkles,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Componente de modalidad gamificada
const GamifiedActivityMode = ({ activity, onComplete, onPause, onExit }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.duration * 60); // Convertir minutos a segundos
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Generar contenido gamificado basado en la actividad
  const generateGamifiedContent = (activity) => {
    // Si hay contenido generado por Gemini, usarlo
    if (activity.geminiContent && activity.geminiContent.gamifiedContent) {
      return {
        type: 'gemini_generated',
        theme: activity.geminiContent.gamifiedContent.theme,
        icon: getSubjectIcon(activity.subject),
        color: getSubjectColor(activity.subject),
        story: activity.geminiContent.gamifiedContent.story,
        challenges: activity.geminiContent.gamifiedContent.challenges,
        totalChallenges: activity.geminiContent.gamifiedContent.challenges.length
      };
    }

    // Fallback a contenido básico
    const gameTypes = {
      mathematics: {
        type: 'math_quest',
        theme: 'Aventura Matemática',
        icon: '🔢',
        color: 'from-blue-600 to-purple-600'
      },
      reading: {
        type: 'reading_adventure',
        theme: 'Expedición de Lectura',
        icon: '📖',
        color: 'from-green-600 to-teal-600'
      },
      writing: {
        type: 'writing_quest',
        theme: 'Misión de Escritura',
        icon: '✍️',
        color: 'from-yellow-600 to-orange-600'
      },
      science: {
        type: 'science_lab',
        theme: 'Laboratorio Científico',
        icon: '🔬',
        color: 'from-purple-600 to-pink-600'
      }
    };

    const gameConfig = gameTypes[activity.subject] || gameTypes.mathematics;
    
    // Generar preguntas/desafíos basados en la dificultad
    const challenges = generateChallenges(activity, gameConfig);
    
    return {
      ...gameConfig,
      challenges,
      totalChallenges: challenges.length
    };
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      mathematics: '🔢',
      reading: '📖',
      writing: '✍️',
      science: '🔬'
    };
    return icons[subject] || '📚';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      mathematics: 'from-blue-600 to-purple-600',
      reading: 'from-green-600 to-teal-600',
      writing: 'from-yellow-600 to-orange-600',
      science: 'from-purple-600 to-pink-600'
    };
    return colors[subject] || 'from-gray-600 to-gray-800';
  };

  const generateChallenges = (activity, gameConfig) => {
    const challenges = [];
    const challengeCount = activity.difficulty === 'beginner' ? 3 : 
                          activity.difficulty === 'intermediate' ? 5 : 7;

    for (let i = 0; i < challengeCount; i++) {
      challenges.push({
        id: i + 1,
        type: gameConfig.type,
        question: generateQuestion(activity.subject, i + 1),
        options: generateOptions(activity.subject, i + 1),
        correctAnswer: Math.floor(Math.random() * 4),
        points: (i + 1) * 10,
        hint: generateHint(activity.subject, i + 1)
      });
    }
    
    return challenges;
  };

  const generateQuestion = (subject, level) => {
    const questions = {
      mathematics: [
        `¿Cuánto es ${2 + level} + ${3 + level}?`,
        `Si tienes ${5 + level} manzanas y comes ${2 + level}, ¿cuántas te quedan?`,
        `¿Cuál es el resultado de ${3 + level} × ${2 + level}?`
      ],
      reading: [
        `Lee la palabra: "CASA" y elige la imagen correcta`,
        `¿Cuál palabra rima con "SOL"?`,
        `Ordena las letras para formar una palabra: "T-A-R-A"`
      ],
      writing: [
        `Escribe una oración usando la palabra "AMIGO"`,
        `Completa: "El gato es..."`,
        `Escribe 3 palabras que empiecen con "M"`
      ],
      science: [
        `¿Qué animal vive en el agua?`,
        `¿Cuál es el color de las hojas?`,
        `¿Qué necesitan las plantas para crecer?`
      ]
    };

    const subjectQuestions = questions[subject] || questions.mathematics;
    return subjectQuestions[level % subjectQuestions.length];
  };

  const generateOptions = (subject, level) => {
    const options = {
      mathematics: [
        [4, 5, 6, 7],
        [2, 3, 4, 5],
        [6, 8, 10, 12]
      ],
      reading: [
        ['🏠', '🌳', '🚗', '🐕'],
        ['MOL', 'PAL', 'DOL', 'COL'],
        ['RATA', 'TARA', 'ARTA', 'ATAR']
      ],
      writing: [
        ['Escribe aquí...', '', '', ''],
        ['pequeño', 'grande', 'azul', 'rápido'],
        ['Manzana, Mesa, Montaña', '', '', '']
      ],
      science: [
        ['🐟', '🐱', '🐕', '🐦'],
        ['Verde', 'Rojo', 'Azul', 'Amarillo'],
        ['Agua', 'Fuego', 'Hielo', 'Aire']
      ]
    };

    const subjectOptions = options[subject] || options.mathematics;
    return subjectOptions[level % subjectOptions.length];
  };

  const generateHint = (subject, level) => {
    const hints = {
      mathematics: [
        'Suma los números paso a paso',
        'Resta el número que comes del total',
        'Multiplica los números'
      ],
      reading: [
        'Busca la imagen que representa una casa',
        'Palabras que suenan igual al final',
        'Piensa en animales pequeños'
      ],
      writing: [
        'Usa tu imaginación para crear una oración',
        'Piensa en características del gato',
        'Recuerda palabras que conozcas'
      ],
      science: [
        'Piensa en animales acuáticos',
        'Recuerda el color de la naturaleza',
        'Las plantas necesitan agua y luz'
      ]
    };

    const subjectHints = hints[subject] || hints.mathematics;
    return subjectHints[level % subjectHints.length];
  };

  const [gameContent] = useState(() => generateGamifiedContent(activity));
  const [currentChallenge, setCurrentChallenge] = useState(gameContent.challenges[0]);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setIsPlaying(true);
    toast({
      title: '🎮 ¡Aventura Iniciada!',
      description: `¡Comienza tu ${gameContent.theme}!`,
      variant: 'default',
    });
  };

  const handleAnswer = async (answerIndex) => {
    const isCorrect = answerIndex === currentChallenge.correctAnswer;
    
    // Análisis inteligente con Gemini
    try {
      const analysis = await analyzeStudentResponse(
        currentChallenge.question,
        currentChallenge.options[answerIndex],
        currentChallenge.options[currentChallenge.correctAnswer],
        userProfile
      );

      if (analysis.success) {
        setShowFeedback(true);
        setFeedbackMessage(analysis.data.feedback);
        
        toast({
          title: isCorrect ? '¡Excelente!' : '¡Sigue intentando!',
          description: analysis.data.encouragement,
          variant: isCorrect ? 'default' : 'destructive',
        });
      } else {
        // Fallback a feedback básico
        setShowFeedback(true);
        setFeedbackMessage(isCorrect ? '¡Correcto! 🎉' : 'Inténtalo de nuevo 💪');
      }
    } catch (error) {
      console.error('Error analizando respuesta:', error);
      setShowFeedback(true);
      setFeedbackMessage(isCorrect ? '¡Correcto! 🎉' : 'Inténtalo de nuevo 💪');
    }

    if (isCorrect) {
      setScore(prev => prev + currentChallenge.points);
      setStreak(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
    }

    // Continuar al siguiente desafío
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep < gameContent.challenges.length - 1) {
        setCurrentStep(prev => prev + 1);
        setCurrentChallenge(gameContent.challenges[currentStep + 1]);
      } else {
        handleComplete();
      }
    }, 3000); // Más tiempo para leer el feedback de Gemini
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    toast({
      title: '⏰ Tiempo Agotado',
      description: 'Se acabó el tiempo, pero has hecho un gran trabajo!',
      variant: 'destructive',
    });
    handleComplete();
  };

  const handleComplete = () => {
    setIsPlaying(false);
    const finalScore = score + (streak * 10); // Bonus por racha
    
    toast({
      title: '🏆 ¡Misión Completada!',
      description: `Puntuación final: ${finalScore} puntos!`,
      variant: 'default',
    });
    
    onComplete({
      score: finalScore,
      timeSpent: (activity.duration * 60) - timeLeft,
      accuracy: ((currentStep + 1) / gameContent.challenges.length) * 100,
      streak: streak
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Gamificado */}
      <div className={`bg-gradient-to-r ${gameContent.color} p-4 rounded-t-lg`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{gameContent.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{gameContent.theme}</h2>
              <p className="text-sm opacity-90">{activity.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs opacity-75">Puntos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                {lives}
              </div>
              <div className="text-xs opacity-75">Vidas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                {streak}
              </div>
              <div className="text-xs opacity-75">Racha</div>
            </div>
          </div>
        </div>
        
        {/* Progreso y Tiempo */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Desafío {currentStep + 1} de {gameContent.challenges.length}</span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress 
            value={((currentStep + 1) / gameContent.challenges.length) * 100} 
            className="h-2"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 bg-slate-800">
        {!isPlaying ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{gameContent.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              ¡Bienvenido a {gameContent.theme}!
            </h3>
            <p className="text-gray-300 mb-6">
              Completa {gameContent.challenges.length} desafíos para ganar puntos y trofeos.
              ¡Cada respuesta correcta te da puntos y mantén tu racha!
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700 rounded-lg p-3">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Gana Puntos</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">3 Vidas</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3">
                <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Racha Bonus</div>
              </div>
            </div>
            
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-lg px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              ¡Comenzar Aventura!
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pregunta Actual */}
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Badge className="bg-blue-600 text-white mr-3">
                  Desafío {currentStep + 1}
                </Badge>
                <Badge className="bg-purple-600 text-white">
                  {currentChallenge.points} puntos
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentChallenge.question}
              </h3>
              
              {/* Opciones de respuesta */}
              <div className="grid grid-cols-2 gap-3">
                {currentChallenge.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className="h-16 text-left justify-start bg-slate-600 hover:bg-slate-500 text-white border-0"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              
              {/* Pista */}
              <div className="mt-4 p-3 bg-slate-600 rounded-lg">
                <div className="text-sm text-gray-300">
                  💡 <strong>Pista:</strong> {currentChallenge.hint}
                </div>
              </div>
            </div>
            
            {/* Feedback */}
            {showFeedback && (
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-white">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer con controles */}
      <div className="bg-slate-700 p-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPause}
            className="text-gray-300 border-gray-600"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pausar
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={onExit}
              className="text-gray-300 border-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de modalidad tradicional
const TraditionalActivityMode = ({ activity, onComplete, onPause, onExit }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity.duration * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setIsPlaying(true);
    setShowInstructions(false);
    toast({
      title: '📚 Actividad Iniciada',
      description: '¡Comienza a trabajar en tu actividad!',
      variant: 'default',
    });
  };

  const handleAnswer = (stepId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [stepId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < activity.objectives.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsPlaying(false);
    const completionTime = (activity.duration * 60) - timeLeft;
    
    toast({
      title: '✅ Actividad Completada',
      description: `Has terminado en ${Math.floor(completionTime / 60)} minutos`,
      variant: 'default',
    });
    
    onComplete({
      answers: answers,
      timeSpent: completionTime,
      completionRate: Object.keys(answers).length / activity.objectives.length * 100
    });
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    toast({
      title: '⏰ Tiempo Agotado',
      description: 'Se acabó el tiempo para esta actividad',
      variant: 'destructive',
    });
    handleComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Tradicional */}
      <div className="bg-slate-700 p-4 rounded-t-lg">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold">Actividad Tradicional</h2>
              <p className="text-sm text-gray-300">{activity.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-300">Tiempo</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{currentStep + 1}/{activity.objectives.length}</div>
              <div className="text-xs text-gray-300">Paso</div>
            </div>
          </div>
        </div>
        
        {/* Progreso */}
        <div className="mt-4">
          <Progress 
            value={((currentStep + 1) / activity.objectives.length) * 100} 
            className="h-2"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 bg-slate-800 overflow-y-auto">
        {!isPlaying ? (
          <div className="space-y-6">
            <div className="text-center">
              <Book className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {activity.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {activity.description}
              </p>
            </div>
            
            {/* Materiales */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                Materiales Necesarios
              </h4>
              <div className="flex flex-wrap gap-2">
                {activity.materials.map((material, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Objetivos */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Objetivos de la Actividad
              </h4>
              <ul className="space-y-2">
                {activity.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instrucciones */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                Instrucciones
              </h4>
              <div className="text-gray-300 space-y-2">
                <p>1. Lee cuidadosamente cada paso</p>
                <p>2. Responde las preguntas en orden</p>
                <p>3. Usa los materiales indicados</p>
                <p>4. Tómate tu tiempo para pensar</p>
                <p>5. Revisa tus respuestas antes de continuar</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Comenzar Actividad
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Paso Actual */}
            <div className="bg-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Badge className="bg-blue-600 text-white mr-3">
                  Paso {currentStep + 1}
                </Badge>
                <Badge className="bg-green-600 text-white">
                  {activity.objectives[currentStep]}
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-4">
                {activity.objectives[currentStep]}
              </h3>
              
              {/* Área de respuesta */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tu respuesta:
                  </label>
                  <textarea
                    value={answers[currentStep] || ''}
                    onChange={(e) => handleAnswer(currentStep, e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full h-32 p-3 bg-slate-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                {/* Materiales para este paso */}
                {activity.materials && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Materiales que necesitas:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activity.materials.map((material, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Navegación */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[currentStep]?.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === activity.objectives.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer con controles */}
      <div className="bg-slate-700 p-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPause}
            className="text-gray-300 border-gray-600"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pausar
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onExit}
              className="text-gray-300 border-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del reproductor de actividades
const ActivityPlayer = ({ activity, isOpen, onClose, onComplete }) => {
  const { userProfile } = useMockAuth();
  const [mode, setMode] = useState(null); // 'gamified' o 'traditional'
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [personalizedActivity, setPersonalizedActivity] = useState(null);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [geminiChatMinimized, setGeminiChatMinimized] = useState(false);
  const [dynamicContent, setDynamicContent] = useState(null);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  // Personalizar actividad cuando se abre
  useEffect(() => {
    const personalizeActivityWithGemini = async () => {
      if (isOpen && activity && userProfile) {
        // Primero aplicar personalización básica
        const personalized = personalizeActivity(activity, userProfile);
        const adjusted = applyAccessibilityAdjustments(personalized, personalized.adjustments);
        
        // Luego generar contenido dinámico con Gemini
        try {
          const geminiResponse = await generateDynamicActivity(
            userProfile,
            activity.subject,
            activity.difficulty,
            activity.title
          );
          
          if (geminiResponse.success) {
            // Combinar personalización básica con contenido de Gemini
            const enhancedActivity = {
              ...adjusted,
              geminiContent: geminiResponse.data,
              dynamicGenerated: true
            };
            setPersonalizedActivity(enhancedActivity);
            setDynamicContent(geminiResponse.data);
          } else {
            // Usar solo personalización básica si Gemini falla
            setPersonalizedActivity(adjusted);
          }
        } catch (error) {
          console.error('Error generando contenido con Gemini:', error);
          setPersonalizedActivity(adjusted);
        }
      }
    };

    personalizeActivityWithGemini();
  }, [isOpen, activity, userProfile]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setShowModeSelection(false);
  };

  const handleComplete = (results) => {
    const finalResults = {
      activityId: activity.id,
      mode: mode,
      results: results,
      completedAt: new Date().toISOString(),
      subject: activity.subject,
      difficulty: activity.difficulty,
      score: results.score,
      timeSpent: results.timeSpent,
      accuracy: results.accuracy
    };
    
    setFinalResults(finalResults);
    setShowResultsPanel(true);
  };

  const handlePause = () => {
    // Implementar lógica de pausa
    console.log('Actividad pausada');
  };

  const handleExit = () => {
    onClose();
  };

  const handleCloseResultsPanel = () => {
    setShowResultsPanel(false);
    onComplete(finalResults);
    onClose();
  };

  const handleStartNewActivity = () => {
    setShowResultsPanel(false);
    onComplete(finalResults);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl">
        {showModeSelection ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-slate-700 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Play className="w-6 h-6 mr-3 text-blue-400" />
                    {activity.title}
                  </h2>
                  <p className="text-gray-300 mt-1">{activity.description}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Selección de Modalidad */}
            <div className="flex-1 p-6 bg-slate-800">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Cómo quieres realizar esta actividad?
                </h3>
                <p className="text-gray-300 mb-4">
                  Elige la modalidad que prefieras para desarrollar tu actividad
                </p>
                
                {/* Botón de Chat con Gemini */}
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={() => setShowGeminiChat(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    💬 Hablar con Kary (Gemini AI)
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Modalidad Gamificada */}
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-blue-500/50"
                  onClick={() => handleModeSelect('gamified')}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">Modalidad Gamificada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-gray-300 space-y-2">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                        <span>Desafíos interactivos</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                        <span>Sistema de puntos y logros</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-400 mr-2" />
                        <span>Vidas y rachas</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-blue-400 mr-2" />
                        <span>Feedback inmediato</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      ¡Jugar Ahora!
                    </Button>
                  </CardContent>
                </Card>

                {/* Modalidad Tradicional */}
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-green-500/50"
                  onClick={() => handleModeSelect('traditional')}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Book className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">Modalidad Tradicional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-gray-300 space-y-2">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-blue-400 mr-2" />
                        <span>Interfaz clásica y familiar</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 text-green-400 mr-2" />
                        <span>Paso a paso estructurado</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-purple-400 mr-2" />
                        <span>Tiempo controlado</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        <span>Revisión detallada</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                      <Book className="w-4 h-4 mr-2" />
                      Comenzar Actividad
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <>
            {mode === 'gamified' && personalizedActivity && (
              <GamifiedActivityMode
                activity={personalizedActivity}
                onComplete={handleComplete}
                onPause={handlePause}
                onExit={handleExit}
              />
            )}
            {mode === 'traditional' && personalizedActivity && (
              <TraditionalActivityMode
                activity={personalizedActivity}
                onComplete={handleComplete}
                onPause={handlePause}
                onExit={handleExit}
              />
            )}
          </>
        )}
      </div>

      {/* Chat con Gemini */}
      <GeminiChatAssistant
        isOpen={showGeminiChat}
        onClose={() => setShowGeminiChat(false)}
        onMinimize={setGeminiChatMinimized}
        isMinimized={geminiChatMinimized}
        context={{
          subject: activity?.subject,
          difficulty: activity?.difficulty,
          progress: currentStep ? ((currentStep + 1) / gameContent.challenges.length) * 100 : 0,
          activityTitle: activity?.title,
          currentChallenge: currentChallenge?.question,
          score: score,
          streak: streak
        }}
      />

      {/* Panel de Resultados con Gemini */}
      <GeminiResultsPanel
        activityResults={finalResults}
        isOpen={showResultsPanel}
        onClose={handleCloseResultsPanel}
        onStartNewActivity={handleStartNewActivity}
      />
    </div>
  );
};

export default ActivityPlayer;
