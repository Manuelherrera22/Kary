// Sistema de autenticación mock para desarrollo
// Este archivo contiene datos de prueba para cuando Supabase no está disponible

export const MOCK_USERS = [
  {
    id: 'mock-admin-1',
    email: 'admin@kary.com',
    full_name: 'Administrador Kary',
    role: 'admin',
    status: 'active',
    grade: null,
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-student-1',
    email: 'estudiante@kary.com',
    full_name: 'María García Estudiante',
    role: 'student',
    status: 'active',
    grade: '5to Primaria',
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-student-2',
    email: 'ana.lopez@estudiante.com',
    full_name: 'Ana López Martínez',
    role: 'student',
    status: 'active',
    grade: '4to Primaria',
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-student-3',
    email: 'carlos.ruiz@estudiante.com',
    full_name: 'Carlos Ruiz Fernández',
    role: 'student',
    status: 'active',
    grade: '6to Primaria',
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-student-4',
    email: 'sofia.gonzalez@estudiante.com',
    full_name: 'Sofía González Silva',
    role: 'student',
    status: 'active',
    grade: '3ro Primaria',
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-teacher-1',
    email: 'profesor@kary.com',
    full_name: 'Carlos López Profesor',
    role: 'teacher',
    status: 'active',
    grade: null,
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-parent-1',
    email: 'padre@kary.com',
    full_name: 'Ana Rodríguez Madre',
    role: 'parent',
    status: 'active',
    grade: null,
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-psychopedagogue-1',
    email: 'psicopedagogo@kary.com',
    full_name: 'Dr. Luis Martínez Psicopedagogo',
    role: 'psychopedagogue',
    status: 'active',
    grade: null,
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-directive-1',
    email: 'directivo@kary.com',
    full_name: 'Lic. Patricia Silva Directora',
    role: 'directive',
    status: 'active',
    grade: null,
    preferred_language: 'es',
    timezone: 'America/Mexico_City',
    notifications_enabled: true,
    password_hash: 'kary123456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_EMAILS = MOCK_USERS.map(user => user.email);

// Función para simular delay de red
export const simulateNetworkDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Función para simular error de red ocasional
export const simulateNetworkError = () => {
  return Math.random() < 0.1; // 10% de probabilidad de error
};

