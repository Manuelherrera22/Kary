import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { sendSupportPlanToTeacher } from '@/services/teacherCommunicationService';
import { 
  Send, 
  User, 
  Mail, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  Activity
} from 'lucide-react';

const TeacherPlanSender = ({ generatedPlan, onPlanSent, onCancel }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Mock de profesores disponibles
  const availableTeachers = [
    { id: 'teacher-1', name: 'María González', email: 'maria.gonzalez@kary.edu', subject: 'Matemáticas' },
    { id: 'teacher-2', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@kary.edu', subject: 'Español' },
    { id: 'teacher-3', name: 'Ana Martínez', email: 'ana.martinez@kary.edu', subject: 'Ciencias' },
    { id: 'teacher-4', name: 'Luis Fernández', email: 'luis.fernandez@kary.edu', subject: 'Historia' }
  ];

  const handleSendPlan = async () => {
    if (!selectedTeacher) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un docente',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      const selectedTeacherData = availableTeachers.find(t => t.id === selectedTeacher);
      
      const result = await sendSupportPlanToTeacher(
        generatedPlan, 
        selectedTeacher, 
        generatedPlan.studentId
      );

      if (result.success) {
        setSendSuccess(true);
        
        toast({
          title: '✅ Plan Enviado',
          description: `Plan de apoyo enviado exitosamente a ${selectedTeacherData.name}`,
          variant: 'default',
        });

        if (onPlanSent) {
          onPlanSent(result.communication);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error enviando plan:', error);
      toast({
        title: 'Error',
        description: 'Hubo un problema enviando el plan. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      default: return 'Baja';
    }
  };

  if (sendSuccess) {
    return (
      <Card className="bg-green-900/20 border-green-700">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            ¡Plan Enviado Exitosamente!
          </h3>
          <p className="text-gray-300 mb-4">
            El plan de apoyo ha sido enviado al docente y estará disponible en su dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-green-500 text-green-300 hover:bg-green-700"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!generatedPlan) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No hay plan generado
          </h3>
          <p className="text-gray-400">
            Primero debes generar un plan de apoyo con IA antes de enviarlo al docente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen del Plan */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-400" />
            Resumen del Plan de Apoyo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-400 mr-2" />
              <div>
                <span className="text-gray-400 text-sm">Estudiante:</span>
                <p className="text-white font-medium">{generatedPlan.studentName}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-green-400 mr-2" />
              <div>
                <span className="text-gray-400 text-sm">Actividades:</span>
                <p className="text-white font-medium">{generatedPlan.activities.length} generadas</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Target className="w-5 h-5 text-purple-400 mr-2" />
              <div>
                <span className="text-gray-400 text-sm">Prioridad:</span>
                <Badge className={`ml-2 ${getPriorityColor(generatedPlan.implementation.priority)}`}>
                  {getPriorityText(generatedPlan.implementation.priority)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Necesidades Principales:</h4>
            <ul className="space-y-1">
              {generatedPlan.aiAnalysis.priorityNeeds.slice(0, 3).map((need, index) => (
                <li key={index} className="text-gray-300 text-sm">
                  • {need.description} ({need.priority})
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Envío */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Send className="w-6 h-6 mr-3 text-purple-400" />
            Enviar Plan al Docente
          </CardTitle>
          <p className="text-gray-400">
            Selecciona el docente y personaliza el mensaje antes de enviar
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selección de Docente */}
          <div className="space-y-2">
            <Label className="text-white">Docente Destinatario</Label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar docente..." />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-500">{teacher.subject} • {teacher.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mensaje Personalizado */}
          <div className="space-y-2">
            <Label className="text-white">Mensaje Personalizado (Opcional)</Label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Agrega un mensaje personalizado para el docente..."
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          {/* Información de Envío */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Información de Envío
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• El plan será enviado al dashboard del docente</p>
              <p>• Incluirá análisis de IA y actividades personalizadas</p>
              <p>• El docente recibirá notificación inmediata</p>
              <p>• Timeline de implementación: {generatedPlan.implementation.timeline.shortTerm}</p>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSendPlan}
              disabled={isSending || !selectedTeacher}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isSending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Plan al Docente
                </>
              )}
            </Button>
            
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-slate-500 text-gray-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherPlanSender;
