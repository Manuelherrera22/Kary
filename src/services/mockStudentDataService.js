// Servicio mock para datos del estudiante que evita consultas directas a Supabase
import { CustomAuth } from '@/lib/customAuth';

// Datos mock para recursos asignados
const mockAssignedResources = [
  {
    assignment_id: 'mock-assignment-1',
    assigned_at: '2024-01-15T10:00:00Z',
    asignado_por: 'Prof. Carlos López',
    id: 'mock-resource-1',
    title: 'Matemáticas Básicas - Suma y Resta',
    description: 'Ejercicios interactivos para practicar operaciones básicas',
    type: 'interactive',
    url: 'https://ejemplo.com/matematicas-basicas',
    published: true,
    tags: ['matemáticas', 'básico', 'interactivo'],
    is_favorite: true,
    rating: 5,
    usage_count: 8
  },
  {
    assignment_id: 'mock-assignment-2',
    assigned_at: '2024-01-14T14:30:00Z',
    asignado_por: 'Prof. Ana García',
    id: 'mock-resource-2',
    title: 'Lectura Comprensiva',
    description: 'Cuentos cortos para mejorar la comprensión lectora',
    type: 'reading',
    url: 'https://ejemplo.com/lectura-comprensiva',
    published: true,
    tags: ['lectura', 'comprensión', 'cuentos'],
    is_favorite: false,
    rating: 4,
    usage_count: 5
  },
  {
    assignment_id: 'mock-assignment-3',
    assigned_at: '2024-01-13T09:15:00Z',
    asignado_por: 'Prof. Luis Martínez',
    id: 'mock-resource-3',
    title: 'Ciencias Naturales - El Sistema Solar',
    description: 'Video educativo sobre los planetas y el sistema solar',
    type: 'video',
    url: 'https://ejemplo.com/sistema-solar',
    published: true,
    tags: ['ciencias', 'astronomía', 'video'],
    is_favorite: true,
    rating: 5,
    usage_count: 12
  }
];

// Datos mock para planes de apoyo
const mockSupportPlans = [
  {
    id: 'mock-plan-1',
    created_at: '2024-01-10T08:00:00Z',
    plan_json: {
      objectives: ['Mejorar concentración', 'Desarrollar habilidades sociales'],
      activities: ['Ejercicios de atención', 'Trabajo en grupo'],
      timeline: '3 meses'
    },
    support_goal: 'Desarrollo de habilidades de concentración y socialización',
    support_strategy: 'Actividades grupales y ejercicios individuales',
    start_date: '2024-01-15',
    end_date: '2024-04-15',
    status: 'active',
    type: 'academic',
    assigned: true,
    assigned_at: '2024-01-10T08:00:00Z',
    responsible_person_profile: {
      id: 'mock-teacher-1',
      full_name: 'Prof. Carlos López'
    }
  },
  {
    id: 'mock-plan-2',
    created_at: '2024-01-05T10:30:00Z',
    plan_json: {
      objectives: ['Manejo de emociones', 'Autoestima'],
      activities: ['Diario emocional', 'Ejercicios de relajación'],
      timeline: '2 meses'
    },
    support_goal: 'Desarrollo emocional y autoestima',
    support_strategy: 'Seguimiento emocional y actividades de autoconocimiento',
    start_date: '2024-01-08',
    end_date: '2024-03-08',
    status: 'completed',
    type: 'emotional',
    assigned: true,
    assigned_at: '2024-01-05T10:30:00Z',
    responsible_person_profile: {
      id: 'mock-psychopedagogue-1',
      full_name: 'Dr. Luis Martínez'
    }
  }
];

// Datos mock para actividades del estudiante
const mockStudentActivities = [
  {
    id: 'mock-activity-1',
    student_id: 'mock-student-1',
    activity_type: 'academic',
    title: 'Completaste una actividad de matemáticas',
    description: 'Resolviste 15 ejercicios de suma y resta',
    created_at: '2024-01-15T14:30:00Z',
    status: 'completed',
    points: 10
  },
  {
    id: 'mock-activity-2',
    student_id: 'mock-student-1',
    activity_type: 'emotional',
    title: 'Registraste tu estado emocional',
    description: 'Completaste el seguimiento emocional semanal',
    created_at: '2024-01-14T16:45:00Z',
    status: 'completed',
    points: 5
  },
  {
    id: 'mock-activity-3',
    student_id: 'mock-student-1',
    activity_type: 'social',
    title: 'Participaste en trabajo grupal',
    description: 'Colaboraste en el proyecto de ciencias',
    created_at: '2024-01-13T11:20:00Z',
    status: 'completed',
    points: 8
  }
];

// Datos mock para seguimiento emocional
const mockEmotionalTracking = [
  {
    id: 'mock-tracking-1',
    student_id: 'mock-student-1',
    mood_score: 8,
    energy_level: 7,
    stress_level: 3,
    notes: 'Me siento muy bien hoy, tuve una buena clase de matemáticas',
    created_at: '2024-01-15T16:00:00Z',
    tags: ['feliz', 'motivado', 'aprendizaje']
  },
  {
    id: 'mock-tracking-2',
    student_id: 'mock-student-1',
    mood_score: 6,
    energy_level: 5,
    stress_level: 5,
    notes: 'Día normal, un poco cansado pero contento',
    created_at: '2024-01-14T15:30:00Z',
    tags: ['neutral', 'cansado']
  },
  {
    id: 'mock-tracking-3',
    student_id: 'mock-student-1',
    mood_score: 9,
    energy_level: 8,
    stress_level: 2,
    notes: '¡Excelente día! Completé todas mis tareas y me siento orgulloso',
    created_at: '2024-01-13T17:15:00Z',
    tags: ['orgulloso', 'logro', 'feliz']
  }
];

// Simular delay de red
const simulateNetworkDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simular error ocasional (deshabilitado para desarrollo)
const simulateError = () => {
  return Math.random() < 0.001; // 0.1% de probabilidad de error (casi nunca)
};

// Verificar autenticación
const checkAuth = () => {
  const currentUser = CustomAuth.getCurrentUser();
  const currentSession = CustomAuth.getCurrentSession();
  
  if (!currentUser || !currentSession) {
    throw new Error('User not authenticated');
  }
  
  if (currentUser.role !== 'student') {
    throw new Error('Access denied: Student role required');
  }
  
  return currentUser;
};

// Servicio para recursos asignados
export const getAssignedResources = async (userId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockAssignedResources,
      error: null
    };
  } catch (error) {
    console.error('Error fetching assigned resources:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio para planes de apoyo
export const getStudentSupportPlans = async (userId) => {
  try {
    await simulateNetworkDelay(250);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockSupportPlans,
      error: null
    };
  } catch (error) {
    console.error('Error fetching support plans:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio para actividades del estudiante
export const getStudentActivities = async (userId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockStudentActivities,
      error: null
    };
  } catch (error) {
    console.error('Error fetching student activities:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio para seguimiento emocional
export const getEmotionalTracking = async (userId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockEmotionalTracking,
      error: null
    };
  } catch (error) {
    console.error('Error fetching emotional tracking:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Funciones adicionales para favoritos y calificaciones
const toggleResourceFavorite = async (studentId, resourceId) => {
  return checkAuthAndSimulate((user) => {
    if (user.id !== studentId) {
      return { data: null, error: { message: 'Unauthorized access to resource favorites' } };
    }
    
    // Simular toggle de favorito
    const resource = mockAssignedResources.find(r => r.id === resourceId);
    if (resource) {
      resource.is_favorite = !resource.is_favorite;
      return { data: { success: true, is_favorite: resource.is_favorite }, error: null };
    }
    
    return { data: null, error: { message: 'Resource not found' } };
  });
};

const rateResource = async (studentId, resourceId, rating) => {
  return checkAuthAndSimulate((user) => {
    if (user.id !== studentId) {
      return { data: null, error: { message: 'Unauthorized access to resource ratings' } };
    }
    
    // Simular calificación de recurso
    const resource = mockAssignedResources.find(r => r.id === resourceId);
    if (resource) {
      resource.rating = rating;
      return { data: { success: true, rating: rating }, error: null };
    }
    
    return { data: null, error: { message: 'Resource not found' } };
  });
};

// Servicio principal
const mockStudentDataService = {
  getAssignedResources,
  getStudentSupportPlans,
  getStudentActivities,
  getEmotionalTracking,
  toggleResourceFavorite,
  rateResource
};

export default mockStudentDataService;
