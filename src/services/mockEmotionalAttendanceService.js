// Servicio mock para asistencia emocional
import { CustomAuth } from '@/lib/customAuth';

// Simular delay de red
const simulateNetworkDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simular error ocasional
const simulateError = () => {
  return Math.random() < 0.05; // 5% de probabilidad de error
};

// Verificar autenticación
const checkAuth = () => {
  const currentUser = CustomAuth.getCurrentUser();
  const currentSession = CustomAuth.getCurrentSession();
  
  if (!currentUser || !currentSession) {
    throw new Error('User not authenticated');
  }
  
  return currentUser;
};

// Registrar asistencia emocional
export const registerEmotionalAttendance = async (studentId, emotionState, comments) => {
  try {
    await simulateNetworkDelay(400);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    const attendanceRecord = {
      id: `mock-attendance-${Date.now()}`,
      student_id: studentId,
      emotion_state: emotionState,
      comments: comments || '',
      created_at: new Date().toISOString(),
      week_start: new Date().toISOString().split('T')[0] // Simular inicio de semana
    };
    
    // Simular guardado exitoso
    console.log('Emotional attendance registered:', attendanceRecord);
    
    return {
      data: attendanceRecord,
      error: null
    };
  } catch (error) {
    console.error('Error registering emotional attendance:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Verificar si se sugiere asesoramiento
export const checkCounselingSuggestion = async (studentId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    // Simular lógica de sugerencia de asesoramiento
    // En un caso real, esto se basaría en patrones emocionales
    const shouldSuggestCounseling = Math.random() < 0.3; // 30% de probabilidad
    
    return {
      data: shouldSuggestCounseling,
      error: null
    };
  } catch (error) {
    console.error('Error checking counseling suggestion:', error);
    return {
      data: false,
      error: { message: error.message }
    };
  }
};

// Obtener historial de asistencia emocional
export const getEmotionalAttendanceHistory = async (studentId) => {
  try {
    await simulateNetworkDelay(250);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    // Datos mock para el historial
    const mockHistory = [
      {
        id: 'mock-attendance-1',
        student_id: studentId,
        emotion_state: 'feliz',
        comments: 'Me siento muy bien hoy, tuve una buena clase',
        created_at: '2024-01-15T16:00:00Z',
        week_start: '2024-01-15'
      },
      {
        id: 'mock-attendance-2',
        student_id: studentId,
        emotion_state: 'neutral',
        comments: 'Día normal, sin problemas',
        created_at: '2024-01-08T15:30:00Z',
        week_start: '2024-01-08'
      },
      {
        id: 'mock-attendance-3',
        student_id: studentId,
        emotion_state: 'triste',
        comments: 'Me siento un poco triste hoy',
        created_at: '2024-01-01T14:15:00Z',
        week_start: '2024-01-01'
      }
    ];
    
    return {
      data: mockHistory,
      error: null
    };
  } catch (error) {
    console.error('Error fetching emotional attendance history:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio principal
const mockEmotionalAttendanceService = {
  registerEmotionalAttendance,
  checkCounselingSuggestion,
  getEmotionalAttendanceHistory
};

export default mockEmotionalAttendanceService;
