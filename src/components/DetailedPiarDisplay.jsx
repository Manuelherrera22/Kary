import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  FileText, 
  Brain, 
  Target, 
  Settings, 
  BookOpen, 
  Users, 
  Heart,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  GraduationCap,
  Activity,
  Eye,
  Hand,
  Clock,
  Zap,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DetailedPiarDisplay = ({ studentId }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [piarService] = useState(() => {
    // Importar el servicio de PIAR
    const { piarService } = require('../services/piarService');
    return piarService;
  });

  const piarData = piarService.getPiarByStudentId(studentId);

  if (!piarData) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">PIAR No Encontrado</h3>
          <p className="text-red-600">No se encontró un PIAR detallado para este estudiante.</p>
        </CardContent>
      </Card>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title, icon: React.ComponentType, content, color = 'blue') => {
    const Icon = icon;
    const isExpanded = expandedSections[title];
    
    const colorClasses = {
      blue: 'border-blue-200 bg-blue-50 text-blue-800',
      green: 'border-green-200 bg-green-50 text-green-800',
      purple: 'border-purple-200 bg-purple-50 text-purple-800',
      orange: 'border-orange-200 bg-orange-50 text-orange-800',
      red: 'border-red-200 bg-red-50 text-red-800',
      indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800'
    };

    return (
      <Card className={`mb-4 ${colorClasses[color]}`}>
        <CardHeader 
          className="cursor-pointer hover:bg-opacity-80 transition-colors"
          onClick={() => toggleSection(title)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-2" />
              {title}
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </CardTitle>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            {content}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6 border-2 border-gradient-to-r from-purple-500 to-blue-500 bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FileText className="w-8 h-8 text-purple-600" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PIAR Detallado - {piarData.studentName}
            </CardTitle>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Brain className="w-4 h-4 mr-1" />
              {piarData.diagnostic}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <GraduationCap className="w-4 h-4 mr-1" />
              {piarData.grade}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Star className="w-4 h-4 mr-1" />
              Prioridad Alta
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Información Básica */}
      {renderSection(
        'Información Básica',
        User,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Datos Personales</h4>
            <p><strong>Nombre:</strong> {piarData.studentName}</p>
            <p><strong>Edad:</strong> {piarData.age} años</p>
            <p><strong>Grado:</strong> {piarData.grade}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Diagnóstico</h4>
            <p><strong>Condición:</strong> {piarData.diagnostic}</p>
            <p><strong>Severidad:</strong> {piarData.diagnosticDetails?.severity}</p>
            <p><strong>Inicio:</strong> {piarData.diagnosticDetails?.onset}</p>
          </div>
        </div>,
        'blue'
      )}

      {/* Fortalezas */}
      {renderSection(
        'Fortalezas Detalladas',
        Star,
        <div className="space-y-2">
          {piarData.strengths.map((strength, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-green-100 rounded">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-800">{strength}</span>
            </div>
          ))}
        </div>,
        'green'
      )}

      {/* Necesidades */}
      {renderSection(
        'Necesidades Específicas',
        Target,
        <div className="space-y-2">
          {piarData.needs.map((need, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-orange-100 rounded">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <span className="text-orange-800">{need}</span>
            </div>
          ))}
        </div>,
        'orange'
      )}

      {/* Objetivos */}
      {renderSection(
        'Objetivos por Período',
        Calendar,
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Corto Plazo (1-3 meses)
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.objectives.shortTerm.map((obj, index) => (
                <li key={index} className="text-blue-600">• {obj}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Mediano Plazo (3-6 meses)
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.objectives.mediumTerm.map((obj, index) => (
                <li key={index} className="text-green-600">• {obj}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Largo Plazo (6-12 meses)
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.objectives.longTerm.map((obj, index) => (
                <li key={index} className="text-purple-600">• {obj}</li>
              ))}
            </ul>
          </div>
        </div>,
        'purple'
      )}

      {/* Adaptaciones */}
      {renderSection(
        'Adaptaciones Específicas',
        Settings,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {piarData.adaptations.map((adaptation, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-indigo-100 rounded">
              <Settings className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span className="text-indigo-800 text-sm">{adaptation}</span>
            </div>
          ))}
        </div>,
        'indigo'
      )}

      {/* Recursos */}
      {renderSection(
        'Recursos Especializados',
        BookOpen,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {piarData.resources.map((resource, index) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-red-100 rounded">
              <BookOpen className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-800 text-sm">{resource}</span>
            </div>
          ))}
        </div>,
        'red'
      )}

      {/* Estilo de Aprendizaje e Intereses */}
      {renderSection(
        'Perfil de Aprendizaje',
        Brain,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Estilo de Aprendizaje</h4>
            <p className="text-blue-600">{piarData.learningStyle}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Intereses</h4>
            <div className="flex flex-wrap gap-1">
              {piarData.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-blue-600 border-blue-300">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Motivadores</h4>
            <ul className="space-y-1">
              {piarData.motivators.map((motivator, index) => (
                <li key={index} className="text-green-600">• {motivator}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Triggers</h4>
            <ul className="space-y-1">
              {piarData.triggers.map((trigger, index) => (
                <li key={index} className="text-red-600">• {trigger}</li>
              ))}
            </ul>
          </div>
        </div>,
        'blue'
      )}

      {/* Metas por Materia */}
      {renderSection(
        'Metas por Materia',
        GraduationCap,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(piarData.subjectGoals).map(([subject, goals]) => (
            <div key={subject} className="p-3 bg-gray-100 rounded">
              <h4 className="font-semibold text-gray-800 mb-2 capitalize">{subject}</h4>
              <ul className="space-y-1">
                {goals.map((goal, index) => (
                  <li key={index} className="text-gray-600 text-sm">• {goal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>,
        'green'
      )}

      {/* Colaboración */}
      {renderSection(
        'Colaboración Detallada',
        Users,
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              Familia
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.collaboration.family.map((item, index) => (
                <li key={index} className="text-blue-600">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              Profesores
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.collaboration.teachers.map((item, index) => (
                <li key={index} className="text-green-600">• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Especialistas
            </h4>
            <ul className="space-y-1 ml-4">
              {piarData.collaboration.professionals.map((item, index) => (
                <li key={index} className="text-purple-600">• {item}</li>
              ))}
            </ul>
          </div>
        </div>,
        'purple'
      )}

      {/* Evaluación */}
      {renderSection(
        'Sistema de Evaluación',
        Activity,
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Frecuencia: {piarData.evaluation.frequency}</h4>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Métodos de Evaluación</h4>
            <ul className="space-y-1 ml-4">
              {piarData.evaluation.methods.map((method, index) => (
                <li key={index} className="text-blue-600">• {method}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Indicadores de Progreso</h4>
            <ul className="space-y-1 ml-4">
              {piarData.evaluation.indicators.map((indicator, index) => (
                <li key={index} className="text-green-600">• {indicator}</li>
              ))}
            </ul>
          </div>
        </div>,
        'orange'
      )}

      {/* Información Médica */}
      {renderSection(
        'Seguimiento Médico',
        Heart,
        <div className="space-y-2">
          <p><strong>Medicación:</strong> {piarData.medicalInfo?.medication}</p>
          <p><strong>Última Evaluación:</strong> {piarData.medicalInfo?.lastEvaluation}</p>
          <p><strong>Próxima Cita:</strong> {piarData.medicalInfo?.nextAppointment}</p>
          <p><strong>Consideraciones:</strong> {piarData.medicalInfo?.specialConsiderations}</p>
        </div>,
        'red'
      )}

      {/* Resumen */}
      <Card className="mt-6 border-2 border-gradient-to-r from-green-500 to-blue-500 bg-gradient-to-r from-green-50 via-blue-50 to-green-50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-8 h-8 text-green-600" />
            <h3 className="text-xl font-bold text-green-800">PIAR Espectacular Implementado</h3>
            <Star className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-700 mb-4">
            Este PIAR detallado contiene <strong>{piarData.strengths.length} fortalezas</strong>, 
            <strong> {piarData.needs.length} necesidades específicas</strong>, 
            <strong> {piarData.adaptations.length} adaptaciones</strong>, y 
            <strong> {piarData.resources.length} recursos especializados</strong>.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-4 h-4 mr-1" />
              Listo para IA
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Brain className="w-4 h-4 mr-1" />
              Personalización Total
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Award className="w-4 h-4 mr-1" />
              Plan Espectacular
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedPiarDisplay;
