// Servicio mock para Edge Functions que funciona con nuestro sistema de autenticación mock
import { CustomAuth } from '@/lib/customAuth';

// Datos mock para el dashboard del estudiante
const mockDashboardData = {
  emotional_state: {
    status: 'positive',
    level: 8,
    description: 'Te sientes muy bien hoy, ¡sigue así!'
  },
  kary_suggestion: 'Hoy es un gran día para aprender algo nuevo. Te sugiero revisar tus recursos asignados y completar al menos una tarea. ¡Tú puedes!',
  recent_activities: [
    {
      id: 1,
      title: 'Completaste una actividad de matemáticas',
      time: 'Hace 2 horas',
      type: 'academic'
    },
    {
      id: 2,
      title: 'Registraste tu estado emocional',
      time: 'Hace 4 horas',
      type: 'emotional'
    }
  ],
  upcoming_tasks: [
    {
      id: 1,
      title: 'Revisar recursos de ciencias',
      due_date: 'Mañana',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Completar evaluación emocional',
      due_date: 'En 2 días',
      priority: 'high'
    }
  ],
  progress_summary: {
    completed_tasks: 12,
    total_tasks: 15,
    emotional_checks: 5,
    resources_used: 8
  }
};

// Simular delay de red
const simulateNetworkDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simular error ocasional (reducido para mayor estabilidad)
const simulateError = () => {
  return Math.random() < 0.02; // 2% de probabilidad de error (reducido de 10%)
};

async function invokeMockEdgeFunction(functionName, payload) {
  console.log(`[MockEdgeFunctionService] Preparing to invoke ${functionName}. Initial payload:`, payload);
  
  // Verificar autenticación usando nuestro sistema mock
  const currentUser = CustomAuth.getCurrentUser();
  const currentSession = CustomAuth.getCurrentSession();
  
  if (!currentUser || !currentSession) {
    console.error('[MockEdgeFunctionService] User not authenticated');
    return { data: null, error: { message: 'User not authenticated' } };
  }

  // Simular delay de red
  await simulateNetworkDelay(300);

  // Simular error ocasional
  if (simulateError()) {
    return { data: null, error: { message: 'Error temporal de conexión. Intenta nuevamente.' } };
  }

  // Procesar diferentes funciones
  let responseData = null;

  switch (functionName) {
    case 'get-dashboard-summary':
      responseData = {
        ...mockDashboardData,
        user_id: currentUser.id,
        role: currentUser.role,
        generated_at: new Date().toISOString()
      };
      break;

    case 'get-student-progress-summary':
      responseData = {
        student_id: currentUser.id,
        progress: mockDashboardData.progress_summary,
        last_updated: new Date().toISOString()
      };
      break;

    case 'get-student-case-overview':
      responseData = {
        student_id: currentUser.id,
        case_summary: 'Estudiante activo con buen progreso académico y emocional',
        recommendations: ['Continuar con las actividades asignadas', 'Mantener el seguimiento emocional']
      };
      break;

    case 'get-support-plan-summary':
      responseData = {
        student_id: currentUser.id,
        active_plans: 2,
        completed_plans: 1,
        next_review: 'En 1 semana'
      };
      break;

    case 'get-emotional-trend-summary':
      responseData = {
        student_id: currentUser.id,
        trend: 'positive',
        trend_description: 'Tendencia emocional positiva en las últimas semanas',
        recommendations: ['Continuar con las actividades actuales']
      };
      break;

    default:
      responseData = {
        message: `Función ${functionName} simulada exitosamente`,
        user_id: currentUser.id,
        role: currentUser.role,
        timestamp: new Date().toISOString()
      };
  }

  console.log(`[MockEdgeFunctionService] Successful response from ${functionName}:`, responseData);
  return { data: responseData, error: null };
}

// Exportar funciones específicas
export const getDashboardSummary = async (payload) => {
  return invokeMockEdgeFunction('get-dashboard-summary', payload);
};

export const getStudentProgressSummary = async (payload) => {
  return invokeMockEdgeFunction('get-student-progress-summary', payload);
};

export const getStudentCaseOverview = async (payload) => {
  return invokeMockEdgeFunction('get-student-case-overview', payload);
};

export const getSupportPlanSummary = async (payload) => {
  return invokeMockEdgeFunction('get-support-plan-summary', payload);
};

export const getEmotionalTrendSummaryDashboard = async (payload) => {
  return invokeMockEdgeFunction('get-emotional-trend-summary', payload);
};

// Servicio mock principal
const mockEdgeFunctionService = {
  getDashboardSummary,
  getStudentProgressSummary,
  getStudentCaseOverview,
  getSupportPlanSummary,
  getEmotionalTrendSummaryDashboard,
  // Agregar más funciones según sea necesario
};

export default mockEdgeFunctionService;
