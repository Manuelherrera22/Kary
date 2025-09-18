import { invokeEdgeFunction } from './edgeFunctionService/index.js';

export const assignResource = async (payload) => {
  return invokeEdgeFunction('assign-resource', payload);
};

export const assignMultipleResources = async (payload) => {
  return invokeEdgeFunction('assign-multiple-resources', payload);
};

export const assignResourceDebug = async (payload) => {
  return invokeEdgeFunction('assign-resource-debug', payload);
};

export const assignSupportPlan = async (payload) => {
  return invokeEdgeFunction('assign-support-plan', payload);
};

export const assignCheckpointsToStudent = async (payload) => {
  return invokeEdgeFunction('assign-checkpoints-to-student', payload);
};


export const generateEmotionalReport = async (payload) => {
  return invokeEdgeFunction('generate-emotional-report', payload);
};

export const generateAcademicEvolution = async (payload) => {
  return invokeEdgeFunction('generate-academic-evolution', payload);
};

export const generateEmotionalTrend = async (payload) => {
  return invokeEdgeFunction('generate-emotional-trend', payload);
};

export const generateSupportPlanReport = async (payload) => {
  return invokeEdgeFunction('generate-support-plan', payload); 
};

export const generateDailyEmotionalSummary = async (payload) => {
  return invokeEdgeFunction('generate-daily-emotional-summary', payload);
};

export const generateEmotionalTrendSummary = async (payload) => {
  return invokeEdgeFunction('generate-emotional-trend-summary', payload);
};

export const generateAcademicRisk = async (payload) => {
  return invokeEdgeFunction('generate-academic-risk', payload);
};

export const karyAISupportPlanGenerator = async (payload) => {
  return invokeEdgeFunction('karyai-support-plan-generator', payload);
};

export const karyAIInsightProgressEvaluator = async (payload) => {
  return invokeEdgeFunction('karyai-insight-progress-evaluator', payload);
};

export const karyAILifeProjectTracker = async (payload) => {
  return invokeEdgeFunction('karyai-life-project-tracker', payload);
};


export const getDashboardSummary = async (payload) => {
  return invokeEdgeFunction('get-dashboard-summary', payload);
};

export const getStudentProgressSummary = async (payload) => {
  return invokeEdgeFunction('get-student-progress-summary', payload);
};

export const getStudentCaseOverview = async (payload) => {
  return invokeEdgeFunction('get-student-case-overview', payload);
};

export const getSupportPlanSummary = async (payload) => {
  return invokeEdgeFunction('get-support-plan-summary', payload);
};

export const getEmotionalTrendSummaryDashboard = async (payload) => {
  return invokeEdgeFunction('get-emotional-trend-summary', payload);
};

export const getInstitutionDashboardData = async (payload) => {
  return invokeEdgeFunction('get-institution-dashboard-data', payload);
};

export const getStudentProgressCheckpoints = async (payload) => {
  return invokeEdgeFunction('get-student-progress-checkpoints', payload);
};

export const getResourceUsageByStudent = async (payload) => {
  return invokeEdgeFunction('get-resource-usage-by-student', payload);
};


export const karyAIRiskAlertDispatcher = async (payload) => {
  return invokeEdgeFunction('karyai-risk-alert-dispatcher', payload);
};

export const karyAIAlertSystem = async (payload) => {
  return invokeEdgeFunction('karyai-alert-system', payload);
};

export const karyAIEmotionalInsight = async (payload) => {
  return invokeEdgeFunction('karyai-emotional-insight', payload);
};

export const riskPatternMonitor = async (payload) => {
  return invokeEdgeFunction('risk-pattern-monitor', payload);
};

export const emotionalPatternDetector = async (payload) => {
  return invokeEdgeFunction('emotional-pattern-detector', payload);
};

export const predictAcademicRisk = async (payload) => {
  return invokeEdgeFunction('predict-academic-risk', payload);
};

export const detectSupportNeeds = async (payload) => {
  return invokeEdgeFunction('detect-support-needs', payload);
};


export const logInstitutionalIntervention = async (payload) => {
  return invokeEdgeFunction('log-institutional-intervention', payload);
};

export const validateSupportCompliance = async (payload) => {
  return invokeEdgeFunction('validate-support-compliance', payload);
};

export const karyAIGenerarInformeFinalEstudiante = async (payload) => {
  return invokeEdgeFunction('karyai-generar-informe-final-estudiante', payload);
};

export const karyAIMonitoreoDocenteComportamiento = async (payload) => {
  return invokeEdgeFunction('karyai-monitoreo-docente-comportamiento', payload);
};

export const generateTeacherMonitoring = async (payload) => {
  return invokeEdgeFunction('generate-teacher-monitoring', payload);
};


export const generateIASuggestion = async (payload) => {
  return invokeEdgeFunction('generate-ia-suggestion', payload);
};

export const strategicAssistant = async (payload) => {
  return invokeEdgeFunction('estrategic-assistant', payload);
};

export const feedbackAnalysis = async (payload) => {
  return invokeEdgeFunction('feedback-analysis', payload);
};

export const karyAIEmotionTendencyAnalysis = async (payload) => {
  return invokeEdgeFunction('karyai-emotion-tendency-analysis', payload);
};

export const karyAIBehaviorPatternAnalyzer = async (payload) => {
  return invokeEdgeFunction('karyai-behavior-pattern-analyzer', payload);
};

export const karyAILearningStyleDetector = async (payload) => {
  return invokeEdgeFunction('karyai-learning-style-detector', payload);
};

export const karyAICriticalThinkingDetector = async (payload) => {
  return invokeEdgeFunction('karyai-critical-thinking-detector', payload);
};

export const karyAIAutoevaluacionEmocional = async (payload) => {
  return invokeEdgeFunction('karyai-autoevaluacion-emocional', payload);
};


export const suggestSupportPlan = async (payload) => {
  return invokeEdgeFunction('suggest-support-plan', payload);
};

export const suggestLifeProjectGoal = async (payload) => {
  return invokeEdgeFunction('suggest-life-project-goal', payload);
};

export const recommendFamilyAction = async (payload) => {
  return invokeEdgeFunction('recommend-family-action', payload);
};

export const karyAISugerenciaAjusteRazonable = async (payload) => {
  return invokeEdgeFunction('karyai-sugerencia-ajuste-razonable', payload);
};


export const karyAIIAFamiliaEstudiante = async (payload) => {
  return invokeEdgeFunction('karyai-ia-familia-estudiante', payload);
};

export const karyAIParentEngagementAnalyzer = async (payload) => {
  return invokeEdgeFunction('karyai-parent-engagement-analyzer', payload);
};

export const getStrategicSummary = async (payload) => {
  return invokeEdgeFunction('strategic-summary', payload);
};

export async function callEmotionNLPAnalyzer(studentId, texto) {
  if (!studentId || !texto) {
    throw new Error("Faltan parámetros: studentId o texto vacío.");
  }

  const url = "https://iypwcvjncttbffwjpodg.supabase.co/functions/v1/emotion-nlp-analyzer";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cHdjdmpuY3R0YmZmd2pwb2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODQxODMsImV4cCI6MjA2MzQ2MDE4M30.tE5qBjeNjdIOdLT3x5nj3SMJmhq0igJG7AcJdBP0S6o`
    },
    body: JSON.stringify({
      student_id: studentId,
      texto: texto
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Error desconocido desde Supabase.");
  }

  return data;
}

export async function logEmotionFromTracking(payload) {
  if (!payload.student_id || !payload.emotion) {
    throw new Error("Faltan parámetros: student_id o emotion para logEmotionFromTracking.");
  }
  return invokeEdgeFunction('log-emotion-from-tracking', payload);
}

export async function emotionalAlertAnalyzer(payload) {
  if (!payload.student_id) {
    throw new Error("Falta parámetro: student_id para emotionalAlertAnalyzer.");
  }
  return invokeEdgeFunction('motional-alert-analyzer-intel', payload);
}

export async function generateEmotionalSupportPlan(payload) {
  if (!payload.student_id) {
    throw new Error("Falta parámetro: student_id para generateEmotionalSupportPlan.");
  }
  return invokeEdgeFunction('emotional-support-plan', payload);
}

export async function generarContextoSugerido(payload) {
  if (!payload.student_id) {
    throw new Error("Falta parámetro: student_id para generarContextoSugerido.");
  }
  return invokeEdgeFunction('generarcontextosugerido', payload);
}

export async function updateSupportPlanMetadata(payload) {
  if (!payload.plan_id) {
    throw new Error("Falta parámetro: plan_id para updateSupportPlanMetadata.");
  }
  return invokeEdgeFunction('karyai-update-support-plan-metadata', payload);
}

export async function karyaiForceCompletePlan(payload) {
  if (!payload.plan_id) {
    throw new Error("Falta parámetro: plan_id para karyaiForceCompletePlan.");
  }
  return invokeEdgeFunction('karyai-force-complete-plan', payload);
}

export async function assignTeacherToStudent(payload) {
  if (!payload.student_id || !payload.teacher_id) {
    throw new Error("Faltan parámetros: student_id o teacher_id para assignTeacherToStudent.");
  }
  return invokeEdgeFunction('assign_teacher_to_student', payload);
}

export async function assignGuardianToStudent(payload) {
  if (!payload.student_id || !payload.guardian_id) {
    throw new Error("Faltan parámetros: student_id o guardian_id para assignGuardianToStudent.");
  }
  return invokeEdgeFunction('assign_guardian_to_student', payload);
}

export async function getAssignedStudentsByTeacher(payload) {
  if (!payload.teacher_id) {
    throw new Error("Falta parámetro: teacher_id para getAssignedStudentsByTeacher.");
  }
  return invokeEdgeFunction('get-assigned-students-by-teacher', payload); 
}

export async function getAssignedStudentsByGuardian(payload) { 
  if (!payload.guardian_id) {
    throw new Error("Falta parámetro: guardian_id para getAssignedStudentsByGuardian.");
  }
  return invokeEdgeFunction('get-assigned-students-by-guardian', payload);
}

export async function karyAIAutoActivityGenerator(payload) {
  if (!payload.student_id || !payload.teacher_id) {
    throw new Error("Faltan parámetros: student_id o teacher_id para karyAIAutoActivityGenerator.");
  }
  return invokeEdgeFunction('karyai-auto-activity-generator', payload);
}

const edgeFunctionService = {
  invokeEdgeFunction,
  assignResource,
  assignMultipleResources,
  assignResourceDebug,
  assignSupportPlan,
  assignCheckpointsToStudent,
  generateEmotionalReport,
  generateAcademicEvolution,
  generateEmotionalTrend,
  generateSupportPlanReport,
  generateDailyEmotionalSummary,
  generateEmotionalTrendSummary,
  generateAcademicRisk,
  karyAISupportPlanGenerator,
  karyAIInsightProgressEvaluator,
  karyAILifeProjectTracker,
  getDashboardSummary,
  getStudentProgressSummary,
  getStudentCaseOverview,
  getSupportPlanSummary,
  getEmotionalTrendSummaryDashboard,
  getInstitutionDashboardData,
  getStudentProgressCheckpoints,
  getResourceUsageByStudent,
  karyAIRiskAlertDispatcher,
  karyAIAlertSystem,
  karyAIEmotionalInsight,
  riskPatternMonitor,
  emotionalPatternDetector,
  predictAcademicRisk,
  detectSupportNeeds,
  logInstitutionalIntervention,
  validateSupportCompliance,
  karyAIGenerarInformeFinalEstudiante,
  karyAIMonitoreoDocenteComportamiento,
  generateTeacherMonitoring,
  generateIASuggestion,
  strategicAssistant,
  feedbackAnalysis,
  karyAIEmotionTendencyAnalysis,
  karyAIBehaviorPatternAnalyzer,
  karyAILearningStyleDetector,
  karyAICriticalThinkingDetector,
  karyAIAutoevaluacionEmocional,
  suggestSupportPlan,
  suggestLifeProjectGoal,
  recommendFamilyAction,
  karyAISugerenciaAjusteRazonable,
  karyAIIAFamiliaEstudiante,
  karyAIParentEngagementAnalyzer,
  getStrategicSummary,
  callEmotionNLPAnalyzer,
  logEmotionFromTracking,
  emotionalAlertAnalyzer,
  generateEmotionalSupportPlan,
  generarContextoSugerido,
  updateSupportPlanMetadata,
  karyaiForceCompletePlan,
  assignTeacherToStudent,
  assignGuardianToStudent,
  getAssignedStudentsByTeacher,
  getAssignedStudentsByGuardian, // Updated from listStudentsByGuardian
  karyAIAutoActivityGenerator,
};

export default edgeFunctionService;