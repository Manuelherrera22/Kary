// Servicio mock para datos emocionales (etiquetas y clasificaciones)
import { CustomAuth } from '@/lib/customAuth';

// Datos mock para clasificaciones emocionales
const mockClassifications = [
  {
    id: 'mock-classification-1',
    name: 'Emociones Positivas',
    description: 'Sentimientos y estados de ánimo positivos',
    color: '#10B981',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-classification-2',
    name: 'Emociones Negativas',
    description: 'Sentimientos y estados de ánimo negativos',
    color: '#EF4444',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-classification-3',
    name: 'Emociones Neutras',
    description: 'Estados emocionales neutros o equilibrados',
    color: '#6B7280',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'mock-classification-4',
    name: 'Estados de Energía',
    description: 'Niveles de energía y vitalidad',
    color: '#F59E0B',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Datos mock para etiquetas emocionales
const mockTags = [
  // Emociones Positivas
  { id: 'mock-tag-1', label: 'Feliz', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-2', label: 'Contento', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-3', label: 'Emocionado', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-4', label: 'Orgulloso', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-5', label: 'Agradecido', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-6', label: 'Optimista', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-7', label: 'Motivado', classification_id: 'mock-classification-1' },
  { id: 'mock-tag-8', label: 'Tranquilo', classification_id: 'mock-classification-1' },
  
  // Emociones Negativas
  { id: 'mock-tag-9', label: 'Triste', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-10', label: 'Ansioso', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-11', label: 'Enojado', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-12', label: 'Frustrado', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-13', label: 'Preocupado', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-14', label: 'Confundido', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-15', label: 'Desanimado', classification_id: 'mock-classification-2' },
  { id: 'mock-tag-16', label: 'Nervioso', classification_id: 'mock-classification-2' },
  
  // Emociones Neutras
  { id: 'mock-tag-17', label: 'Neutral', classification_id: 'mock-classification-3' },
  { id: 'mock-tag-18', label: 'Reflexivo', classification_id: 'mock-classification-3' },
  { id: 'mock-tag-19', label: 'Equilibrado', classification_id: 'mock-classification-3' },
  { id: 'mock-tag-20', label: 'Pensativo', classification_id: 'mock-classification-3' },
  
  // Estados de Energía
  { id: 'mock-tag-21', label: 'Energético', classification_id: 'mock-classification-4' },
  { id: 'mock-tag-22', label: 'Cansado', classification_id: 'mock-classification-4' },
  { id: 'mock-tag-23', label: 'Relajado', classification_id: 'mock-classification-4' },
  { id: 'mock-tag-24', label: 'Activo', classification_id: 'mock-classification-4' },
  { id: 'mock-tag-25', label: 'Descansado', classification_id: 'mock-classification-4' }
];

// Simular delay de red
const simulateNetworkDelay = (ms = 200) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simular error ocasional
const simulateError = () => {
  return Math.random() < 0.03; // 3% de probabilidad de error
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

// Obtener clasificaciones emocionales
export const getEmotionalClassifications = async () => {
  try {
    await simulateNetworkDelay(150);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockClassifications,
      error: null
    };
  } catch (error) {
    console.error('Error fetching emotional classifications:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Obtener etiquetas emocionales
export const getEmotionalTags = async () => {
  try {
    await simulateNetworkDelay(150);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    return {
      data: mockTags,
      error: null
    };
  } catch (error) {
    console.error('Error fetching emotional tags:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Guardar seguimiento emocional
export const saveEmotionalTracking = async (trackingData) => {
  try {
    await simulateNetworkDelay(300);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    const newTracking = {
      id: `mock-tracking-${Date.now()}`,
      student_id: trackingData.student_id,
      text: trackingData.text,
      tags: trackingData.tags || [],
      primary_emotion: trackingData.primary_emotion || 'neutral',
      mood_score: trackingData.mood_score || 5,
      energy_level: trackingData.energy_level || 5,
      stress_level: trackingData.stress_level || 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Simular guardado exitoso
    console.log('Emotional tracking saved:', newTracking);
    
    return {
      data: newTracking,
      error: null
    };
  } catch (error) {
    console.error('Error saving emotional tracking:', error);
    return {
      data: null,
      error: { message: error.message }
    };
  }
};

// Servicio principal
const mockEmotionalDataService = {
  getEmotionalClassifications,
  getEmotionalTags,
  saveEmotionalTracking
};

export default mockEmotionalDataService;
