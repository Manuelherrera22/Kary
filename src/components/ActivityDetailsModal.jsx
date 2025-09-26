import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Clock, 
  Target, 
  BookOpen, 
  User, 
  Brain, 
  CheckCircle,
  FileText,
  Calendar,
  Award,
  Lightbulb,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityDetailsModal = ({ activity, plan, onClose, onAssignToStudent }) => {
  if (!activity) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-600 text-green-100';
      case 'Intermedio': return 'bg-yellow-600 text-yellow-100';
      case 'Avanzado': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-600 text-red-100';
      case 'Media': return 'bg-yellow-600 text-yellow-100';
      case 'Baja': return 'bg-green-600 text-green-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-gray-700 shadow-2xl"
      >
        {/* Header */}
        <CardHeader className="bg-gray-800 border-b-4 border-gray-600">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Detalles de la Actividad
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-200 hover:text-white hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="bg-gray-900 p-6 space-y-6">
          {/* Activity Title and Basic Info */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
              <h2 className="text-2xl font-bold text-white mb-2">{activity.title}</h2>
              <p className="text-gray-100 text-lg">{activity.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center bg-gray-800 p-3 rounded-lg border-4 border-gray-600">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-200">Duración</p>
                  <p className="text-white font-medium">{activity.duration} minutos</p>
                </div>
              </div>
              <div className="flex items-center bg-gray-800 p-3 rounded-lg border-4 border-gray-600">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-200">Dificultad</p>
                  <Badge className={getDifficultyColor(activity.difficulty)}>
                    {activity.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center bg-gray-800 p-3 rounded-lg border-4 border-gray-600">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-200">Prioridad</p>
                  <Badge className={getPriorityColor(activity.priority)}>
                    {activity.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center bg-gray-800 p-3 rounded-lg border-4 border-gray-600">
                <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                <div>
                  <p className="text-sm text-gray-200">Materia</p>
                  <p className="text-white font-medium">{activity.subject}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-400" />
              Objetivo de la Actividad
            </h3>
            <p className="text-gray-100 bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
              {activity.objective}
            </p>
          </div>

          {/* Materials */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-400" />
              Materiales Necesarios
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
              {Array.isArray(activity.materials) ? (
                <ul className="space-y-2">
                  {activity.materials.map((material, index) => (
                    <li key={index} className="flex items-center text-gray-100">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      {material}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-100">{activity.materials}</p>
              )}
            </div>
          </div>

          {/* Adaptations */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-green-400" />
              Adaptaciones Específicas
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
              <p className="text-gray-100">{activity.adaptations}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              Instrucciones Paso a Paso
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
              <div className="text-gray-100 whitespace-pre-line">
                {activity.instructions}
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Método de Evaluación
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
              <p className="text-gray-100">{activity.assessment}</p>
            </div>
          </div>

          {/* Student Information */}
          {plan && (
            <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Información del Estudiante
              </h3>
              <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-200">Nombre</p>
                    <p className="text-white font-medium">{plan.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">Grado</p>
                    <p className="text-white font-medium">{plan.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">Plan de Apoyo</p>
                    <p className="text-white font-medium">{plan.planTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">Generado por</p>
                    <p className="text-white font-medium">{plan.generatedBy}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Generation Info */}
          {activity.aiGenerated && (
            <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                Información de Generación con IA
              </h3>
              <div className="bg-gray-700 p-4 rounded-lg border-4 border-gray-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-200">Generado por</p>
                    <p className="text-white font-medium">{activity.generatedBy || 'Gemini AI'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">Fecha de generación</p>
                    <p className="text-white font-medium">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.basedOnPlan && (
                    <div>
                      <p className="text-sm text-gray-200">Basado en plan</p>
                      <p className="text-white font-medium">{activity.basedOnPlan}</p>
                    </div>
                  )}
                  {activity.basedOnRecommendations && (
                    <div>
                      <p className="text-sm text-gray-200">Recomendaciones aplicadas</p>
                      <p className="text-white font-medium">
                        {activity.basedOnRecommendations.length} recomendaciones
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-gray-800 p-4 rounded-lg border-4 border-gray-600">
            <div className="flex items-center justify-between pt-4 border-t-4 border-gray-500">
              <div className="flex items-center gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-500 text-gray-200 hover:bg-gray-700 hover:text-white"
                >
                  Cerrar
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => onAssignToStudent(activity, plan)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Asignar a {plan?.studentName || 'Estudiante'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};

export default ActivityDetailsModal;
