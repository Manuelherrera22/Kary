import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Target,
  Clock,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AIInsightsPanel = ({ students, onInsightAction }) => {
  const { t } = useLanguage();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState(null);

  useEffect(() => {
    generateInsights();
  }, [students]);

  const generateInsights = async () => {
    setIsLoading(true);
    // Simular generación de insights con IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockInsights = [
      {
        id: 1,
        type: 'performance',
        priority: 'high',
        title: t('teacherDashboard.aiInsights.performanceTitle', 'Patrón de Rendimiento Detectado'),
        description: t('teacherDashboard.aiInsights.performanceDesc', 'María muestra mejor rendimiento en actividades matutinas. Considera programar tareas complejas antes del mediodía.'),
        students: ['María García'],
        action: 'schedule_optimization',
        confidence: 87,
        icon: TrendingUp,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30'
      },
      {
        id: 2,
        type: 'emotional',
        priority: 'medium',
        title: t('teacherDashboard.aiInsights.emotionalTitle', 'Seguimiento Emocional Sugerido'),
        description: t('teacherDashboard.aiInsights.emotionalDesc', 'Se detectó un patrón de ansiedad los lunes. Implementa actividades de relajación al inicio de la semana.'),
        students: ['María García'],
        action: 'emotional_support',
        confidence: 72,
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30'
      },
      {
        id: 3,
        type: 'learning',
        priority: 'high',
        title: t('teacherDashboard.aiInsights.learningTitle', 'Estrategia de Aprendizaje Personalizada'),
        description: t('teacherDashboard.aiInsights.learningDesc', 'María responde mejor a contenido visual. Aumenta el uso de diagramas, imágenes y videos en sus actividades.'),
        students: ['María García'],
        action: 'adapt_content',
        confidence: 91,
        icon: Lightbulb,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30'
      },
      {
        id: 4,
        type: 'group',
        priority: 'low',
        title: t('teacherDashboard.aiInsights.groupTitle', 'Oportunidad de Colaboración'),
        description: t('teacherDashboard.aiInsights.groupDesc', 'Los estudiantes podrían beneficiarse de actividades grupales. Considera crear proyectos colaborativos.'),
        students: ['Todos'],
        action: 'group_activities',
        confidence: 65,
        icon: Users,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30'
      }
    ];
    
    setInsights(mockInsights);
    setIsLoading(false);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{t('common.highPriority', 'Alta')}</Badge>;
      case 'medium': return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{t('common.mediumPriority', 'Media')}</Badge>;
      case 'low': return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{t('common.lowPriority', 'Baja')}</Badge>;
      default: return null;
    }
  };

  const handleInsightAction = (insight) => {
    if (onInsightAction) {
      onInsightAction(insight);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <Brain size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-purple-300">
                {t('teacherDashboard.aiInsights.title', 'Insights de IA')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('teacherDashboard.aiInsights.subtitle', 'Analizando patrones de aprendizaje...')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-pink-500" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <Brain size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-purple-300">
                {t('teacherDashboard.aiInsights.title', 'Insights de IA')}
              </CardTitle>
              <p className="text-sm text-slate-400">
                {t('teacherDashboard.aiInsights.subtitle', 'Recomendaciones personalizadas para tus estudiantes')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            className="text-slate-400 hover:text-slate-200"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = insight.icon;
              const isExpanded = expandedInsight === insight.id;
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border ${insight.bgColor} ${insight.borderColor} cursor-pointer hover:opacity-90 transition-all duration-200`}
                  onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${insight.bgColor} border ${insight.borderColor} flex-shrink-0`}>
                      <Icon size={16} className={insight.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-200 text-sm">{insight.title}</h4>
                            {getPriorityBadge(insight.priority)}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="text-xs text-slate-400">
                            {insight.confidence}% {t('teacherDashboard.aiInsights.confidence', 'confianza')}
                          </div>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-slate-600/50"
                        >
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-medium text-slate-300">
                                {t('teacherDashboard.aiInsights.affectedStudents', 'Estudiantes afectados')}:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {insight.students.map((student, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {student}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInsightAction(insight);
                                }}
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                <Target size={14} className="mr-1" />
                                {t('teacherDashboard.aiInsights.implement', 'Implementar')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Marcar como vista
                                }}
                                className="text-slate-300 border-slate-600 hover:bg-slate-700"
                              >
                                <Clock size={14} className="mr-1" />
                                {t('teacherDashboard.aiInsights.remindLater', 'Recordar después')}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Brain size={48} className="text-slate-500 mx-auto mb-4" />
            <p className="text-lg">{t('teacherDashboard.aiInsights.noInsights', 'No hay insights disponibles')}</p>
            <p className="text-sm mt-2">{t('teacherDashboard.aiInsights.noInsightsDesc', 'Los insights aparecerán conforme se recopile más información')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;



