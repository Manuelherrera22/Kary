export const processPayloadForFunctionName = (functionName, translatedPayload, authUser, originalPayload) => {
  let finalPayload = { ...translatedPayload };

  switch (functionName) {
    case 'strategic-summary':
      finalPayload = { user_id: authUser.id, ...originalPayload };
      delete finalPayload.role; 
      break;
    case 'get-support-plan-summary':
      finalPayload = { user_id: authUser.id }; 
      if (originalPayload && originalPayload.student_id && String(originalPayload.student_id).trim() !== '') {
        finalPayload.student_id = originalPayload.student_id;
      }
      break;
    case 'karyai-support-plan-generator':
      if (!originalPayload || !originalPayload.student_id) {
        console.error("[EdgeFunctionService] karyai-support-plan-generator called without a student_id.");
        return { error: { message: "student_id is required but was not provided." } };
      }
      // Ensure 'contexto' and 'observacion_manual' are correctly passed from originalPayload
      if (!originalPayload.contexto) {
        console.error("[EdgeFunctionService] karyai-support-plan-generator: 'contexto' is missing in originalPayload.");
        // Potentially return an error or use a default, depending on requirements
        // For now, let it pass to see if it's handled by the Edge function or if it should be strictly enforced here
      }
      if (!originalPayload.observacion_manual) {
        console.error("[EdgeFunctionService] karyai-support-plan-generator: 'observacion_manual' is missing in originalPayload.");
      }
      finalPayload = {
        user_id: authUser.id, 
        student_id: originalPayload.student_id,
        student_name: originalPayload.student_name,
        plan_type: originalPayload.plan_type,
        focus_area: originalPayload.focus_area,
        specific_needs: originalPayload.specific_needs,
        // Use the exact names 'contexto' and 'observacion_manual' as expected by the Edge Function
        contexto: originalPayload.contexto, 
        observacion_manual: originalPayload.observacion_manual,
        language: originalPayload.language,
      };
      break;
    case 'get-dashboard-summary':
      if (!originalPayload || !originalPayload.role) {
        console.error("[EdgeFunctionService] get-dashboard-summary called without a role.");
        return { error: { message: "Role is required for get-dashboard-summary but was not provided." } };
      }
      finalPayload = {
        user: authUser.id, 
        role: translatedPayload.role || originalPayload.role, 
      };
      if (translatedPayload.role === 'estudiante' && originalPayload.input_user_id) { 
        finalPayload.input_user_id = originalPayload.input_user_id;
      } else {
        finalPayload.user_id = authUser.id; 
      }
      if (originalPayload.childId && (translatedPayload.role === 'padre' || originalPayload.role === 'parent')) {
        finalPayload.child_id = originalPayload.childId;
      }
      if (originalPayload.student_id_for_professional_view && translatedPayload.role !== 'estudiante' && originalPayload.role !== 'student') {
        finalPayload.student_id_for_professional_view = originalPayload.student_id_for_professional_view;
      }
      break;
    case 'karyai-risk-alert-dispatcher':
      finalPayload = { 
        user_id: authUser.id, 
        psychopedagogue_id: originalPayload?.psychopedagogue_id || authUser.id, 
      };
      break;
    case 'estrategic-assistant': 
       finalPayload = {
        rol_usuario: translatedPayload.rol_usuario || originalPayload.rol_usuario,
        usuario_id: translatedPayload.usuario_id || authUser.id,
        contexto: translatedPayload.contexto || originalPayload.contexto || {},
      };
      break;
    default:
      finalPayload = { user_id: authUser.id, ...originalPayload, ...translatedPayload };
      break;
  }
  return finalPayload;
};