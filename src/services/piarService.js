// Servicio para manejar datos de PIAR (Plan Individual de Apoyo y Refuerzo)
import unifiedDataService from './unifiedDataService.js';

class PiarService {
  constructor() {
    this.piars = new Map();
    this.initializePiars();
  }

  // Inicializar datos de PIAR para estudiantes
  initializePiars() {
    // PIAR para Ana García (TDAH)
    this.piars.set('student-1', {
      id: 'piar-1',
      studentId: 'student-1',
      studentName: 'Ana García',
      diagnostic: 'TDAH',
      strengths: [
        'Creatividad artística',
        'Memoria visual',
        'Capacidad de liderazgo',
        'Empatía hacia otros'
      ],
      needs: [
        'Apoyo en atención sostenida',
        'Estrategias de organización',
        'Control de impulsos',
        'Gestión del tiempo'
      ],
      objectives: {
        shortTerm: [
          'Mantener atención en tareas por 15 minutos',
          'Completar tareas sin interrupciones frecuentes',
          'Usar agenda diaria correctamente'
        ],
        mediumTerm: [
          'Desarrollar estrategias de autorregulación',
          'Mejorar organización de materiales',
          'Participar activamente en clase'
        ],
        longTerm: [
          'Lograr autonomía en gestión del tiempo',
          'Desarrollar habilidades de estudio',
          'Mantener rendimiento académico estable'
        ]
      },
      adaptations: [
        'Ubicación preferencial en clase',
        'Tiempo extra para tareas',
        'Instrucciones por pasos',
        'Uso de apoyos visuales',
        'Refuerzo positivo frecuente'
      ],
      resources: [
        'Agenda visual',
        'Timer para tareas',
        'Materiales organizados por colores',
        'Apoyos visuales en pared',
        'Sistema de recompensas'
      ],
      evaluation: {
        frequency: 'Semanal',
        methods: ['Observación directa', 'Registro de comportamiento', 'Autoevaluación'],
        indicators: [
          'Tiempo de atención sostenida',
          'Completitud de tareas',
          'Uso de estrategias',
          'Comportamiento en clase'
        ]
      },
      collaboration: {
        family: [
          'Establecer rutinas en casa',
          'Reforzar estrategias aprendidas',
          'Comunicación diaria con escuela'
        ],
        teachers: [
          'Implementar adaptaciones',
          'Registrar progreso',
          'Coordinar con psicopedagogo'
        ],
        professionals: [
          'Seguimiento psicológico',
          'Evaluación periódica',
          'Ajuste de estrategias'
        ]
      },
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
    });

    // PIAR para Carlos López (Dislexia)
    this.piars.set('student-2', {
      id: 'piar-2',
      studentId: 'student-2',
      studentName: 'Carlos López',
      diagnostic: 'Dislexia',
      strengths: [
        'Razonamiento lógico',
        'Creatividad',
        'Habilidades sociales',
        'Memoria auditiva'
      ],
      needs: [
        'Apoyo en lectura y escritura',
        'Estrategias de comprensión lectora',
        'Técnicas de estudio',
        'Confianza en habilidades académicas'
      ],
      objectives: {
        shortTerm: [
          'Mejorar velocidad de lectura',
          'Comprender textos básicos',
          'Escribir con menos errores ortográficos'
        ],
        mediumTerm: [
          'Desarrollar estrategias de lectura',
          'Mejorar comprensión lectora',
          'Usar herramientas de apoyo'
        ],
        longTerm: [
          'Lograr autonomía en lectura',
          'Desarrollar técnicas de estudio',
          'Mantener motivación académica'
        ]
      },
      adaptations: [
        'Tiempo extra para lectura',
        'Uso de audio-libros',
        'Texto con fuente grande',
        'Instrucciones orales',
        'Evaluaciones adaptadas'
      ],
      resources: [
        'Audio-libros',
        'Software de lectura',
        'Diccionario visual',
        'Regla de lectura',
        'Grabadora de voz'
      ],
      evaluation: {
        frequency: 'Quincenal',
        methods: ['Evaluación de lectura', 'Observación de progreso', 'Autoevaluación'],
        indicators: [
          'Velocidad de lectura',
          'Comprensión lectora',
          'Precisión ortográfica',
          'Confianza en lectura'
        ]
      },
      collaboration: {
        family: [
          'Lectura en casa',
          'Apoyo emocional',
          'Comunicación con escuela'
        ],
        teachers: [
          'Implementar adaptaciones',
          'Reforzar fortalezas',
          'Coordinar estrategias'
        ],
        professionals: [
          'Terapia de lenguaje',
          'Evaluación psicopedagógica',
          'Seguimiento especializado'
        ]
      },
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // PIAR para María Fernández (Ansiedad escolar)
    this.piars.set('student-3', {
      id: 'piar-3',
      studentId: 'student-3',
      studentName: 'María Fernández',
      diagnostic: 'Ansiedad escolar',
      strengths: [
        'Inteligencia emocional',
        'Creatividad artística',
        'Empatía',
        'Capacidad de reflexión'
      ],
      needs: [
        'Gestión de ansiedad',
        'Técnicas de relajación',
        'Confianza en sí misma',
        'Habilidades sociales'
      ],
      objectives: {
        shortTerm: [
          'Identificar síntomas de ansiedad',
          'Usar técnicas de relajación',
          'Participar en clase sin ansiedad'
        ],
        mediumTerm: [
          'Desarrollar estrategias de afrontamiento',
          'Mejorar autoestima',
          'Participar en actividades grupales'
        ],
        longTerm: [
          'Manejar ansiedad de forma independiente',
          'Desarrollar confianza académica',
          'Mantener bienestar emocional'
        ]
      },
      adaptations: [
        'Ambiente relajado en clase',
        'Tiempo para procesar información',
        'Opciones de participación',
        'Apoyo emocional disponible',
        'Evaluaciones sin presión'
      ],
      resources: [
        'Técnicas de respiración',
        'Materiales de relajación',
        'Diario emocional',
        'Apoyo psicológico',
        'Grupo de apoyo'
      ],
      evaluation: {
        frequency: 'Semanal',
        methods: ['Escala de ansiedad', 'Observación de comportamiento', 'Autoevaluación'],
        indicators: [
          'Nivel de ansiedad',
          'Participación en clase',
          'Uso de estrategias',
          'Bienestar emocional'
        ]
      },
      collaboration: {
        family: [
          'Apoyo emocional en casa',
          'Técnicas de relajación',
          'Comunicación abierta'
        ],
        teachers: [
          'Crear ambiente seguro',
          'Reconocer esfuerzos',
          'Coordinar con psicólogo'
        ],
        professionals: [
          'Terapia psicológica',
          'Evaluación emocional',
          'Seguimiento especializado'
        ]
      },
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // PIAR para Diego Martínez (Dificultades de atención)
    this.piars.set('student-4', {
      id: 'piar-4',
      studentId: 'student-4',
      studentName: 'Diego Martínez',
      diagnostic: 'Dificultades de atención',
      strengths: [
        'Creatividad',
        'Habilidades motoras',
        'Memoria a corto plazo',
        'Capacidad de trabajo en equipo'
      ],
      needs: [
        'Estrategias de atención',
        'Organización de tareas',
        'Gestión del tiempo',
        'Motivación académica'
      ],
      objectives: {
        shortTerm: [
          'Mantener atención por 10 minutos',
          'Completar tareas básicas',
          'Usar estrategias de organización'
        ],
        mediumTerm: [
          'Desarrollar técnicas de atención',
          'Mejorar organización',
          'Aumentar motivación'
        ],
        longTerm: [
          'Lograr autonomía en tareas',
          'Desarrollar hábitos de estudio',
          'Mantener rendimiento estable'
        ]
      },
      adaptations: [
        'Tareas divididas en pasos',
        'Tiempo extra para completar',
        'Instrucciones claras',
        'Refuerzo positivo',
        'Ambiente sin distracciones'
      ],
      resources: [
        'Timer visual',
        'Lista de tareas',
        'Materiales organizados',
        'Apoyos visuales',
        'Sistema de recompensas'
      ],
      evaluation: {
        frequency: 'Semanal',
        methods: ['Observación de atención', 'Registro de tareas', 'Autoevaluación'],
        indicators: [
          'Tiempo de atención',
          'Completitud de tareas',
          'Uso de estrategias',
          'Motivación'
        ]
      },
      collaboration: {
        family: [
          'Rutinas en casa',
          'Apoyo en tareas',
          'Comunicación con escuela'
        ],
        teachers: [
          'Implementar adaptaciones',
          'Reforzar esfuerzos',
          'Coordinar estrategias'
        ],
        professionals: [
          'Evaluación psicopedagógica',
          'Seguimiento especializado',
          'Ajuste de estrategias'
        ]
      },
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // PIAR para Sofía Rodríguez (Superdotación)
    this.piars.set('student-5', {
      id: 'piar-5',
      studentId: 'student-5',
      studentName: 'Sofía Rodríguez',
      diagnostic: 'Superdotación',
      strengths: [
        'Alta capacidad intelectual',
        'Creatividad excepcional',
        'Curiosidad insaciable',
        'Capacidad de liderazgo'
      ],
      needs: [
        'Desafíos académicos apropiados',
        'Desarrollo de habilidades sociales',
        'Gestión de perfeccionismo',
        'Motivación continua'
      ],
      objectives: {
        shortTerm: [
          'Acceder a contenidos avanzados',
          'Desarrollar proyectos creativos',
          'Participar en actividades desafiantes'
        ],
        mediumTerm: [
          'Profundizar en áreas de interés',
          'Desarrollar habilidades sociales',
          'Manejar expectativas altas'
        ],
        longTerm: [
          'Mantener motivación académica',
          'Desarrollar potencial completo',
          'Contribuir positivamente al grupo'
        ]
      },
      adaptations: [
        'Contenidos enriquecidos',
        'Proyectos independientes',
        'Aceleración en áreas fuertes',
        'Mentoría con especialistas',
        'Participación en competencias'
      ],
      resources: [
        'Materiales avanzados',
        'Acceso a recursos especializados',
        'Mentoría académica',
        'Programas de enriquecimiento',
        'Tecnología avanzada'
      ],
      evaluation: {
        frequency: 'Mensual',
        methods: ['Evaluación de productos', 'Observación de progreso', 'Autoevaluación'],
        indicators: [
          'Calidad de trabajos',
          'Profundidad de comprensión',
          'Creatividad en soluciones',
          'Motivación y engagement'
        ]
      },
      collaboration: {
        family: [
          'Apoyo en proyectos',
          'Acceso a recursos',
          'Comunicación con escuela'
        ],
        teachers: [
          'Proporcionar desafíos',
          'Reconocer logros',
          'Coordinar enriquecimiento'
        ],
        professionals: [
          'Evaluación de capacidades',
          'Programas especializados',
          'Seguimiento del desarrollo'
        ]
      },
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Obtener PIAR por ID de estudiante
  getPiarByStudentId(studentId) {
    return this.piars.get(studentId) || null;
  }

  // Obtener todos los PIARs
  getAllPiars() {
    return Array.from(this.piars.values());
  }

  // Obtener PIARs por diagnóstico
  getPiarsByDiagnostic(diagnostic) {
    return Array.from(this.piars.values()).filter(piar => 
      piar.diagnostic.toLowerCase().includes(diagnostic.toLowerCase())
    );
  }

  // Crear nuevo PIAR
  createPiar(piarData) {
    const newPiar = {
      id: `piar-${Date.now()}`,
      ...piarData,
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    this.piars.set(piarData.studentId, newPiar);
    return newPiar;
  }

  // Actualizar PIAR
  updatePiar(studentId, updates) {
    const existingPiar = this.piars.get(studentId);
    if (!existingPiar) return null;

    const updatedPiar = {
      ...existingPiar,
      ...updates,
      lastUpdate: new Date().toISOString()
    };

    this.piars.set(studentId, updatedPiar);
    return updatedPiar;
  }

  // Obtener objetivos del PIAR por período
  getPiarObjectives(studentId, period = 'all') {
    const piar = this.piars.get(studentId);
    if (!piar) return null;

    if (period === 'shortTerm') return piar.objectives.shortTerm;
    if (period === 'mediumTerm') return piar.objectives.mediumTerm;
    if (period === 'longTerm') return piar.objectives.longTerm;
    
    return piar.objectives;
  }

  // Obtener adaptaciones del PIAR
  getPiarAdaptations(studentId) {
    const piar = this.piars.get(studentId);
    return piar ? piar.adaptations : null;
  }

  // Obtener recursos del PIAR
  getPiarResources(studentId) {
    const piar = this.piars.get(studentId);
    return piar ? piar.resources : null;
  }

  // Verificar si un estudiante tiene PIAR activo
  hasActivePiar(studentId) {
    const piar = this.piars.get(studentId);
    return piar && piar.status === 'active';
  }

  // Obtener datos de PIAR para generación de actividades
  getPiarForActivityGeneration(studentId) {
    const piar = this.piars.get(studentId);
    if (!piar) return null;

    return {
      diagnostic: piar.diagnostic,
      strengths: piar.strengths,
      needs: piar.needs,
      objectives: piar.objectives,
      adaptations: piar.adaptations,
      resources: piar.resources,
      evaluation: piar.evaluation
    };
  }
}

const piarService = new PiarService();
export default piarService;


