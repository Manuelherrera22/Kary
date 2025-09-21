import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_USERS } from '@/lib/mockAuth';
import { shouldUseMockData, getMockConfig, getSupabaseConfig, getUIConfig } from '@/config/piarConfig';

/**
 * Hook para manejar datos de PIAR (Plan Individual de Ajustes Razonables)
 * Permite crear, actualizar y gestionar planes personalizados para cada estudiante
 */

// Datos mock para PIARs de ejemplo
const MOCK_PIARS = [
  {
    id: 'piar-1',
    student_id: 'mock-student-1',
    student_name: 'María García Estudiante',
    created_by: 'mock-psychopedagogue-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    
    // Información diagnóstica
    diagnostic_info: {
      learning_style: 'visual',
      attention_span: 'short',
      reading_level: 'basic',
      math_level: 'intermediate',
      social_skills: 'developing',
      emotional_regulation: 'needs_support',
      physical_needs: 'none',
      communication_style: 'verbal_preferred'
    },
    
    // Necesidades específicas
    specific_needs: [
      {
        category: 'academic',
        need: 'reading_support',
        description: 'Necesita apoyo adicional en comprensión lectora',
        priority: 'high',
        strategies: ['lectura guiada', 'materiales visuales', 'repetición']
      },
      {
        category: 'behavioral',
        need: 'attention_management',
        description: 'Requiere estrategias para mantener la atención',
        priority: 'medium',
        strategies: ['descansos frecuentes', 'actividades cortas', 'refuerzo positivo']
      },
      {
        category: 'social',
        need: 'peer_interaction',
        description: 'Necesita apoyo para interactuar con compañeros',
        priority: 'medium',
        strategies: ['trabajo en parejas', 'actividades grupales guiadas']
      }
    ],
    
    // Ajustes razonables
    reasonable_adjustments: [
      {
        type: 'instructional',
        adjustment: 'extended_time',
        description: 'Tiempo extendido para tareas de lectura',
        implementation: 'Proporcionar 50% más tiempo para actividades de comprensión lectora'
      },
      {
        type: 'environmental',
        adjustment: 'quiet_workspace',
        description: 'Espacio de trabajo tranquilo',
        implementation: 'Ubicar cerca del profesor, alejado de distracciones'
      },
      {
        type: 'assessment',
        adjustment: 'alternative_assessment',
        description: 'Evaluaciones alternativas',
        implementation: 'Permitir respuestas orales en lugar de escritas cuando sea apropiado'
      }
    ],
    
    // Objetivos del PIAR
    goals: [
      {
        id: 'goal-1',
        description: 'Mejorar comprensión lectora en un 30%',
        target_date: '2024-06-30',
        progress: 45,
        strategies: ['lectura diaria', 'preguntas de comprensión', 'material visual']
      },
      {
        id: 'goal-2',
        description: 'Mantener atención durante 20 minutos consecutivos',
        target_date: '2024-05-15',
        progress: 70,
        strategies: ['descansos programados', 'actividades variadas', 'refuerzo positivo']
      }
    ],
    
    // Estrategias de enseñanza personalizadas
    teaching_strategies: [
      {
        subject: 'mathematics',
        strategies: [
          'Usar manipulativos y materiales concretos',
          'Proporcionar ejemplos visuales paso a paso',
          'Permitir tiempo adicional para procesar información',
          'Usar refuerzo positivo frecuente'
        ]
      },
      {
        subject: 'language',
        strategies: [
          'Lectura guiada con preguntas de comprensión',
          'Materiales con imágenes y texto',
          'Repetición y práctica espaciada',
          'Adaptar textos a nivel de lectura apropiado'
        ]
      }
    ],
    
    // Actividades personalizadas recomendadas
    recommended_activities: [
      {
        id: 'activity-1',
        type: 'reading_comprehension',
        title: 'Lectura con imágenes',
        description: 'Actividad de comprensión lectora usando imágenes como apoyo visual',
        duration: 15,
        difficulty: 'beginner',
        materials: ['texto corto', 'imágenes relacionadas', 'preguntas simples'],
        adaptations: ['tiempo extendido', 'apoyo visual', 'instrucciones claras']
      },
      {
        id: 'activity-2',
        type: 'attention_training',
        title: 'Juego de atención sostenida',
        description: 'Actividad para mejorar la capacidad de atención mediante juegos',
        duration: 10,
        difficulty: 'beginner',
        materials: ['tarjetas con imágenes', 'timer', 'sistema de puntos'],
        adaptations: ['descansos frecuentes', 'refuerzo inmediato', 'nivel ajustable']
      }
    ],
    
    // Progreso y seguimiento
    progress_tracking: {
      last_assessment: '2024-03-15',
      next_review: '2024-04-15',
      overall_progress: 60,
      areas_improving: ['atención', 'comprensión lectora'],
      areas_needing_work: ['interacción social', 'tiempo de concentración']
    }
  }
];

export const usePIARData = (students = []) => {
  const [piars, setPiars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(shouldUseMockData());
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const mockConfig = getMockConfig();
  const supabaseConfig = getSupabaseConfig();
  const uiConfig = getUIConfig();

  // Función para verificar si la tabla piars existe
  const checkTableExists = useCallback(async () => {
    try {
      // Intentar una consulta simple para verificar si la tabla existe
      const { error } = await supabase
        .from('piars')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  }, []);

  const fetchPIARs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Si ya sabemos que debemos usar datos mock, usarlos directamente
      if (useMockData) {
        if (uiConfig.DEBUG_LOGS) {
          console.log('Cargando PIARs en modo mock...');
        }
        
        // Simular delay de red para una mejor experiencia de usuario
        await new Promise(resolve => setTimeout(resolve, mockConfig.NETWORK_DELAY));
        
        if (uiConfig.DEBUG_LOGS) {
          console.log('PIARs mock cargados exitosamente:', MOCK_PIARS);
        }
        setPiars(MOCK_PIARS);
        return;
      }

      // Verificar si la tabla existe antes de intentar cargar datos
      const tableExists = await checkTableExists();
      
      if (!tableExists) {
        console.log('Tabla piars no existe, usando datos mock...');
        setUseMockData(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setPiars(MOCK_PIARS);
        return;
      }

      // Si la tabla existe, intentar cargar datos reales
      if (uiConfig.DEBUG_LOGS) {
        console.log('Cargando PIARs desde Supabase...');
      }
      const { data, error } = await supabase
        .from(supabaseConfig.TABLE_NAME)
        .select(supabaseConfig.DEFAULT_SELECT)
        .order(supabaseConfig.DEFAULT_ORDER.replace('desc', 'desc').replace('asc', 'asc'));

      if (error) {
        console.log('Error cargando desde Supabase, usando datos mock:', error.message);
        setUseMockData(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setPiars(MOCK_PIARS);
      } else if (data && data.length > 0) {
        console.log('PIARs cargados desde Supabase:', data);
        setPiars(data);
      } else {
        console.log('No hay PIARs en Supabase, usando datos mock...');
        await new Promise(resolve => setTimeout(resolve, 500));
        setPiars(MOCK_PIARS);
      }
      
    } catch (error) {
      console.error('Error loading PIARs, usando datos mock:', error);
      setUseMockData(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setPiars(MOCK_PIARS);
    } finally {
      setIsLoading(false);
    }
  }, [useMockData, checkTableExists]);

  const getPIARByStudentId = useCallback((studentId) => {
    return piars.find(piar => piar.student_id === studentId);
  }, [piars]);

  const createPIAR = useCallback(async (piarData) => {
    try {
      console.log('Creando nuevo PIAR (modo mock):', piarData);
      
      // Obtener nombre del estudiante
      const student = students.find(s => s.id === piarData.student_id);
      const studentName = student?.full_name || student?.name || student?.email || 'Estudiante';
      
      // En modo mock, simular creación exitosa
      const newPIAR = {
        ...piarData,
        id: `piar-${Date.now()}`,
        student_name: studentName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      };
      
      setPiars(prev => [newPIAR, ...prev]);
      
      toast({
        title: t('piar.createdSuccessfully'),
        description: t('piar.createdSuccessfullyDescription'),
        variant: 'default',
      });
      
      return newPIAR;
    } catch (error) {
      console.error('Error creating PIAR:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('piar.errorCreating'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t, students]);

  const updatePIAR = useCallback(async (piarId, updates) => {
    try {
      console.log('Actualizando PIAR:', piarId, updates);
      
      setPiars(prev => prev.map(piar => 
        piar.id === piarId 
          ? { ...piar, ...updates, updated_at: new Date().toISOString() }
          : piar
      ));
      
      toast({
        title: t('piar.updatedSuccessfully'),
        description: t('piar.updatedSuccessfullyDescription'),
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error updating PIAR:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('piar.errorUpdating'),
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, t]);

  const generatePersonalizedActivities = useCallback((piar) => {
    if (!piar) return [];
    
    const activities = [];
    
    // Generar actividades basadas en necesidades específicas
    piar.specific_needs?.forEach(need => {
      switch (need.need) {
        case 'reading_support':
          activities.push({
            type: 'reading_comprehension',
            title: 'Lectura Adaptada',
            description: `Actividad de lectura personalizada para ${need.description}`,
            duration: need.priority === 'high' ? 20 : 15,
            difficulty: 'adaptive',
            materials: ['texto adaptado', 'imágenes de apoyo', 'preguntas guiadas'],
            adaptations: ['tiempo extendido', 'apoyo visual', 'instrucciones claras'],
            based_on_need: need.need
          });
          break;
          
        case 'attention_management':
          activities.push({
            type: 'attention_training',
            title: 'Entrenamiento de Atención',
            description: `Ejercicios para mejorar ${need.description}`,
            duration: 10,
            difficulty: 'progressive',
            materials: ['timer', 'actividades cortas', 'sistema de recompensas'],
            adaptations: ['descansos frecuentes', 'refuerzo positivo', 'nivel ajustable'],
            based_on_need: need.need
          });
          break;
          
        case 'peer_interaction':
          activities.push({
            type: 'social_skills',
            title: 'Interacción Social Guiada',
            description: `Actividad para desarrollar ${need.description}`,
            duration: 25,
            difficulty: 'guided',
            materials: ['guías de interacción', 'roles claros', 'facilitador'],
            adaptations: ['trabajo en parejas', 'roles específicos', 'apoyo del profesor'],
            based_on_need: need.need
          });
          break;
      }
    });
    
    return activities;
  }, []);

  // Cargar PIARs al montar el componente
  useEffect(() => {
    fetchPIARs();
  }, [fetchPIARs]);

  return {
    piars,
    isLoading,
    error,
    fetchPIARs,
    getPIARByStudentId,
    createPIAR,
    updatePIAR,
    generatePersonalizedActivities
  };
};
