// Servicio mock para tareas del estudiante
import { CustomAuth } from '@/lib/customAuth';

// Datos mock para tareas
const mockTasks = [
  {
    id: 'mock-task-1',
    user_id: 'mock-student-1',
    title: 'Completar ejercicio de matemáticas',
    description: 'Resolver los problemas de la página 45 del libro de texto',
    due_date: '2025-09-20',
    completed: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'mock-task-2',
    user_id: 'mock-student-1',
    title: 'Leer capítulo 3 de ciencias',
    description: 'Estudiar el tema de fotosíntesis y preparar resumen',
    due_date: '2025-09-23',
    completed: true,
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-16T09:15:00Z'
  },
  {
    id: 'mock-task-3',
    user_id: 'mock-student-1',
    title: 'Preparar presentación de historia',
    description: 'Crear una presentación sobre la Revolución Francesa',
    due_date: '2025-09-25',
    completed: false,
    created_at: '2024-01-13T16:45:00Z',
    updated_at: '2024-01-13T16:45:00Z'
  },
  {
    id: 'mock-task-4',
    user_id: 'mock-student-1',
    title: 'Ejercicios de inglés',
    description: 'Completar las actividades de gramática del workbook',
    due_date: '2025-09-22',
    completed: false,
    created_at: '2024-01-12T11:20:00Z',
    updated_at: '2024-01-12T11:20:00Z'
  },
  {
    id: 'mock-task-5',
    user_id: 'mock-student-1',
    title: 'Proyecto de arte',
    description: 'Crear un collage sobre la naturaleza',
    due_date: '2025-09-28',
    completed: true,
    created_at: '2024-01-11T13:10:00Z',
    updated_at: '2024-01-17T15:30:00Z'
  }
];

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
  
  if (currentUser.role !== 'student') {
    throw new Error('Access denied: Student role required');
  }
  
  return currentUser;
};

// Obtener tareas del estudiante
export const getStudentTasks = async (userId) => {
  try {
    await simulateNetworkDelay(200);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    // Filtrar tareas del usuario actual
    const userTasks = mockTasks.filter(task => task.user_id === userId);
    
    return userTasks;
  } catch (error) {
    console.error('Error fetching student tasks:', error);
    throw error;
  }
};

// Actualizar estado de tarea
export const updateTaskStatus = async (taskId, completed) => {
  try {
    await simulateNetworkDelay(150);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    // Buscar la tarea
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }
    
    // Actualizar la tarea
    const updatedTask = {
      ...mockTasks[taskIndex],
      completed,
      updated_at: new Date().toISOString()
    };
    
    mockTasks[taskIndex] = updatedTask;
    
    return updatedTask;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Crear nueva tarea
export const createTask = async (taskData) => {
  try {
    await simulateNetworkDelay(250);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    const newTask = {
      id: `mock-task-${Date.now()}`,
      user_id: taskData.user_id,
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.due_date,
      completed: taskData.completed || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Agregar a la lista de tareas
    mockTasks.unshift(newTask);
    
    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Eliminar tarea
export const deleteTask = async (taskId) => {
  try {
    await simulateNetworkDelay(150);
    
    if (simulateError()) {
      throw new Error('Error temporal de conexión. Intenta nuevamente.');
    }
    
    checkAuth();
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }
    
    // Eliminar la tarea
    const deletedTask = mockTasks.splice(taskIndex, 1)[0];
    
    return deletedTask;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Servicio principal
const mockTaskService = {
  getStudentTasks,
  updateTaskStatus,
  createTask,
  deleteTask
};

export default mockTaskService;