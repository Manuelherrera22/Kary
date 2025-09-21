import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

/**
 * Servicio de comunicación entre psicopedagogo y docente
 * Maneja la transferencia de planes de apoyo y actividades generadas por IA
 */

// Configuración del servicio
const COMMUNICATION_CONFIG = {
  TABLE_NAME: 'teacher_communications',
  NETWORK_DELAY: 1000,
  STATUS_TYPES: {
    PENDING: 'pending',
    SENT: 'sent',
    ACKNOWLEDGED: 'acknowledged',
    IMPLEMENTED: 'implemented',
    REVIEWED: 'reviewed'
  },
  PRIORITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  }
};

/**
 * Envía un plan de apoyo al docente
 */
export const sendSupportPlanToTeacher = async (planData, teacherId, studentId) => {
  console.log('📤 Enviando plan de apoyo al docente...', { planData, teacherId, studentId });
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, COMMUNICATION_CONFIG.NETWORK_DELAY));
    
    const communication = {
      id: `comm-${Date.now()}`,
      type: 'support_plan',
      from_role: 'psychopedagogue',
      to_role: 'teacher',
      teacher_id: teacherId,
      student_id: studentId,
      subject: `Plan de Apoyo - ${planData.studentName}`,
      content: formatSupportPlanForTeacher(planData),
      priority: determinePriority(planData),
      status: COMMUNICATION_CONFIG.STATUS_TYPES.SENT,
      created_at: new Date().toISOString(),
      metadata: {
        plan_id: planData.id,
        activities_count: planData.activities.length,
        implementation_timeline: planData.implementation.timeline,
        ai_analysis: planData.aiAnalysis
      }
    };
    
    // En modo mock, simular envío exitoso
    console.log('✅ Plan enviado al docente:', communication);
    
    return {
      success: true,
      communication,
      message: 'Plan de apoyo enviado exitosamente al docente'
    };
    
  } catch (error) {
    console.error('❌ Error enviando plan al docente:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error enviando plan de apoyo al docente'
    };
  }
};

/**
 * Obtiene comunicaciones para un docente
 */
export const getTeacherCommunications = async (teacherId, status = null) => {
  console.log('📥 Obteniendo comunicaciones para docente...', { teacherId, status });
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, COMMUNICATION_CONFIG.NETWORK_DELAY));
    
    // Datos mock para demostración
    const mockCommunications = [
      {
        id: 'comm-1',
        type: 'support_plan',
        from_role: 'psychopedagogue',
        teacher_id: teacherId,
        student_id: 'mock-student-1',
        subject: 'Plan de Apoyo - Ana López Martínez',
        content: 'Plan de apoyo generado por IA para estudiante con necesidades específicas',
        priority: 'high',
        status: 'sent',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        metadata: {
          plan_id: 'plan-1',
          activities_count: 5,
          implementation_timeline: '1-2 meses',
          ai_analysis: {
            learningProfile: { style: 'visual', attention: 'short' },
            priorityNeeds: [{ category: 'academic', need: 'reading_support', priority: 'high' }],
            strengths: [{ area: 'Comunicación Verbal', description: 'Prefiere comunicación oral' }]
          }
        }
      },
      {
        id: 'comm-2',
        type: 'support_plan',
        from_role: 'psychopedagogue',
        teacher_id: teacherId,
        student_id: 'mock-student-2',
        subject: 'Plan de Apoyo - Carlos Ruiz Fernández',
        content: 'Plan de apoyo generado por IA para estudiante con dificultades de atención',
        priority: 'medium',
        status: 'acknowledged',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
        metadata: {
          plan_id: 'plan-2',
          activities_count: 3,
          implementation_timeline: '2-3 meses',
          ai_analysis: {
            learningProfile: { style: 'kinesthetic', attention: 'medium' },
            priorityNeeds: [{ category: 'behavioral', need: 'attention_management', priority: 'medium' }],
            strengths: [{ area: 'Aprendizaje Kinestésico', description: 'Aprende mejor con movimiento' }]
          }
        }
      }
    ];
    
    // Filtrar por status si se especifica
    let filteredCommunications = mockCommunications;
    if (status) {
      filteredCommunications = mockCommunications.filter(comm => comm.status === status);
    }
    
    console.log('✅ Comunicaciones obtenidas:', filteredCommunications);
    return {
      success: true,
      communications: filteredCommunications,
      total: filteredCommunications.length
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo comunicaciones:', error);
    return {
      success: false,
      error: error.message,
      communications: [],
      total: 0
    };
  }
};

/**
 * Marca una comunicación como leída/aceptada por el docente
 */
export const acknowledgeCommunication = async (communicationId, teacherId) => {
  console.log('✅ Marcando comunicación como aceptada...', { communicationId, teacherId });
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, COMMUNICATION_CONFIG.NETWORK_DELAY));
    
    console.log('✅ Comunicación aceptada por el docente');
    return {
      success: true,
      message: 'Comunicación aceptada exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error aceptando comunicación:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error aceptando comunicación'
    };
  }
};

/**
 * Formatea el plan de apoyo para que el docente lo entienda
 */
function formatSupportPlanForTeacher(planData) {
  const content = `
# Plan de Apoyo Individual - ${planData.studentName}

## 📊 Análisis de IA
**Perfil de Aprendizaje:** ${planData.aiAnalysis.learningProfile.style}
**Capacidad de Atención:** ${planData.aiAnalysis.learningProfile.attention}
**Nivel Académico:** ${planData.aiAnalysis.learningProfile.academicLevel.reading} (lectura), ${planData.aiAnalysis.learningProfile.academicLevel.math} (matemáticas)

## 🎯 Necesidades Prioritarias
${planData.aiAnalysis.priorityNeeds.map(need => 
  `- **${need.category.toUpperCase()}**: ${need.description} (Prioridad: ${need.priority})`
).join('\n')}

## 💪 Fortalezas Identificadas
${planData.aiAnalysis.strengths.map(strength => 
  `- **${strength.area}**: ${strength.description}`
).join('\n')}

## 📋 Actividades Recomendadas (${planData.activities.length} actividades)
${planData.activities.map((activity, index) => 
  `${index + 1}. **${activity.title}**
   - Tipo: ${activity.type}
   - Duración: ${activity.duration} minutos
   - Dificultad: ${activity.difficulty}
   - Materiales: ${activity.materials.join(', ')}`
).join('\n\n')}

## ⏰ Timeline de Implementación
- **Inmediato (2 semanas):** Implementar actividades prioritarias
- **Corto plazo (1-2 meses):** Evaluar progreso y ajustar
- **Largo plazo (3-6 meses):** Revisión completa del plan

## 📈 Métricas de Seguimiento
- Progreso en objetivos académicos
- Mejora en capacidad de atención
- Participación en actividades
- Satisfacción del estudiante

## 🔄 Próximos Pasos
1. Revisar y aceptar este plan
2. Implementar actividades según timeline
3. Reportar progreso semanalmente
4. Coordinar con psicopedagogo según necesidad

---
*Plan generado automáticamente por IA el ${new Date(planData.generatedAt).toLocaleDateString()}*
  `;
  
  return content.trim();
}

/**
 * Determina la prioridad del plan basándose en el análisis de IA
 */
function determinePriority(planData) {
  const highPriorityNeeds = planData.aiAnalysis.priorityNeeds.filter(need => need.priority === 'high');
  
  if (highPriorityNeeds.length >= 2) {
    return COMMUNICATION_CONFIG.PRIORITY_LEVELS.URGENT;
  } else if (highPriorityNeeds.length >= 1) {
    return COMMUNICATION_CONFIG.PRIORITY_LEVELS.HIGH;
  } else {
    return COMMUNICATION_CONFIG.PRIORITY_LEVELS.MEDIUM;
  }
}

/**
 * Genera un resumen ejecutivo para el docente
 */
export const generateTeacherSummary = (planData) => {
  return {
    studentName: planData.studentName,
    priority: determinePriority(planData),
    keyNeeds: planData.aiAnalysis.priorityNeeds.slice(0, 3),
    recommendedActivities: planData.activities.slice(0, 3),
    timeline: planData.implementation.timeline.shortTerm,
    nextAction: 'Revisar plan completo y confirmar implementación'
  };
};

export default {
  sendSupportPlanToTeacher,
  getTeacherCommunications,
  acknowledgeCommunication,
  generateTeacherSummary
};
