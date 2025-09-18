// Servicio mock para chat con Kary
import { CustomAuth } from '@/lib/customAuth';

// Datos mock para conversaciones
const mockConversations = [
  {
    id: 'mock-conversation-1',
    user_id: 'mock-student-1',
    message: 'Hola Kary, ¿cómo estás?',
    response: '¡Hola! Estoy muy bien, gracias por preguntar. ¿Cómo te sientes hoy?',
    timestamp: '2024-01-15T16:30:00Z',
    is_user: true
  },
  {
    id: 'mock-conversation-2',
    user_id: 'mock-student-1',
    message: 'Me siento un poco nervioso por el examen de mañana',
    response: 'Entiendo que te sientas nervioso, es normal antes de un examen. ¿Te gustaría que te ayude con algunas técnicas de relajación?',
    timestamp: '2024-01-15T16:32:00Z',
    is_user: true
  },
  {
    id: 'mock-conversation-3',
    user_id: 'mock-student-1',
    message: 'Sí, por favor',
    response: 'Perfecto. Te sugiero que respires profundamente 3 veces, cierres los ojos y pienses en un lugar tranquilo. También puedes repasar tus apuntes de forma organizada. ¿Te gustaría que te ayude a crear un plan de estudio?',
    timestamp: '2024-01-15T16:35:00Z',
    is_user: true
  },
  {
    id: 'mock-conversation-4',
    user_id: 'mock-student-1',
    message: '¡Gracias Kary! Me siento mejor',
    response: '¡Me alegra mucho saberlo! Recuerda que siempre estoy aquí para ayudarte. ¡Tú puedes con ese examen!',
    timestamp: '2024-01-15T16:38:00Z',
    is_user: true
  }
];

// Simular delay de red
const simulateNetworkDelay = (ms = 500) => {
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

// Generar respuesta de Kary
const generateKaryResponse = (userMessage) => {
  const responses = [
    'Entiendo perfectamente lo que me dices. ¿Te gustaría que profundicemos en ese tema?',
    'Esa es una excelente pregunta. Te ayudo a reflexionar sobre eso.',
    'Me alegra que me compartas eso. ¿Cómo te sientes al respecto?',
    'Es normal sentir eso. ¿Qué crees que te ayudaría a sentirte mejor?',
    'Gracias por confiar en mí. Siempre estoy aquí para escucharte.',
    'Esa es una perspectiva muy interesante. ¿Qué más te gustaría explorar?',
    'Me parece muy valioso lo que me cuentas. ¿Te gustaría que te ayude con algo específico?',
    'Entiendo tu punto de vista. ¿Cómo crees que podrías abordar esa situación?'
  ];
  
  // Seleccionar respuesta aleatoria
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: `mock-response-${Date.now()}`,
    user_id: 'mock-student-1',
    message: userMessage,
    response: randomResponse,
    timestamp: new Date().toISOString(),
    is_user: true
  };
};

// Obtener historial de chat
export const getChatHistory = async (userId) => {
  try {
    await simulateNetworkDelay(300);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    // Filtrar conversaciones del usuario
    const userConversations = mockConversations.filter(conv => conv.user_id === userId);
    
    return {
      data: userConversations,
      error: null
    };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Enviar mensaje a Kary
export const sendMessageToKary = async (userId, message) => {
  try {
    await simulateNetworkDelay(800); // Simular tiempo de procesamiento de IA
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    if (!message || message.trim() === '') {
      throw new Error('El mensaje no puede estar vacío');
    }
    
    // Generar respuesta de Kary
    const conversation = generateKaryResponse(message.trim());
    
    // Agregar a la lista de conversaciones
    mockConversations.push(conversation);
    
    return {
      data: conversation,
      error: null
    };
  } catch (error) {
    console.error('Error sending message to Kary:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Obtener sugerencias de conversación
export const getConversationSuggestions = async (userId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    const suggestions = [
      '¿Cómo puedo manejar mejor el estrés?',
      'Me siento triste, ¿qué puedo hacer?',
      '¿Cómo puedo mejorar mi concentración?',
      'Tengo problemas con mis compañeros de clase',
      '¿Cómo puedo organizar mejor mi tiempo?',
      'Me siento ansioso por el futuro',
      '¿Cómo puedo mejorar mi autoestima?',
      'Tengo dificultades para dormir'
    ];
    
    return {
      data: suggestions,
      error: null
    };
  } catch (error) {
    console.error('Error fetching conversation suggestions:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio principal
const mockKaryChatService = {
  getChatHistory,
  sendMessageToKary,
  getConversationSuggestions
};

export default mockKaryChatService;
