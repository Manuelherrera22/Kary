import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Target, 
  Heart, 
  Users, 
  Settings, 
  BookOpen,
  CheckCircle,
  ArrowRight,
  Brain,
  Star
} from 'lucide-react';

const PiarBasedPlanDisplay = ({ supportPlan, piarData, studentData }) => {
  if (!piarData || !supportPlan) {
    return null;
  }

  const piarConnections = [
    {
      piarElement: 'Diagnóstico',
      piarValue: piarData.diagnostic,
      planConnection: 'Análisis psicopedagógico basado en diagnóstico específico',
      icon: Brain,
      color: 'purple'
    },
    {
      piarElement: 'Fortalezas',
      piarValue: piarData.strengths.slice(0, 3).join(', '),
      planConnection: 'Estrategias que aprovechan las fortalezas identificadas',
      icon: Star,
      color: 'green'
    },
    {
      piarElement: 'Necesidades',
      piarValue: piarData.needs.slice(0, 3).join(', '),
      planConnection: 'Objetivos específicos para abordar cada necesidad',
      icon: Target,
      color: 'blue'
    },
    {
      piarElement: 'Objetivos PIAR',
      piarValue: `${piarData.objectives.shortTerm.length} objetivos corto plazo`,
      planConnection: 'Plan alineado con objetivos ya establecidos en PIAR',
      icon: CheckCircle,
      color: 'orange'
    },
    {
      piarElement: 'Adaptaciones',
      piarValue: piarData.adaptations.slice(0, 3).join(', '),
      planConnection: 'Implementación de adaptaciones específicas del PIAR',
      icon: Settings,
      color: 'red'
    },
    {
      piarElement: 'Recursos',
      piarValue: piarData.resources.slice(0, 3).join(', '),
      planConnection: 'Utilización de recursos ya identificados en PIAR',
      icon: BookOpen,
      color: 'indigo'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6 border-2 border-gradient-to-r from-green-500 to-blue-500 bg-gradient-to-r from-green-50 via-blue-50 to-green-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FileText className="w-8 h-8 text-green-600" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Plan de Apoyo Basado en PIAR
            </CardTitle>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-4 h-4 mr-1" />
              Basado en PIAR
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Brain className="w-4 h-4 mr-1" />
              Generado por KARY AI
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Plan personalizado para <strong>{studentData?.full_name || 'Estudiante'}</strong> basado en su PIAR específico
          </p>
        </CardHeader>
      </Card>

      {/* Conexiones PIAR - Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-center justify-center">
            <Heart className="w-6 h-6 mr-2 text-red-600" />
            Conexión Directa: PIAR → Plan de Apoyo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {piarConnections.map((connection, index) => {
              const Icon = connection.icon;
              const colorClasses = {
                purple: 'border-purple-200 bg-purple-50 text-purple-800',
                green: 'border-green-200 bg-green-50 text-green-800',
                blue: 'border-blue-200 bg-blue-50 text-blue-800',
                orange: 'border-orange-200 bg-orange-50 text-orange-800',
                red: 'border-red-200 bg-red-50 text-red-800',
                indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800'
              };

              return (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                  <div className={`p-3 rounded-full ${colorClasses[connection.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">{connection.piarElement}</h4>
                        <p className="text-sm text-gray-600">{connection.piarValue}</p>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800">En el Plan</h4>
                        <p className="text-sm text-gray-600">{connection.planConnection}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen del PIAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Target className="w-5 h-5 mr-2" />
              Objetivos del PIAR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-green-700">Corto Plazo:</h5>
                <ul className="text-sm text-green-600 ml-4">
                  {piarData.objectives.shortTerm.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>• {obj}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-700">Mediano Plazo:</h5>
                <ul className="text-sm text-green-600 ml-4">
                  {piarData.objectives.mediumTerm.slice(0, 2).map((obj, idx) => (
                    <li key={idx}>• {obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Users className="w-5 h-5 mr-2" />
              Colaboración PIAR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-blue-700">Familia:</h5>
                <p className="text-sm text-blue-600">{piarData.collaboration.family[0]}</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-700">Profesores:</h5>
                <p className="text-sm text-blue-600">{piarData.collaboration.teachers[0]}</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-700">Especialistas:</h5>
                <p className="text-sm text-blue-600">{piarData.collaboration.professionals[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Generado */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Brain className="w-5 h-5 mr-2" />
            Plan de Apoyo Generado por IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto">
              {supportPlan?.data?.supportPlan || 'Plan no disponible'}
            </pre>
          </div>
          <div className="mt-4 p-3 bg-purple-100 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>✨ Este plan fue generado específicamente basado en:</strong>
            </p>
            <ul className="text-sm text-purple-600 mt-2 ml-4">
              <li>• Diagnóstico específico: {piarData.diagnostic}</li>
              <li>• Fortalezas identificadas en el PIAR</li>
              <li>• Necesidades específicas del estudiante</li>
              <li>• Objetivos ya establecidos en el PIAR</li>
              <li>• Adaptaciones recomendadas</li>
              <li>• Recursos disponibles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiarBasedPlanDisplay;
