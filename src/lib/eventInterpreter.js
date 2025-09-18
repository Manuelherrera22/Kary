import { format } from 'date-fns';
import { es, enUS, pt, fr, ru } from 'date-fns/locale';

const localeMap = {
  es,
  en: enUS,
  pt,
  fr,
  ru,
};

export const eventTypes = {
  RIESGO_EMOCIONAL: 'riesgo_emocional',
  FALTA_ACADEMICA: 'falta_academica',
  INTERVENCION_PIAR: 'intervencion_piar',
  NUEVO_REPORTE: 'new_report',
  RECORDATORIO_CITA: 'appointment_reminder',
  APROBACION_PLAN_PENDIENTE: 'plan_approval_pending',
};

export function interpretarEvento(evento, rol, tFunction) {
  if (!evento || !evento.tipo_evento || !rol || !tFunction) {
    console.warn('interpretarEvento: Faltan parámetros evento, rol o tFunction.');
    return tFunction('eventTemplates.default', 'Información general del sistema.');
  }

  const plantillas = {
    parent: {
      [eventTypes.RIESGO_EMOCIONAL]: tFunction('eventTemplates.parent.riesgo_emocional', 'Estamos atentos al bienestar de tu hijo. Se ha activado acompañamiento.'),
      [eventTypes.FALTA_ACADEMICA]: tFunction('eventTemplates.parent.falta_academica', 'Se ha registrado una novedad académica para tu hijo. Contacta al docente.'),
      [eventTypes.INTERVENCION_PIAR]: tFunction('eventTemplates.parent.intervencion_piar', 'El plan de ajustes razonables (PIAR) de tu hijo ha sido actualizado.'),
      default: tFunction('eventTemplates.parent.default', 'Hay nueva información sobre tu hijo disponible en la plataforma.')
    },
    teacher: {
      [eventTypes.RIESGO_EMOCIONAL]: tFunction('eventTemplates.teacher.riesgo_emocional', 'El estudiante {studentName} presentó señales de desregulación. Recomendamos apoyo en clase.'),
      [eventTypes.FALTA_ACADEMICA]: tFunction('eventTemplates.teacher.falta_academica', 'Se ha registrado una falta académica para el estudiante {studentName}.'),
      [eventTypes.INTERVENCION_PIAR]: tFunction('eventTemplates.teacher.intervencion_piar', 'El PIAR del estudiante {studentName} requiere tu atención para diagnóstico por área.'),
      default: tFunction('eventTemplates.teacher.default', 'Información relevante sobre el estudiante {studentName}.')
    },
    psychopedagogue: {
      [eventTypes.RIESGO_EMOCIONAL]: tFunction('eventTemplates.psychopedagogue.riesgo_emocional', 'Riesgo emocional {nivel_alerta} identificado para {studentName}. Iniciar intervención estructurada.'),
      [eventTypes.FALTA_ACADEMICA]: tFunction('eventTemplates.psychopedagogue.falta_academica', 'Múltiples faltas académicas registradas para {studentName}. Evaluar impacto.'),
      [eventTypes.INTERVENCION_PIAR]: tFunction('eventTemplates.psychopedagogue.intervencion_piar', 'PIAR para {studentName} necesita ser creado o actualizado.'),
      default: tFunction('eventTemplates.psychopedagogue.default', 'Evento importante para {studentName} requiere tu revisión.')
    },
    directive: {
      [eventTypes.RIESGO_EMOCIONAL]: tFunction('eventTemplates.directive.riesgo_emocional', 'Alerta de riesgo emocional {nivel_alerta} para {studentName}.'),
      [eventTypes.FALTA_ACADEMICA]: tFunction('eventTemplates.directive.falta_academica', 'Reporte de faltas académicas para {studentName}.'),
      [eventTypes.INTERVENCION_PIAR]: tFunction('eventTemplates.directive.intervencion_piar', 'Seguimiento PIAR para {studentName}.'),
      default: tFunction('eventTemplates.directive.default', 'Resumen ejecutivo de alertas recientes disponible.')
    },
    program_coordinator: {
      [eventTypes.RIESGO_EMOCIONAL]: tFunction('eventTemplates.program_coordinator.riesgo_emocional', 'Riesgo multidimensional (emocional {nivel_alerta}) detectado para {studentName}. Coordinar acciones.'),
      [eventTypes.FALTA_ACADEMICA]: tFunction('eventTemplates.program_coordinator.falta_academica', 'Impacto académico por faltas de {studentName}. Coordinar con docente.'),
      [eventTypes.INTERVENCION_PIAR]: tFunction('eventTemplates.program_coordinator.intervencion_piar', 'Verificación de cumplimiento PIAR para {studentName}.'),
      default: tFunction('eventTemplates.program_coordinator.default', 'Evento general para {studentName} requiere coordinación.')
    },
    admin: {
      default: tFunction('eventTemplates.admin.default', 'Evento del sistema: {tipo_evento} para estudiante ID {estudiante_id}.')
    },
    student: {
      default: tFunction('eventTemplates.student.default', 'Tienes una nueva notificación en tu panel.')
    }
  };

  const rolTemplates = plantillas[rol] || plantillas.student; 
  let message = rolTemplates[evento.tipo_evento] || rolTemplates.default;

  message = message.replace('{studentName}', evento.contenido?.student_name || tFunction('common.student', 'Estudiante'));
  message = message.replace('{nivel_alerta}', evento.nivel_alerta || tFunction('common.notSpecified', 'No especificado'));
  message = message.replace('{estudiante_id}', evento.estudiante_id || 'N/A');
  message = message.replace('{tipo_evento}', evento.tipo_evento || 'N/A');
  
  return message;
}

export function formatEventForDisplay(evento, rol, tFunction, language) {
  if (!evento || !tFunction) {
    return {
      title: tFunction('eventTitles.default', 'Notificación del Sistema'),
      message: tFunction('eventTemplates.default', 'Información general del sistema.'),
      iconType: 'default',
      link: '#',
      timestamp: new Date().toISOString()
    };
  }
  
  const currentLocale = localeMap[language] || enUS;

  const titleKeyMap = {
    [eventTypes.RIESGO_EMOCIONAL]: 'eventTitles.riesgo_emocional',
    [eventTypes.FALTA_ACADEMICA]: 'eventTitles.falta_academica',
    [eventTypes.INTERVENCION_PIAR]: 'eventTitles.intervencion_piar',
    [eventTypes.NUEVO_REPORTE]: 'eventTitles.new_report',
    [eventTypes.RECORDATORIO_CITA]: 'eventTitles.appointment_reminder',
    [eventTypes.APROBACION_PLAN_PENDIENTE]: 'eventTitles.plan_approval_pending',
  };
  
  const defaultTitleKey = 'eventTitles.default';
  const title = tFunction(titleKeyMap[evento.tipo_evento] || defaultTitleKey, evento.contenido?.student_name || tFunction('common.student'));

  const message = interpretarEvento(evento, rol, tFunction);
  
  const iconTypeMap = {
    [eventTypes.RIESGO_EMOCIONAL]: 'riesgo_emocional',
    [eventTypes.FALTA_ACADEMICA]: 'falta_academica',
    [eventTypes.INTERVENCION_PIAR]: 'intervencion_piar',
    [eventTypes.NUEVO_REPORTE]: 'new_report',
    [eventTypes.RECORDATORIO_CITA]: 'appointment_reminder',
    [eventTypes.APROBACION_PLAN_PENDIENTE]: 'plan_approval_pending',
  };

  return {
    id: evento.id || crypto.randomUUID(),
    title: title,
    message: message,
    type: iconTypeMap[evento.tipo_evento] || 'default',
    link: evento.contenido?.link || `/dashboard/student/${evento.estudiante_id}/profile`,
    created_at: evento.fecha || new Date().toISOString(),
    is_read: evento.is_read || false,
    student_name: evento.contenido?.student_name, 
    nivel_alerta: evento.nivel_alerta,
  };
}