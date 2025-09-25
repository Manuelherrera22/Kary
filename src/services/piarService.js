// Servicio para manejar datos de PIAR (Plan Individual de Apoyo y Refuerzo)
import unifiedDataService from './unifiedDataService.js';

class PiarService {
  constructor() {
    this.piars = new Map();
    this.initializePiars();
  }

  // Inicializar datos de PIAR para estudiantes
  initializePiars() {
    // PIAR DETALLADO para Ana García (TDAH) - VERSIÓN ESPECTACULAR
    this.piars.set('student-1', {
      id: 'piar-1',
      studentId: 'student-1',
      studentName: 'Ana García',
      age: 9,
      grade: '4to Primaria',
      diagnostic: 'TDAH Tipo Combinado (Hiperactivo-Impulsivo + Déficit de Atención)',
      diagnosticDetails: {
        severity: 'Moderado',
        onset: 'Desde los 6 años',
        comorbidities: ['Dificultades de aprendizaje en matemáticas', 'Ansiedad leve'],
        assessment: 'Evaluación psicopedagógica completa realizada en enero 2024'
      },
      
      // FORTALEZAS DETALLADAS
      strengths: [
        'Creatividad artística excepcional - Destaca en dibujo y pintura',
        'Memoria visual superior - Recuerda imágenes y detalles visuales con facilidad',
        'Capacidad de liderazgo natural - Organiza actividades grupales espontáneamente',
        'Empatía hacia otros - Sensible a las emociones de compañeros',
        'Energía positiva - Contagia entusiasmo al grupo',
        'Pensamiento divergente - Genera ideas creativas únicas',
        'Habilidades motoras finas desarrolladas - Buena coordinación en actividades manuales',
        'Memoria a largo plazo excelente - Recuerda eventos de hace años con detalle',
        'Capacidad de trabajo en equipo - Colabora bien cuando está motivada',
        'Curiosidad insaciable - Hace preguntas profundas sobre temas de interés'
      ],
      
      // NECESIDADES ESPECÍFICAS DETALLADAS
      needs: [
        'Apoyo en atención sostenida - Dificultad para mantener foco más de 10 minutos',
        'Estrategias de organización - Desorganización en materiales y tareas',
        'Control de impulsos - Interrumpe conversaciones y actividades',
        'Gestión del tiempo - Subestima tiempo necesario para tareas',
        'Regulación emocional - Reacciones intensas ante frustración',
        'Habilidades de estudio - No tiene estrategias de aprendizaje efectivas',
        'Autocontrol motor - Movimiento constante, dificultad para estar quieta',
        'Memoria de trabajo - Olvida instrucciones complejas',
        'Planificación ejecutiva - Dificultad para organizar pasos de tareas',
        'Tolerancia a la frustración - Abandona tareas cuando se complican'
      ],
      
      // OBJETIVOS DETALLADOS POR PERÍODO
      objectives: {
        shortTerm: [
          'Mantener atención en tareas académicas por 15 minutos consecutivos',
          'Completar tareas de matemáticas sin interrupciones frecuentes',
          'Usar agenda visual diaria correctamente durante 5 días seguidos',
          'Implementar técnica de respiración antes de actividades que requieren concentración',
          'Reducir interrupciones en clase a máximo 3 por día',
          'Organizar materiales de trabajo al inicio y final de cada clase'
        ],
        mediumTerm: [
          'Desarrollar estrategias de autorregulación emocional efectivas',
          'Mejorar organización de materiales y espacio de trabajo',
          'Participar activamente en clase sin interrumpir a otros',
          'Aplicar técnicas de estudio visuales para matemáticas',
          'Mantener rutina de estudio en casa durante 2 semanas consecutivas',
          'Desarrollar habilidades de planificación para proyectos escolares'
        ],
        longTerm: [
          'Lograr autonomía en gestión del tiempo y organización',
          'Desarrollar habilidades de estudio adaptadas a su estilo de aprendizaje',
          'Mantener rendimiento académico estable en todas las materias',
          'Aplicar estrategias de autorregulación de forma independiente',
          'Contribuir positivamente al ambiente de clase con su creatividad',
          'Prepararse para transición exitosa a 5to grado'
        ]
      },
      
      // ADAPTACIONES ESPECÍFICAS DETALLADAS
      adaptations: [
        'Ubicación preferencial en primera fila, cerca del profesor',
        'Tiempo extra del 25% para tareas escritas y exámenes',
        'Instrucciones por pasos con apoyo visual',
        'Uso de apoyos visuales en pared (horarios, reglas, recordatorios)',
        'Refuerzo positivo inmediato por comportamientos apropiados',
        'Permisos para moverse durante actividades largas (cada 20 minutos)',
        'Acceso a materiales manipulativos para matemáticas',
        'Opciones de respuesta múltiple en evaluaciones cuando sea posible',
        'Ambiente de trabajo con mínimas distracciones visuales',
        'Tiempo de transición extendido entre actividades',
        'Uso de señal visual para recordar reglas de clase',
        'Acceso a espacio de "descanso activo" cuando sea necesario'
      ],
      
      // RECURSOS ESPECIALIZADOS DETALLADOS
      resources: [
        'Agenda visual con pictogramas y colores',
        'Timer visual para tareas (Time Timer)',
        'Materiales organizados por colores por materia',
        'Apoyos visuales en pared (reglas, horarios, recordatorios)',
        'Sistema de recompensas con tokens y refuerzos tangibles',
        'Cojín de movimiento para la silla',
        'Fidget toys apropiados para la edad',
        'Calculadora para operaciones básicas',
        'Grabadora de voz para dictar respuestas',
        'Software de organización visual (MindMeister)',
        'Libros con imágenes y diagramas para matemáticas',
        'Materiales multisensoriales para aprendizaje',
        'Cronómetro visual para gestión del tiempo',
        'Carpeta organizadora con separadores por colores',
        'Pizarra pequeña para notas y recordatorios'
      ],
      
      // EVALUACIÓN DETALLADA
      evaluation: {
        frequency: 'Semanal',
        methods: [
          'Observación directa estructurada',
          'Registro de comportamiento con escala de 1-5',
          'Autoevaluación con apoyo visual',
          'Entrevista con estudiante',
          'Revisión de trabajos y tareas completadas',
          'Feedback de profesores y compañeros'
        ],
        indicators: [
          'Tiempo de atención sostenida en tareas académicas',
          'Completitud de tareas asignadas',
          'Uso de estrategias de autorregulación',
          'Comportamiento apropiado en clase',
          'Organización de materiales personales',
          'Participación positiva en actividades grupales',
          'Aplicación de técnicas de estudio',
          'Control de impulsos verbales y motores',
          'Gestión del tiempo en tareas',
          'Expresión emocional apropiada'
        ],
        tools: [
          'Escala de Conners para TDAH',
          'Registro ABC (Antecedente-Comportamiento-Consecuencia)',
          'Lista de verificación de habilidades ejecutivas',
          'Diario de comportamiento con apoyo visual',
          'Evaluación de progreso académico adaptada'
        ]
      },
      
      // COLABORACIÓN DETALLADA
      collaboration: {
        family: [
          'Establecer rutinas consistentes en casa (horarios fijos)',
          'Reforzar estrategias aprendidas en la escuela',
          'Comunicación diaria con escuela a través de agenda',
          'Crear espacio de estudio organizado y sin distracciones',
          'Implementar sistema de recompensas en casa',
          'Practicar técnicas de relajación y respiración',
          'Supervisar tiempo de pantalla y actividades',
          'Participar en actividades físicas regulares',
          'Mantener comunicación positiva y apoyo emocional',
          'Coordinar con terapeuta externo si es necesario'
        ],
        teachers: [
          'Implementar todas las adaptaciones recomendadas',
          'Registrar progreso diario en comportamiento y académico',
          'Coordinar con psicopedagogo semanalmente',
          'Proporcionar feedback positivo inmediato',
          'Adaptar metodologías de enseñanza a su estilo visual',
          'Permitir movimiento controlado durante clases',
          'Usar refuerzos visuales y materiales manipulativos',
          'Comunicar cambios de comportamiento a la familia',
          'Facilitar integración social positiva',
          'Ajustar expectativas según capacidades individuales'
        ],
        professionals: [
          'Seguimiento psicológico mensual con especialista en TDAH',
          'Evaluación psicopedagógica trimestral',
          'Ajuste de estrategias según progreso observado',
          'Coordinación con terapeuta ocupacional si es necesario',
          'Evaluación de medicación con psiquiatra pediátrico',
          'Seguimiento de comorbilidades (ansiedad, dificultades de aprendizaje)',
          'Capacitación a profesores sobre TDAH y estrategias',
          'Apoyo a la familia en manejo del comportamiento',
          'Evaluación de necesidades de tecnología asistiva',
          'Preparación para transiciones educativas futuras'
        ]
      },
      
      // INFORMACIÓN ADICIONAL ESPECÍFICA
      learningStyle: 'Visual-Kinestésico',
      interests: ['Arte', 'Música', 'Animales', 'Ciencia', 'Deportes'],
      triggers: ['Ruidos fuertes', 'Cambios inesperados', 'Tareas muy largas', 'Críticas públicas'],
      motivators: ['Reconocimiento público', 'Actividades creativas', 'Tiempo con amigos', 'Proyectos artísticos'],
      
      // SEGUIMIENTO MÉDICO
      medicalInfo: {
        medication: 'En evaluación con psiquiatra pediátrico',
        lastEvaluation: 'Enero 2024',
        nextAppointment: 'Abril 2024',
        specialConsiderations: 'Monitorear efectos de medicación en apetito y sueño'
      },
      
      // METAS ESPECÍFICAS POR MATERIA
      subjectGoals: {
        mathematics: [
          'Mejorar comprensión de operaciones básicas usando materiales visuales',
          'Desarrollar estrategias para resolver problemas paso a paso',
          'Aumentar precisión en cálculos con apoyo de calculadora cuando sea necesario'
        ],
        language: [
          'Mejorar comprensión lectora usando estrategias visuales',
          'Desarrollar habilidades de escritura con apoyo de organizadores gráficos',
          'Aumentar vocabulario a través de actividades creativas'
        ],
        science: [
          'Aprovechar curiosidad natural para proyectos de investigación',
          'Usar habilidades visuales para experimentos y observaciones',
          'Desarrollar habilidades de registro de datos'
        ],
        art: [
          'Aprovechar creatividad excepcional para proyectos escolares',
          'Usar arte como herramienta de expresión emocional',
          'Desarrollar técnicas artísticas avanzadas'
        ]
      },
      
      status: 'active',
      lastUpdate: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'Psicopedagogo Principal',
      reviewedBy: 'Equipo Multidisciplinario',
      priority: 'Alta - Requiere seguimiento intensivo'
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


