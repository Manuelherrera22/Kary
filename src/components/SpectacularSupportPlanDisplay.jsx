import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Target, 
  Rocket, 
  Tools, 
  BarChart3, 
  Users, 
  Sparkles,
  Download,
  Share2,
  Eye,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const SpectacularSupportPlanDisplay = ({ supportPlan, studentData, piarData }) => {
  const [activeSection, setActiveSection] = useState('analysis');
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = [
    { id: 'analysis', title: 'Análisis Psicopedagógico', icon: Brain, color: 'bg-purple-500' },
    { id: 'objectives', title: 'Objetivos Estratégicos', icon: Target, color: 'bg-blue-500' },
    { id: 'strategies', title: 'Estrategias Innovadoras', icon: Rocket, color: 'bg-green-500' },
    { id: 'resources', title: 'Recursos Especializados', icon: Tools, color: 'bg-orange-500' },
    { id: 'evaluation', title: 'Seguimiento y Evaluación', icon: BarChart3, color: 'bg-red-500' },
    { id: 'collaboration', title: 'Colaboración', icon: Users, color: 'bg-indigo-500' },
    { id: 'creative', title: 'Elementos Creativos', icon: Sparkles, color: 'bg-pink-500' }
  ];

  const renderSectionContent = (sectionId) => {
    const content = supportPlan?.data?.supportPlan || '';
    
    switch (sectionId) {
      case 'analysis':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Fortalezas Identificadas</h4>
                  </div>
                  <p className="text-sm text-purple-700">Análisis profundo de capacidades cognitivas y habilidades del estudiante</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Áreas de Desarrollo</h4>
                  </div>
                  <p className="text-sm text-blue-700">Necesidades específicas y oportunidades de crecimiento</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Perfil de Aprendizaje
              </h4>
              <p className="text-sm text-gray-700">Estilo de aprendizaje y preferencias identificadas para optimizar la enseñanza</p>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    Corto Plazo (1-3 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-green-700">Objetivos específicos y medibles para el primer trimestre</p>
                  <Progress value={25} className="mt-2" />
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-yellow-600" />
                    Mediano Plazo (3-6 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-yellow-700">Desarrollo de competencias clave y habilidades base</p>
                  <Progress value={50} className="mt-2" />
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-red-600" />
                    Largo Plazo (6-12 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-red-700">Autonomía, competencias para la vida y preparación</p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'strategies':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-green-800">
                    <Rocket className="w-5 h-5 mr-2 text-green-600" />
                    Estrategias Académicas
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Metodologías adaptadas al perfil</li>
                    <li>• Tecnologías de apoyo específicas</li>
                    <li>• Adaptaciones curriculares</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-blue-800">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Estrategias Emocionales
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Regulación emocional</li>
                    <li>• Desarrollo de autoestima</li>
                    <li>• Manejo de ansiedad</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-purple-800">
                    <Tools className="w-5 h-5 mr-2 text-purple-600" />
                    Tecnológicos
                  </h4>
                  <p className="text-sm text-purple-700">Herramientas digitales y aplicaciones personalizadas</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-orange-800">
                    <Tools className="w-5 h-5 mr-2 text-orange-600" />
                    Didácticos
                  </h4>
                  <p className="text-sm text-orange-700">Materiales multisensoriales y adaptados</p>
                </CardContent>
              </Card>
              <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-indigo-800">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Humanos
                  </h4>
                  <p className="text-sm text-indigo-700">Especialistas y coordinación interdisciplinaria</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'evaluation':
        return (
          <div className="space-y-4">
            <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center text-red-800">
                  <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
                  Sistema de Evaluación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h5 className="font-medium text-red-700">Indicadores</h5>
                    <p className="text-sm text-red-600">Métricas cuantitativas y cualitativas</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700">Frecuencia</h5>
                    <p className="text-sm text-red-600">Evaluación semanal, mensual y trimestral</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700">Criterios</h5>
                    <p className="text-sm text-red-600">Logros académicos y desarrollo social</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'collaboration':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-pink-800">
                    <Users className="w-5 h-5 mr-2 text-pink-600" />
                    Familia
                  </h4>
                  <p className="text-sm text-pink-700">Estrategias para el hogar y comunicación</p>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-green-800">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Profesores
                  </h4>
                  <p className="text-sm text-green-700">Adaptaciones en el aula y estrategias</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center text-blue-800">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Especialistas
                  </h4>
                  <p className="text-sm text-blue-700">Intervenciones específicas y coordinación</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="space-y-4">
            <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center text-pink-800">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                  Elementos Únicos y Creativos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h5 className="font-medium text-pink-700">Actividades Innovadoras</h5>
                    <p className="text-sm text-pink-600">Específicas para este estudiante</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-pink-700">Gamificación</h5>
                    <p className="text-sm text-pink-600">Estrategias motivacionales únicas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Selecciona una sección</div>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header Espectacular */}
      <Card className="mb-6 border-2 border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Plan de Apoyo Espectacular
            </CardTitle>
            <Sparkles className="w-8 h-8 text-pink-600" />
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <Brain className="w-4 h-4 mr-1" />
              Generado por KARY AI
            </Badge>
            <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300">
              <Star className="w-4 h-4 mr-1" />
              Versión 2.0 Espectacular
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Plan personalizado basado en PIAR para <strong>{studentData?.full_name || 'Estudiante'}</strong>
          </p>
        </CardHeader>
      </Card>

      {/* Navegación de Secciones */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la Sección */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {renderSectionContent(activeSection)}
        </CardContent>
      </Card>

      {/* Plan Completo Expandible */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-purple-600" />
              Plan Completo Generado por IA
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
            >
              {isExpanded ? 'Contraer' : 'Expandir'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {supportPlan?.data?.supportPlan || 'Plan no disponible'}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Acciones */}
      <div className="flex justify-center space-x-4">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Descargar Plan
        </Button>
        <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </div>
    </div>
  );
};

export default SpectacularSupportPlanDisplay;
