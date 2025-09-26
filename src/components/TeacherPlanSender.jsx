import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { 
  Send, 
  User, 
  Mail, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  BookOpen,
  Target,
  Brain,
  Activity
} from 'lucide-react';
import jsPDF from 'jspdf';

const TeacherPlanSender = ({ 
  isOpen, 
  onOpenChange, 
  plan, 
  studentData, 
  onPlanSent 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendAsPDF, setSendAsPDF] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Cargar profesores al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadTeachers();
      initializeForm();
    }
  }, [isOpen, plan]);

  const loadTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role')
        .eq('role', 'teacher')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error cargando profesores:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los profesores',
        variant: 'destructive'
      });
    } finally {
      setLoadingTeachers(false);
    }
  };

  const initializeForm = () => {
    if (plan) {
      setSubject(`Plan de Apoyo - ${plan.studentName}`);
      setMessage(`Estimado/a profesor/a,

Le envío el plan de apoyo educativo generado para el estudiante ${plan.studentName}.

Este plan incluye:
- Análisis psicopedagógico detallado
- ${plan.activities?.length || 0} actividades personalizadas
- Estrategias de implementación
- Métricas de seguimiento

Por favor, revise el plan y coordine su implementación según las recomendaciones.

Saludos cordiales,
${authUser?.user_metadata?.full_name || 'Psicopedagogo'}`);
    }
  };

  const generatePlanPDF = () => {
    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Plan de Apoyo Educativo', 20, 30);
    
    // Información del estudiante
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Estudiante', 20, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${plan.studentName}`, 20, 65);
    doc.text(`Fecha de Generación: ${new Date(plan.generatedAt).toLocaleDateString()}`, 20, 75);
    doc.text(`Generado por: ${plan.generatedBy}`, 20, 85);
    
    // Análisis de IA
    if (plan.aiAnalysis) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Análisis Psicopedagógico', 20, 105);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (plan.aiAnalysis.learningProfile) {
        doc.text('Perfil de Aprendizaje:', 20, 120);
        doc.text(`- Estilo: ${plan.aiAnalysis.learningProfile.style || 'No especificado'}`, 30, 130);
        doc.text(`- Atención: ${plan.aiAnalysis.learningProfile.attention || 'No especificado'}`, 30, 140);
      }
      
      if (plan.aiAnalysis.priorityNeeds && plan.aiAnalysis.priorityNeeds.length > 0) {
        doc.text('Necesidades Prioritarias:', 20, 160);
        plan.aiAnalysis.priorityNeeds.forEach((need, index) => {
          doc.text(`- ${need.description} (${need.priority})`, 30, 170 + (index * 10));
        });
      }
    }
    
    // Actividades
    if (plan.activities && plan.activities.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Actividades Generadas', 20, 200);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      plan.activities.forEach((activity, index) => {
        const yPos = 220 + (index * 40);
        doc.text(`${index + 1}. ${activity.title}`, 20, yPos);
        doc.text(`   Duración: ${activity.duration} minutos`, 30, yPos + 10);
        doc.text(`   Dificultad: ${activity.difficulty}`, 30, yPos + 20);
        
        if (yPos > 250) {
          doc.addPage();
        }
      });
    }
    
    // Plan de implementación
    if (plan.implementation) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Plan de Implementación', 20, 30);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (plan.implementation.timeline) {
        doc.text('Cronograma:', 20, 50);
        doc.text(`- Inmediato: ${plan.implementation.timeline.immediate}`, 30, 60);
        doc.text(`- Corto plazo: ${plan.implementation.timeline.shortTerm}`, 30, 70);
        doc.text(`- Largo plazo: ${plan.implementation.timeline.longTerm}`, 30, 80);
      }
      
      if (plan.implementation.resources) {
        doc.text('Recursos Necesarios:', 20, 100);
        if (plan.implementation.resources.materials) {
          doc.text('Materiales:', 30, 110);
          plan.implementation.resources.materials.forEach((material, index) => {
            doc.text(`- ${material}`, 40, 120 + (index * 10));
          });
        }
      }
    }
    
    return doc;
  };

  const handleSend = async () => {
    if (!selectedTeacher && !customEmail) {
      toast({
        title: 'Error',
        description: 'Selecciona un profesor o ingresa un email',
        variant: 'destructive'
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Completa el asunto y el mensaje',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);

    try {
      const recipientEmail = selectedTeacher 
        ? teachers.find(t => t.id === selectedTeacher)?.email 
        : customEmail;

      const recipientName = selectedTeacher 
        ? teachers.find(t => t.id === selectedTeacher)?.full_name 
        : customEmail;

      // Generar PDF si está habilitado
      let pdfAttachment = null;
      if (sendAsPDF) {
        const pdfDoc = generatePlanPDF();
        pdfAttachment = pdfDoc.output('blob');
      }

      // Simular envío (en producción sería una llamada real a un servicio de email)
      const emailData = {
        to: recipientEmail,
        toName: recipientName,
        from: authUser?.email || 'psicopedagogo@kary.com',
        fromName: authUser?.user_metadata?.full_name || 'Psicopedagogo',
        subject: subject,
        message: message,
        attachments: sendAsPDF ? [{
          filename: `Plan_Apoyo_${plan.studentName.replace(/\s+/g, '_')}.pdf`,
          content: pdfAttachment
        }] : [],
        planData: plan,
        studentData: studentData,
        sentAt: new Date().toISOString()
      };

      // Guardar registro del envío en la base de datos
      const { error: insertError } = await supabase
        .from('plan_notifications')
        .insert({
          plan_id: plan.id,
          student_id: plan.studentId,
          teacher_id: selectedTeacher || null,
          teacher_email: recipientEmail,
          teacher_name: recipientName,
          subject: subject,
          message: message,
          sent_as_pdf: sendAsPDF,
          sent_by: authUser?.id,
          sent_at: new Date().toISOString(),
          status: 'sent'
        });

      if (insertError) {
        console.error('Error guardando notificación:', insertError);
      }

      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Plan Enviado',
        description: `Plan de apoyo enviado exitosamente a ${recipientName}`,
        variant: 'default'
      });

      if (onPlanSent) {
        onPlanSent({
          success: true,
          recipient: recipientName,
          email: recipientEmail,
          sentAsPDF: sendAsPDF
        });
      }

      onOpenChange(false);

    } catch (error) {
      console.error('Error enviando plan:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema enviando el plan',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedTeacherData = teachers.find(t => t.id === selectedTeacher);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl h-[95vh] flex flex-col bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="w-6 h-6 text-blue-400" />
            Enviar Plan de Apoyo al Profesor
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Envía el plan de apoyo generado para {plan?.studentName} al profesor correspondiente
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Información del Plan */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información del Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Estudiante</p>
                  <p className="text-white font-medium">{plan?.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Actividades</p>
                  <p className="text-white font-medium">{plan?.activities?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Generado por</p>
                  <p className="text-white font-medium">{plan?.generatedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fecha</p>
                  <p className="text-white font-medium">
                    {plan ? new Date(plan.generatedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selección de Profesor */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seleccionar Profesor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="teacher-select">Profesor</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona un profesor" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {loadingTeachers ? (
                      <SelectItem value="loading" disabled>
                        Cargando profesores...
                      </SelectItem>
                    ) : (
                      teachers.map((teacher) => (
                        <SelectItem 
                          key={teacher.id} 
                          value={teacher.id}
                          className="text-white hover:bg-slate-600"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{teacher.full_name}</span>
                            <span className="text-gray-400">({teacher.email})</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-gray-400">o</div>

              <div>
                <Label htmlFor="custom-email">Email Personalizado</Label>
                <Input
                  id="custom-email"
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="profesor@escuela.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              {selectedTeacherData && (
                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">{selectedTeacherData.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{selectedTeacherData.email}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración del Email */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuración del Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Plan de Apoyo - [Nombre del Estudiante]"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="send-as-pdf"
                  checked={sendAsPDF}
                  onChange={(e) => setSendAsPDF(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-blue-600"
                />
                <Label htmlFor="send-as-pdf" className="text-white">
                  Incluir plan como archivo PDF adjunto
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>El envío será registrado en el sistema</span>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || (!selectedTeacher && !customEmail)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherPlanSender;