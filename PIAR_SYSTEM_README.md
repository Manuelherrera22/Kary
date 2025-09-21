# Sistema PIAR - Plan Individual de Ajustes Razonables

## 📋 Descripción

El Sistema PIAR es una funcionalidad completa que permite crear, gestionar y implementar Planes Individuales de Ajustes Razonables para cada estudiante. Este sistema entiende la situación específica de cada niño y diseña actividades personalizadas basadas en sus necesidades únicas.

## 🚀 Características Principales

### 1. **Creación de PIARs**
- **Información diagnóstica**: Estilo de aprendizaje, capacidad de atención, niveles académicos
- **Necesidades específicas**: Académicas, conductuales, sociales, emocionales, físicas
- **Ajustes razonables**: Instruccionales, ambientales, de evaluación, conductuales
- **Objetivos medibles**: Con fechas objetivo y seguimiento de progreso
- **Estrategias de enseñanza**: Personalizadas por materia

### 2. **Generador de Actividades Personalizadas**
- **Análisis inteligente**: Basado en las necesidades específicas del PIAR
- **Filtros avanzados**: Por materia, dificultad, duración
- **Solicitudes personalizadas**: Creación de actividades específicas
- **Adaptaciones automáticas**: Basadas en el perfil del estudiante
- **Materiales sugeridos**: Según las necesidades identificadas

### 3. **Dashboard de Gestión**
- **Vista general**: Estadísticas y métricas clave
- **Filtros y búsqueda**: Para encontrar PIARs específicos
- **Seguimiento de progreso**: Visualización del avance
- **Acceso directo**: A actividades personalizadas
- **Gestión completa**: Crear, editar, duplicar PIARs

## 🛠️ Instalación y Configuración

### 1. **Archivos Creados**
```
src/
├── hooks/
│   └── usePIARData.js                 # Hook para manejar datos de PIARs
├── components/
│   ├── PIARModal.jsx                  # Modal para crear/editar PIARs
│   ├── PersonalizedActivityGenerator.jsx # Generador de actividades
│   └── PIARDashboard.jsx              # Dashboard principal de PIARs
├── locales/
│   └── es/
│       └── piar.json                  # Traducciones en español
└── create-piar-table.sql              # Script SQL para crear tabla en Supabase
```

### 2. **Integración en Dashboard**
- Nueva tab "PIARs" agregada al dashboard del psicopedagogo
- Integración completa con el sistema existente
- Acceso desde la navegación principal

## 📊 Estructura de Datos

### **PIAR Object**
```javascript
{
  id: "piar-1",
  student_id: "student-1",
  student_name: "María García",
  created_by: "psychopedagogue-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  status: "active",
  
  // Información diagnóstica
  diagnostic_info: {
    learning_style: "visual",
    attention_span: "medium",
    reading_level: "intermediate",
    math_level: "intermediate",
    social_skills: "developing",
    emotional_regulation: "developing",
    physical_needs: "none",
    communication_style: "verbal_preferred"
  },
  
  // Necesidades específicas
  specific_needs: [
    {
      category: "academic",
      need: "reading_support",
      description: "Necesita apoyo adicional en comprensión lectora",
      priority: "high",
      strategies: ["lectura guiada", "materiales visuales", "repetición"]
    }
  ],
  
  // Ajustes razonables
  reasonable_adjustments: [
    {
      type: "instructional",
      adjustment: "extended_time",
      description: "Tiempo extendido para tareas de lectura",
      implementation: "Proporcionar 50% más tiempo para actividades de comprensión lectora"
    }
  ],
  
  // Objetivos
  goals: [
    {
      id: "goal-1",
      description: "Mejorar comprensión lectora en un 30%",
      target_date: "2024-06-30",
      progress: 45,
      strategies: ["lectura diaria", "preguntas de comprensión", "material visual"]
    }
  ],
  
  // Estrategias de enseñanza
  teaching_strategies: [
    {
      subject: "mathematics",
      strategies: [
        "Usar manipulativos y materiales concretos",
        "Proporcionar ejemplos visuales paso a paso",
        "Permitir tiempo adicional para procesar información"
      ]
    }
  ],
  
  // Actividades recomendadas
  recommended_activities: [
    {
      id: "activity-1",
      type: "reading_comprehension",
      title: "Lectura con imágenes",
      description: "Actividad de comprensión lectora usando imágenes como apoyo visual",
      duration: 15,
      difficulty: "beginner",
      materials: ["texto corto", "imágenes relacionadas", "preguntas simples"],
      adaptations: ["tiempo extendido", "apoyo visual", "instrucciones claras"]
    }
  ],
  
  // Seguimiento de progreso
  progress_tracking: {
    last_assessment: "2024-03-15",
    next_review: "2024-04-15",
    overall_progress: 60,
    areas_improving: ["atención", "comprensión lectora"],
    areas_needing_work: ["interacción social", "tiempo de concentración"]
  }
}
```

## 🔧 Uso del Sistema

### **1. Crear un PIAR**
1. Ir al dashboard del psicopedagogo
2. Hacer clic en la tab "PIARs"
3. Hacer clic en "Crear Nuevo PIAR"
4. Seleccionar el estudiante
5. Completar la información diagnóstica
6. Agregar necesidades específicas
7. Definir ajustes razonables
8. Establecer objetivos medibles
9. Guardar el PIAR

### **2. Generar Actividades Personalizadas**
1. Desde el dashboard de PIARs, hacer clic en "Actividades" en cualquier PIAR
2. Ajustar los filtros (materia, dificultad, duración)
3. Opcionalmente, agregar una solicitud personalizada
4. Hacer clic en "Generar Actividades Personalizadas"
5. Revisar las actividades generadas
6. Implementar las actividades seleccionadas

### **3. Gestionar PIARs**
1. Usar los filtros para encontrar PIARs específicos
2. Ver el progreso general en las tarjetas
3. Hacer clic en "Editar" para modificar un PIAR
4. Ver estadísticas detalladas en el dashboard

## 🗄️ Base de Datos

### **Modo Mock (Actual)**
- El sistema usa datos mock por defecto
- No requiere configuración de base de datos
- Funciona inmediatamente después de la instalación

### **Modo Supabase (Opcional)**
Para usar datos reales en Supabase:

1. **Ejecutar el script SQL**:
   ```sql
   -- Ejecutar create-piar-table.sql en el SQL Editor de Supabase
   ```

2. **Configurar políticas RLS**:
   - Los psicopedagogos pueden crear, leer y actualizar todos los PIARs
   - Los profesores pueden leer PIARs de sus estudiantes
   - Los padres pueden leer PIARs de sus hijos

3. **El sistema detectará automáticamente** la tabla y usará datos reales

## 🎯 Beneficios

### **Para Estudiantes**
- **Educación personalizada**: Actividades adaptadas a sus necesidades específicas
- **Progreso medible**: Objetivos claros y seguimiento continuo
- **Apoyo integral**: Considera aspectos académicos, sociales y emocionales

### **Para Educadores**
- **Herramientas eficientes**: Creación rápida de planes personalizados
- **Actividades sugeridas**: Generación automática basada en necesidades
- **Seguimiento centralizado**: Vista completa del progreso de cada estudiante

### **Para el Sistema**
- **Cumplimiento normativo**: Alineado con estándares de educación inclusiva
- **Escalabilidad**: Fácil gestión de múltiples estudiantes
- **Integración**: Funciona con el ecosistema existente de Kary

## 🔮 Futuras Mejoras

### **Funcionalidades Planificadas**
- **IA avanzada**: Recomendaciones más precisas basadas en machine learning
- **Colaboración**: Herramientas para trabajo en equipo entre educadores
- **Reportes**: Generación automática de reportes de progreso
- **Notificaciones**: Alertas automáticas para revisiones y actualizaciones
- **Integración con calendario**: Programación automática de actividades

### **Integraciones**
- **Sistemas de evaluación**: Conexión con plataformas de evaluación
- **Recursos educativos**: Integración con bibliotecas de contenido
- **Comunicación**: Notificaciones a padres y estudiantes
- **Analytics**: Dashboard de métricas avanzadas

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema PIAR:
- Revisar la documentación técnica en el código
- Consultar los logs de la consola del navegador
- Verificar la configuración de Supabase si se usa modo real

---

**Sistema PIAR v1.0** - Desarrollado para Kary AI Platform
