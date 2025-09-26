import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  Calendar, 
  Target, 
  Users, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  Brain,
  Activity,
  Clock,
  User,
  Mail,
  Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import TeacherPlanSender from './TeacherPlanSender';

const SupportPlanViewer = ({ 
  plan, 
  studentData, 
  isOpen, 
  onClose, 
  onPlanSent 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showTeacherSender, setShowTeacherSender] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !plan) return null;

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 30;
      
      // Función helper para agregar texto con wrap
      const addText = (text, x, y, maxWidth = 170) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * 5);
      };
      
      // Función helper para nueva página
      const checkNewPage = (requiredSpace = 20) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      };
      
      // Portada
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PLAN DE APOYO EDUCATIVO', 20, yPosition);
      yPosition += 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`Estudiante: ${plan.studentName}`, 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.text(`Fecha de Generación: ${new Date(plan.generatedAt).toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Generado por: ${plan.generatedBy}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Versión: ${plan.version || '1.0'}`, 20, yPosition);
      yPosition += 20;
      
      // Información del estudiante
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL ESTUDIANTE', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(`Nombre Completo: ${plan.studentName}`, 20, yPosition);
      yPosition = addText(`ID del Estudiante: ${plan.studentId}`, 20, yPosition);
      yPosition = addText(`Fecha de Nacimiento: ${studentData?.date_of_birth || 'No especificada'}`, 20, yPosition);
      yPosition = addText(`Grado: ${studentData?.grade || 'No especificado'}`, 20, yPosition);
      yPosition += 10;
      
      // Análisis psicopedagógico avanzado
      if (plan.aiAnalysis) {
        doc.addPage();
        yPosition = 30;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ANÁLISIS PSICOPEDAGÓGICO AVANZADO', 20, yPosition);
        yPosition += 20;
        
        // Perfil neuropsicológico
        if (plan.aiAnalysis.neuropsychologicalProfile) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('PERFIL NEUROPSICOLÓGICO', 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          if (plan.aiAnalysis.neuropsychologicalProfile.cognitiveStrengths) {
            doc.text('Fortalezas Cognitivas:', 20, yPosition);
            yPosition += 10;
            plan.aiAnalysis.neuropsychologicalProfile.cognitiveStrengths.forEach((strength, index) => {
              checkNewPage();
              yPosition = addText(`${index + 1}. ${strength.domain}: ${strength.description}`, 30, yPosition);
              yPosition = addText(`   Evidencia: ${strength.evidence}`, 35, yPosition);
              yPosition += 5;
            });
          }
          
          if (plan.aiAnalysis.neuropsychologicalProfile.cognitiveChallenges) {
            doc.text('Desafíos Cognitivos:', 20, yPosition);
            yPosition += 10;
            plan.aiAnalysis.neuropsychologicalProfile.cognitiveChallenges.forEach((challenge, index) => {
              checkNewPage();
              yPosition = addText(`${index + 1}. ${challenge.domain}: ${challenge.description}`, 30, yPosition);
              yPosition = addText(`   Impacto: ${challenge.impact}`, 35, yPosition);
              yPosition = addText(`   Intervención: ${challenge.intervention}`, 35, yPosition);
              yPosition += 5;
            });
          }
        }
        
        // Necesidades prioritarias
        if (plan.aiAnalysis.priorityNeeds) {
          doc.addPage();
          yPosition = 30;
          
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('NECESIDADES PRIORITARIAS', 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          plan.aiAnalysis.priorityNeeds.forEach((need, index) => {
            checkNewPage();
            yPosition = addText(`${index + 1}. ${need.description}`, 20, yPosition);
            yPosition = addText(`   Categoría: ${need.category}`, 30, yPosition);
            yPosition = addText(`   Prioridad: ${need.priority}`, 30, yPosition);
            yPosition = addText(`   Evidencia: ${need.evidence}`, 30, yPosition);
            yPosition = addText(`   Impacto: ${need.impact}`, 30, yPosition);
            yPosition += 10;
          });
        }
      }
      
      // Actividades detalladas
      if (plan.activities && plan.activities.length > 0) {
        doc.addPage();
        yPosition = 30;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVIDADES EDUCATIVAS ESPECÍFICAS', 20, yPosition);
        yPosition += 20;
        
        plan.activities.forEach((activity, index) => {
          checkNewPage(30);
          
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${activity.title}`, 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          yPosition = addText(`Descripción: ${activity.description}`, 20, yPosition);
          yPosition = addText(`Objetivo: ${activity.objective}`, 20, yPosition);
          yPosition = addText(`Duración: ${activity.duration} minutos`, 20, yPosition);
          yPosition = addText(`Dificultad: ${activity.difficulty}`, 20, yPosition);
          yPosition = addText(`Prioridad: ${activity.priority}`, 20, yPosition);
          yPosition = addText(`Categoría: ${activity.category}`, 20, yPosition);
          
          // Materiales
          if (activity.materials) {
            doc.text('Materiales Necesarios:', 20, yPosition);
            yPosition += 10;
            
            if (Array.isArray(activity.materials)) {
              activity.materials.forEach((material, matIndex) => {
                if (typeof material === 'object') {
                  yPosition = addText(`- ${material.name}: ${material.description}`, 30, yPosition);
                  yPosition = addText(`  Cantidad: ${material.quantity}`, 35, yPosition);
                  if (material.alternative) {
                    yPosition = addText(`  Alternativa: ${material.alternative}`, 35, yPosition);
                  }
                } else {
                  yPosition = addText(`- ${material}`, 30, yPosition);
                }
              });
            } else {
              // Si es string, mostrarlo directamente
              yPosition = addText(`- ${activity.materials}`, 30, yPosition);
            }
          }
          
          // Adaptaciones
          if (activity.adaptations) {
            doc.text('Adaptaciones:', 20, yPosition);
            yPosition += 10;
            
            if (Array.isArray(activity.adaptations)) {
              activity.adaptations.forEach((adaptation, adaptIndex) => {
                if (typeof adaptation === 'object') {
                  yPosition = addText(`- ${adaptation.type}: ${adaptation.description}`, 30, yPosition);
                  yPosition = addText(`  Justificación: ${adaptation.rationale}`, 35, yPosition);
                } else {
                  yPosition = addText(`- ${adaptation}`, 30, yPosition);
                }
              });
            } else {
              // Si es string, mostrarlo directamente
              yPosition = addText(`- ${activity.adaptations}`, 30, yPosition);
            }
          }
          
          // Instrucciones
          if (activity.instructions) {
            doc.text('Instrucciones:', 20, yPosition);
            yPosition += 10;
            if (activity.instructions.preparation) {
              yPosition = addText(`Preparación: ${activity.instructions.preparation}`, 30, yPosition);
            }
            if (activity.instructions.implementation) {
              doc.text('Implementación:', 30, yPosition);
              yPosition += 10;
              activity.instructions.implementation.forEach((step, stepIndex) => {
                yPosition = addText(`${stepIndex + 1}. ${step}`, 35, yPosition);
              });
            }
          }
          
          // Evaluación
          if (activity.assessment) {
            doc.text('Evaluación:', 20, yPosition);
            yPosition += 10;
            if (activity.assessment.criteria) {
              doc.text('Criterios:', 30, yPosition);
              yPosition += 10;
              activity.assessment.criteria.forEach((criterion, critIndex) => {
                yPosition = addText(`- ${criterion}`, 35, yPosition);
              });
            }
          }
          
          yPosition += 15;
        });
      }
      
      // Plan de implementación
      if (plan.supportPlan) {
        doc.addPage();
        yPosition = 30;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('PLAN DE IMPLEMENTACIÓN', 20, yPosition);
        yPosition += 20;
        
        // Cronograma
        if (plan.supportPlan.implementation?.timeline) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('CRONOGRAMA', 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          yPosition = addText(`Inmediato (0-2 semanas): ${plan.supportPlan.implementation.timeline.immediate}`, 20, yPosition);
          yPosition = addText(`Corto Plazo (1-3 meses): ${plan.supportPlan.implementation.timeline.shortTerm}`, 20, yPosition);
          yPosition = addText(`Largo Plazo (3-12 meses): ${plan.supportPlan.implementation.timeline.longTerm}`, 20, yPosition);
          yPosition = addText(`Revisión: ${plan.supportPlan.implementation.timeline.review}`, 20, yPosition);
          yPosition += 10;
        }
        
        // Recursos
        if (plan.supportPlan.implementation?.resources) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('RECURSOS NECESARIOS', 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          if (plan.supportPlan.implementation.resources.materials) {
            doc.text('Materiales:', 20, yPosition);
            yPosition += 10;
            
            if (Array.isArray(plan.supportPlan.implementation.resources.materials)) {
              plan.supportPlan.implementation.resources.materials.forEach((material, index) => {
                yPosition = addText(`- ${material}`, 30, yPosition);
              });
            } else {
              // Si es string, mostrarlo directamente
              yPosition = addText(`- ${plan.supportPlan.implementation.resources.materials}`, 30, yPosition);
            }
            yPosition += 5;
          }
          
          if (plan.supportPlan.implementation.resources.personnel) {
            doc.text('Personal:', 20, yPosition);
            yPosition += 10;
            
            if (Array.isArray(plan.supportPlan.implementation.resources.personnel)) {
              plan.supportPlan.implementation.resources.personnel.forEach((person, index) => {
                yPosition = addText(`- ${person}`, 30, yPosition);
              });
            } else {
              // Si es string, mostrarlo directamente
              yPosition = addText(`- ${plan.supportPlan.implementation.resources.personnel}`, 30, yPosition);
            }
            yPosition += 5;
          }
        }
      }
      
      // Métricas de éxito
      if (plan.supportPlan?.successMetrics) {
        doc.addPage();
        yPosition = 30;
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('MÉTRICAS DE ÉXITO', 20, yPosition);
        yPosition += 20;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        Object.entries(plan.supportPlan.successMetrics).forEach(([category, metrics]) => {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}:`, 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          metrics.forEach((metric, index) => {
            if (typeof metric === 'object') {
              yPosition = addText(`${index + 1}. ${metric.metric || metric}`, 30, yPosition);
              if (metric.baseline) {
                yPosition = addText(`   Línea Base: ${metric.baseline}`, 35, yPosition);
              }
              if (metric.target) {
                yPosition = addText(`   Objetivo: ${metric.target}`, 35, yPosition);
              }
            } else {
              yPosition = addText(`${index + 1}. ${metric}`, 30, yPosition);
            }
          });
          yPosition += 10;
        });
      }
      
      // Guardar el PDF
      const fileName = `Plan_Apoyo_Avanzado_${plan.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: 'PDF Avanzado Generado',
        description: `Plan de apoyo detallado exportado como ${fileName}`,
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema generando el PDF',
        variant: 'destructive'
      });
    }
  };

  const handleSendToTeacher = () => {
    setShowTeacherSender(true);
  };

  const handlePlanSent = (result) => {
    setShowTeacherSender(false);
    if (onPlanSent) {
      onPlanSent(result);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Plan de Apoyo Generado</h2>
              <p className="text-sm text-gray-400">{plan.studentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Generado por IA
            </Badge>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cerrar
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
                <Eye className="w-4 h-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-gray-300 data-[state=active]:text-white">
                <Brain className="w-4 h-4 mr-2" />
                Análisis
              </TabsTrigger>
              <TabsTrigger value="activities" className="text-gray-300 data-[state=active]:text-white">
                <Activity className="w-4 h-4 mr-2" />
                Actividades
              </TabsTrigger>
              <TabsTrigger value="implementation" className="text-gray-300 data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Implementación
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-gray-300 data-[state=active]:text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Métricas
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Resumen */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Estudiante</p>
                        <p className="text-white font-medium">{plan.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Fecha de Generación</p>
                        <p className="text-white font-medium">
                          {new Date(plan.generatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Generado por</p>
                        <p className="text-white font-medium">{plan.generatedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total de Actividades</p>
                        <p className="text-white font-medium">{plan.activities?.length || 0}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Descripción</p>
                      <p className="text-white">{plan.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Acciones */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Acciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        onClick={generatePDF}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar PDF
                      </Button>
                      <Button
                        onClick={handleSendToTeacher}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar al Profesor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Análisis */}
              <TabsContent value="analysis" className="space-y-6">
                {plan.aiAnalysis && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Análisis Psicopedagógico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {plan.aiAnalysis.learningProfile && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Perfil de Aprendizaje</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Estilo de Aprendizaje</p>
                              <p className="text-white">{plan.aiAnalysis.learningProfile.style || 'No especificado'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Capacidad de Atención</p>
                              <p className="text-white">{plan.aiAnalysis.learningProfile.attention || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {plan.aiAnalysis.priorityNeeds && plan.aiAnalysis.priorityNeeds.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Necesidades Prioritarias</h4>
                          <div className="space-y-2">
                            {plan.aiAnalysis.priorityNeeds.map((need, index) => (
                              <div key={index} className="p-3 bg-slate-700 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <p className="text-white font-medium">{need.description}</p>
                                  <Badge className={`${
                                    need.priority === 'high' ? 'bg-red-600' :
                                    need.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                                  } text-white`}>
                                    {need.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{need.category}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.aiAnalysis.strengths && plan.aiAnalysis.strengths.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Fortalezas Identificadas</h4>
                          <div className="space-y-2">
                            {plan.aiAnalysis.strengths.map((strength, index) => (
                              <div key={index} className="p-3 bg-slate-700 rounded-lg">
                                <p className="text-white font-medium">{strength.area}</p>
                                <p className="text-sm text-gray-400">{strength.description}</p>
                                <p className="text-sm text-blue-400 mt-1">{strength.utilization}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Actividades */}
              <TabsContent value="activities" className="space-y-6">
                {plan.activities && plan.activities.length > 0 ? (
                  <div className="space-y-4">
                    {plan.activities.map((activity, index) => (
                      <Card key={index} className="bg-slate-800 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            {activity.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-300">{activity.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Duración</p>
                              <p className="text-white font-medium">{activity.duration} minutos</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Dificultad</p>
                              <p className="text-white font-medium">{activity.difficulty}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Prioridad</p>
                              <Badge className={`${
                                activity.priority === 'high' ? 'bg-red-600' :
                                activity.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                              } text-white`}>
                                {activity.priority}
                              </Badge>
                            </div>
                          </div>

                          {activity.materials && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Materiales</p>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(activity.materials) ? (
                                  activity.materials.map((material, matIndex) => (
                                    <Badge key={matIndex} variant="outline" className="border-slate-600 text-gray-300">
                                      {material}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="outline" className="border-slate-600 text-gray-300">
                                    {activity.materials}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {activity.adaptations && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Adaptaciones</p>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(activity.adaptations) ? (
                                  activity.adaptations.map((adaptation, adaptIndex) => (
                                    <Badge key={adaptIndex} variant="outline" className="border-blue-600 text-blue-300">
                                      {adaptation}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="outline" className="border-blue-600 text-blue-300">
                                    {activity.adaptations}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {activity.aiInsights && (
                            <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                              <p className="text-sm text-blue-300">
                                <Brain className="w-4 h-4 inline mr-2" />
                                {activity.aiInsights}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center">
                      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No hay actividades</h3>
                      <p className="text-gray-400">No se generaron actividades para este plan</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Implementación */}
              <TabsContent value="implementation" className="space-y-6">
                {plan.implementation && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Plan de Implementación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {plan.implementation.timeline && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Cronograma</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Inmediato</p>
                              <p className="text-white">{plan.implementation.timeline.immediate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Corto Plazo</p>
                              <p className="text-white">{plan.implementation.timeline.shortTerm}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Largo Plazo</p>
                              <p className="text-white">{plan.implementation.timeline.longTerm}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Revisión</p>
                              <p className="text-white">{plan.implementation.timeline.review}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {plan.implementation.resources && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Recursos Necesarios</h4>
                          <div className="space-y-4">
                            {plan.implementation.resources.materials && (
                              <div>
                                <p className="text-sm text-gray-400 mb-2">Materiales</p>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(plan.implementation.resources.materials) ? (
                                    plan.implementation.resources.materials.map((material, index) => (
                                      <Badge key={index} variant="outline" className="border-slate-600 text-gray-300">
                                        {material}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="outline" className="border-slate-600 text-gray-300">
                                      {plan.implementation.resources.materials}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {plan.implementation.resources.personnel && (
                              <div>
                                <p className="text-sm text-gray-400 mb-2">Personal</p>
                                <div className="flex flex-wrap gap-2">
                                  {Array.isArray(plan.implementation.resources.personnel) ? (
                                    plan.implementation.resources.personnel.map((person, index) => (
                                      <Badge key={index} variant="outline" className="border-green-600 text-green-300">
                                        {person}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="outline" className="border-green-600 text-green-300">
                                      {plan.implementation.resources.personnel}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Métricas */}
              <TabsContent value="metrics" className="space-y-6">
                {plan.successMetrics && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Métricas de Éxito
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(plan.successMetrics).map(([category, metrics]) => (
                        <div key={category}>
                          <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <div className="space-y-2">
                            {metrics.map((metric, index) => (
                              <div key={index} className="p-3 bg-slate-700 rounded-lg">
                                <p className="text-white">{metric}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Teacher Sender Modal */}
      {showTeacherSender && (
        <TeacherPlanSender
          isOpen={showTeacherSender}
          onOpenChange={setShowTeacherSender}
          plan={plan}
          studentData={studentData}
          onPlanSent={handlePlanSent}
        />
      )}
    </div>
  );
};

export default SupportPlanViewer;
