// Configuración para el sistema PIAR
// Cambiar USE_MOCK_DATA a false cuando la tabla piars esté disponible en Supabase

export const PIAR_CONFIG = {
  // Cambiar a false cuando la tabla piars esté creada en Supabase
  USE_MOCK_DATA: true,
  
  // Configuración para datos mock
  MOCK_CONFIG: {
    // Simular delay de red (en milisegundos)
    NETWORK_DELAY: 800,
    
    // Número de PIARs mock a mostrar
    DEFAULT_PIAR_COUNT: 4,
    
    // Mostrar indicadores de modo demo
    SHOW_DEMO_INDICATORS: true
  },
  
  // Configuración para Supabase
  SUPABASE_CONFIG: {
    // Nombre de la tabla
    TABLE_NAME: 'piars',
    
    // Campos a seleccionar por defecto
    DEFAULT_SELECT: `
      *,
      student:user_profiles!piars_student_id_fkey(full_name, email, grade)
    `,
    
    // Orden por defecto
    DEFAULT_ORDER: 'created_at.desc'
  },
  
  // Configuración de la UI
  UI_CONFIG: {
    // Duración de animaciones (en milisegundos)
    ANIMATION_DURATION: 300,
    
    // Número de elementos por página en listas
    ITEMS_PER_PAGE: 12,
    
    // Tiempo de auto-refresh (en milisegundos, 0 para deshabilitar)
    AUTO_REFRESH_INTERVAL: 0,
    
    // Mostrar logs de debug en consola
    DEBUG_LOGS: true
  }
};

// Función helper para verificar si usar datos mock
export const shouldUseMockData = () => {
  return PIAR_CONFIG.USE_MOCK_DATA;
};

// Función helper para obtener configuración de mock
export const getMockConfig = () => {
  return PIAR_CONFIG.MOCK_CONFIG;
};

// Función helper para obtener configuración de Supabase
export const getSupabaseConfig = () => {
  return PIAR_CONFIG.SUPABASE_CONFIG;
};

// Función helper para obtener configuración de UI
export const getUIConfig = () => {
  return PIAR_CONFIG.UI_CONFIG;
};
