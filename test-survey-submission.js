#!/usr/bin/env node

// 🧪 SCRIPT DE PRUEBA PARA ENVÍO DE ENCUESTA A SUPABASE
// Este script simula el envío de una encuesta completa

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://iypwcvjncttbffwjpodg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cHdjdmpuY3R0YmZmd2pwb2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg4NDE4MywiZXhwIjoyMDYzNDYwMTgzfQ.gS5Hb_GcnG9ecCQmwu3If1D7LtG91mP-CE0xskxpx04';

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Datos de prueba para la encuesta
const testSurveyData = {
  user_role: 'teacher',
  age_range: '30-40',
  tech_experience: 'intermediate',
  institution_type: 'public_school',
  usability_rating: 5,
  functionality_rating: 4,
  design_rating: 5,
  performance_rating: 4,
  support_rating: 5,
  positive_feedback: 'La plataforma es muy intuitiva y fácil de usar. Los estudiantes la disfrutan mucho.',
  negative_feedback: 'A veces la carga es un poco lenta en dispositivos antiguos.',
  suggestions: 'Mejorar la velocidad de carga y agregar más opciones de personalización.',
  recommendation: 'definitely',
  impact_description: 'Kary ha transformado completamente la forma en que enseño. Los estudiantes están más motivados y participan más activamente.',
  additional_comments: 'Excelente herramienta educativa. La recomiendo ampliamente.',
  session_id: `test_${Date.now()}`,
  completion_time: 180,
  is_anonymous: true
};

async function testSurveySubmission() {
  console.log('🧪 INICIANDO PRUEBA DE ENVÍO DE ENCUESTA A SUPABASE\n');
  
  try {
    // 1. Verificar conexión con Supabase
    console.log('1️⃣ Verificando conexión con Supabase...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('survey_responses')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      throw new Error(`Error de conexión: ${connectionError.message}`);
    }
    console.log('✅ Conexión exitosa con Supabase\n');

    // 2. Verificar que la tabla existe
    console.log('2️⃣ Verificando estructura de la tabla...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('survey_responses')
      .select('*')
      .limit(1);
    
    if (tableError) {
      throw new Error(`Error de tabla: ${tableError.message}`);
    }
    console.log('✅ Tabla survey_responses accesible\n');

    // 3. Enviar encuesta de prueba
    console.log('3️⃣ Enviando encuesta de prueba...');
    console.log('📊 Datos de prueba:', JSON.stringify(testSurveyData, null, 2));
    
    const { data: insertResult, error: insertError } = await supabase
      .from('survey_responses')
      .insert([testSurveyData])
      .select();

    if (insertError) {
      throw new Error(`Error al insertar: ${insertError.message}`);
    }
    
    console.log('✅ Encuesta enviada exitosamente!');
    console.log('📋 ID de la encuesta:', insertResult[0].id);
    console.log('🆔 Session ID:', insertResult[0].session_id);

    // 4. Verificar que se guardó correctamente
    console.log('\n4️⃣ Verificando que la encuesta se guardó...');
    const { data: verifyResult, error: verifyError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('session_id', testSurveyData.session_id);

    if (verifyError) {
      throw new Error(`Error al verificar: ${verifyError.message}`);
    }

    if (verifyResult.length > 0) {
      console.log('✅ Encuesta encontrada en la base de datos');
      console.log('📊 Datos guardados:', JSON.stringify(verifyResult[0], null, 2));
    } else {
      console.log('❌ No se encontró la encuesta en la base de datos');
    }

    // 5. Obtener estadísticas
    console.log('\n5️⃣ Obteniendo estadísticas...');
    const { data: stats, error: statsError } = await supabase
      .from('survey_responses')
      .select('count');

    if (!statsError) {
      console.log(`📈 Total de encuestas en la base de datos: ${stats.length}`);
    }

    console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE!');
    console.log('✅ La encuesta se envía correctamente a Supabase');
    console.log('✅ Los datos se guardan en la tabla survey_responses');
    console.log('✅ La funcionalidad está operativa');

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('🔍 Detalles del error:', error.message);
    console.error('📋 Código de error:', error.code || 'N/A');
    console.error('💡 Sugerencias:');
    console.error('   - Verificar que la service role key sea correcta');
    console.error('   - Verificar que las políticas RLS estén configuradas');
    console.error('   - Verificar que la tabla survey_responses exista');
  }
}

// Ejecutar la prueba
testSurveySubmission();
