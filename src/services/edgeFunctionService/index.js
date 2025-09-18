import { supabase } from '@/lib/supabaseClient';
import { getSupabaseProjectUrl, getRoleMap } from './utils.js';
import { processPayloadForFunctionName } from './payloadProcessor.js';

const SUPABASE_PROJECT_URL = getSupabaseProjectUrl();
const roleMap = getRoleMap();

async function invokeEdgeFunction(functionName, payload) {
  console.log(`[EdgeFunctionService] Preparing to invoke ${functionName}. Initial payload:`, payload);
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('[EdgeFunctionService] Error getting session or session not found:', sessionError);
    return { data: null, error: { message: 'User not authenticated', details: sessionError } };
  }
  
  const { data: { user: authUser }, error: authUserError } = await supabase.auth.getUser();

  if (authUserError || !authUser) {
    console.error('[EdgeFunctionService] Error getting authenticated user:', authUserError);
    return { data: null, error: { message: 'Could not retrieve authenticated user details.', details: authUserError } };
  }

  const token = session.access_token;
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/${functionName}`;

  let translatedPayload = { ...payload };
  if (payload && payload.role && roleMap[payload.role]) {
    translatedPayload.role = roleMap[payload.role];
  } else if (payload && payload.role) {
    console.warn(`[EdgeFunctionService] Role ${payload.role} not found in roleMap, sending as is.`);
  }
  
  const finalPayload = processPayloadForFunctionName(functionName, translatedPayload, authUser, payload);

  if (finalPayload && finalPayload.error) {
    console.error(`[EdgeFunctionService] Error processing payload for ${functionName}:`, finalPayload.error);
    return { data: null, error: finalPayload.error };
  }

  try {
    console.log(`[EdgeFunctionService] Invoking ${functionName}. URL: ${functionUrl}. Final Payload:`, JSON.stringify(finalPayload || {}, null, 2));
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(finalPayload || {}), 
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: `HTTP error! Status: ${response.status}`, details: responseText };
      }
      console.error(`[EdgeFunctionService] Error invoking ${functionName} (status ${response.status}):`, errorData);
      return { data: null, error: errorData };
    }
    
    console.log(`[EdgeFunctionService] Successful response from ${functionName}. Status: ${response.status}. Raw text:`, responseText);
    
    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch (e) {
        console.error(`[EdgeFunctionService] Failed to parse JSON response from ${functionName}. Raw text:`, responseText, e);
        if (functionName === 'karyai-support-plan-generator') {
            return { data: { rawResponse: responseText, parseError: true }, error: null };
        }
        return { data: null, error: { message: 'Failed to parse JSON response', details: responseText } };
    }
    
    console.log(`[EdgeFunctionService] Parsed data from ${functionName}:`, responseData);
    return { data: responseData, error: null };

  } catch (error) {
    console.error(`[EdgeFunctionService] Network or other error invoking ${functionName}:`, error);
    if (error instanceof TypeError) {
        console.error(`[EdgeFunctionService] TypeError during fetch for ${functionName}. This could be a CORS issue, network problem, or an issue with the response body.`, error.message);
    }
    return { data: null, error: { message: error.message, details: error.toString() } };
  }
}

export { invokeEdgeFunction };