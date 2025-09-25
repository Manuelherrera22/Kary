import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import surveyService from '@/services/surveyService';

const SurveyStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const result = await surveyService.getSurveyStatistics();
      
      if (result.success) {
        setStatistics(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    const icons = {
      student: '👨‍🎓',
      teacher: '👩‍🏫',
      psychopedagogue: '🧠',
      parent: '👨‍👩‍👧‍👦',
      director: '👔'
    };
    return icons[role] || '👤';
  };

  const getRoleLabel = (role) => {
    const labels = {
      student: 'Estudiantes',
      teacher: 'Profesores',
      psychopedagogue: 'Psicopedagogos',
      parent: 'Padres/Madres',
      director: 'Directivos'
    };
    return labels[role] || role;
  };

  const getRecommendationColor = (recommendation) => {
    const colors = {
      definitely: 'bg-green-500',
      probably: 'bg-emerald-500',
      neutral: 'bg-yellow-500',
      'probably-not': 'bg-orange-500',
      'definitely-not': 'bg-red-500'
    };
    return colors[recommendation] || 'bg-gray-500';
  };

  const getRecommendationLabel = (recommendation) => {
    const labels = {
      definitely: 'Definitivamente sí',
      probably: 'Probablemente sí',
      neutral: 'Neutral',
      'probably-not': 'Probablemente no',
      'definitely-not': 'Definitivamente no'
    };
    return labels[recommendation] || recommendation;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-emerald-600">Cargando estadísticas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error al cargar estadísticas: {error}</p>
            <button 
              onClick={loadStatistics}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return (
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-6">
          <div className="text-center text-slate-600">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p>No hay estadísticas disponibles aún</p>
            <p className="text-sm">Las estadísticas aparecerán cuando se envíen las primeras encuestas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalResponses = statistics.total_responses || 0;
  const roleCounts = [
    { role: 'student', count: statistics.student_count || 0 },
    { role: 'teacher', count: statistics.teacher_count || 0 },
    { role: 'psychopedagogue', count: statistics.psychopedagogue_count || 0 },
    { role: 'parent', count: statistics.parent_count || 0 },
    { role: 'director', count: statistics.director_count || 0 }
  ];

  const ratings = [
    { label: 'Facilidad de uso', value: statistics.avg_usability || 0 },
    { label: 'Funcionalidad', value: statistics.avg_functionality || 0 },
    { label: 'Diseño', value: statistics.avg_design || 0 },
    { label: 'Rendimiento', value: statistics.avg_performance || 0 },
    { label: 'Soporte', value: statistics.avg_support || 0 }
  ];

  const recommendations = [
    { type: 'definitely', count: statistics.definitely_count || 0 },
    { type: 'probably', count: statistics.probably_count || 0 },
    { type: 'neutral', count: statistics.neutral_count || 0 },
    { type: 'probably-not', count: statistics.probably_not_count || 0 },
    { type: 'definitely-not', count: statistics.definitely_not_count || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-800">
            <BarChart3 className="w-6 h-6 mr-2" />
            Estadísticas de Encuestas Kary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{totalResponses}</div>
              <div className="text-sm text-emerald-700">Total Respuestas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">
                {ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length || 0}
              </div>
              <div className="text-sm text-teal-700">Rating Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {Math.round(((statistics.definitely_count || 0) + (statistics.probably_count || 0)) / totalResponses * 100) || 0}%
              </div>
              <div className="text-sm text-cyan-700">Recomendación Positiva</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por rol */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Users className="w-5 h-5 mr-2" />
              Distribución por Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roleCounts.map(({ role, count }) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getRoleIcon(role)}</span>
                    <span className="text-sm font-medium text-blue-700">{getRoleLabel(role)}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {count}
                    </Badge>
                    <div className="w-20 ml-2">
                      <Progress 
                        value={totalResponses > 0 ? (count / totalResponses) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ratings promedio */}
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Star className="w-5 h-5 mr-2" />
              Ratings Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-700">{label}</span>
                    <span className="text-purple-600 font-medium">{value.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(value / 5) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <TrendingUp className="w-5 h-5 mr-2" />
            Distribución de Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {recommendations.map(({ type, count }) => (
              <div key={type} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl mb-2 ${getRecommendationColor(type)}`}>
                  {count}
                </div>
                <div className="text-sm font-medium text-green-700">{getRecommendationLabel(type)}</div>
                <div className="text-xs text-green-600">
                  {totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Última actualización */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-slate-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Última actualización: {new Date(statistics.last_updated).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyStatistics;
