/**
 * Script de prueba para ejecutar desde la consola del navegador
 * Permite probar Gemini AI directamente sin interfaz
 */

// Función global para ejecutar pruebas desde la consola
window.testGeminiAI = async function(testType = 'quick') {
  console.log('🧪 Iniciando prueba de Gemini AI desde consola...');
  
  try {
    // Importar dinámicamente los servicios
    const { default: geminiDashboardService } = await import('/src/services/geminiDashboardService.js');
    const { generateDynamicActivity, analyzeStudentResponse, chatWithGemini } = await import('/src/services/geminiActivityService.js');

    if (testType === 'quick') {
      return await runQuickTest(geminiDashboardService);
    } else if (testType === 'full') {
      return await runFullTest(geminiDashboardService, generateDynamicActivity, analyzeStudentResponse, chatWithGemini);
    } else {
      console.log('❌ Tipo de prueba no válido. Usa "quick" o "full"');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error importando servicios:', error);
    console.log('💡 Asegúrate de estar en el contexto correcto del navegador');
    return null;
  }
};

async function runQuickTest(geminiDashboardService) {
  console.log('⚡ Ejecutando prueba rápida...');
  
  try {
    const mockUserProfile = { 
      full_name: 'Usuario de Prueba', 
      role: 'teacher' 
    };
    
    const mockContext = { 
      subject: 'matemáticas',
      difficulty: 'intermedio'
    };
    
    const response = await geminiDashboardService.chatWithContext(
      'Hola, ¿puedes responder este mensaje de prueba?',
      'teacher',
      mockContext,
      mockUserProfile
    );

    if (response.success) {
      console.log('✅ Prueba rápida: PASÓ');
      console.log('📝 Respuesta de Gemini:', response.data.message);
      return { status: 'passed', response: response.data };
    } else {
      console.log('❌ Prueba rápida: FALLÓ');
      console.log('🚨 Error:', response.error);
      return { status: 'failed', error: response.error };
    }
    
  } catch (error) {
    console.log('❌ Prueba rápida: ERROR');
    console.log('🚨 Error:', error.message);
    return { status: 'error', error: error.message };
  }
}

async function runFullTest(geminiDashboardService, generateDynamicActivity, analyzeStudentResponse, chatWithGemini) {
  console.log('🔬 Ejecutando suite completa de pruebas...');
  
  const results = {
    dashboardTests: {},
    activityTests: {},
    chatTests: {},
    summary: {}
  };

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Dashboard del Profesor
  console.log('📚 Probando Dashboard del Profesor...');
  try {
    const mockStudentData = [
      { name: 'María González', performance: 85, subjects: ['Matemáticas', 'Ciencias'] },
      { name: 'Carlos Ruiz', performance: 92, subjects: ['Lectura', 'Escritura'] }
    ];

    const mockClassPerformance = {
      averageScore: 82,
      attendance: 95,
      behavior: 88
    };

    const mockActivities = [
      { title: 'Matemáticas Básicas', completed: 15, total: 20 }
    ];

    const response = await geminiDashboardService.generateTeacherInsights(
      mockStudentData,
      mockClassPerformance,
      mockActivities
    );

    results.dashboardTests.teacher = {
      status: response.success ? 'passed' : 'failed',
      response: response.data,
      error: response.error
    };

    totalTests++;
    if (response.success) passedTests++;
    
    console.log(`✅ Dashboard del Profesor: ${response.success ? 'PASÓ' : 'FALLÓ'}`);
    
  } catch (error) {
    console.error('❌ Error en Dashboard del Profesor:', error);
    results.dashboardTests.teacher = { status: 'failed', error: error.message };
    totalTests++;
  }

  // Test 2: Dashboard del Estudiante
  console.log('🎓 Probando Dashboard del Estudiante...');
  try {
    const mockStudentProfile = {
      full_name: 'Juan Pérez',
      grade: '5to Grado',
      learningStyle: 'visual',
      interests: ['matemáticas', 'robótica']
    };

    const mockPerformance = {
      averageScore: 78,
      studyTime: 2.5
    };

    const mockActivities = {
      completed: 12,
      pending: 3
    };

    const response = await geminiDashboardService.generateStudentRecommendations(
      mockStudentProfile,
      mockPerformance,
      mockActivities
    );

    results.dashboardTests.student = {
      status: response.success ? 'passed' : 'failed',
      response: response.data,
      error: response.error
    };

    totalTests++;
    if (response.success) passedTests++;
    
    console.log(`✅ Dashboard del Estudiante: ${response.success ? 'PASÓ' : 'FALLÓ'}`);
    
  } catch (error) {
    console.error('❌ Error en Dashboard del Estudiante:', error);
    results.dashboardTests.student = { status: 'failed', error: error.message };
    totalTests++;
  }

  // Test 3: Generación de Actividades
  console.log('🎮 Probando Generación de Actividades...');
  try {
    const mockStudentProfile = {
      full_name: 'Luna Rodríguez',
      grade: '6to Grado',
      learningStyle: 'auditivo',
      interests: ['música', 'historia']
    };

    const response = await generateDynamicActivity(
      mockStudentProfile,
      'mathematics',
      'intermediate',
      'fracciones'
    );

    results.activityTests.generation = {
      status: response.success ? 'passed' : 'failed',
      response: response.data,
      error: response.error
    };

    totalTests++;
    if (response.success) passedTests++;
    
    console.log(`✅ Generación de Actividades: ${response.success ? 'PASÓ' : 'FALLÓ'}`);
    
  } catch (error) {
    console.error('❌ Error en Generación de Actividades:', error);
    results.activityTests.generation = { status: 'failed', error: error.message };
    totalTests++;
  }

  // Test 4: Análisis de Respuestas
  console.log('📊 Probando Análisis de Respuestas...');
  try {
    const mockStudentProfile = {
      full_name: 'Alex Torres',
      learningStyle: 'visual',
      grade: '4to Grado'
    };

    const response = await analyzeStudentResponse(
      '¿Cuánto es 15 + 27?',
      '42',
      '42',
      mockStudentProfile
    );

    results.chatTests.responseAnalysis = {
      status: response.success ? 'passed' : 'failed',
      response: response.data,
      error: response.error
    };

    totalTests++;
    if (response.success) passedTests++;
    
    console.log(`✅ Análisis de Respuestas: ${response.success ? 'PASÓ' : 'FALLÓ'}`);
    
  } catch (error) {
    console.error('❌ Error en Análisis de Respuestas:', error);
    results.chatTests.responseAnalysis = { status: 'failed', error: error.message };
    totalTests++;
  }

  // Test 5: Chat Universal
  console.log('💬 Probando Chat Universal...');
  try {
    const testMessages = [
      { role: 'teacher', message: '¿Cómo puedo mejorar el rendimiento de mi clase?' },
      { role: 'student', message: '¿Tienes alguna pista para mi actividad de matemáticas?' },
      { role: 'parent', message: '¿Cómo está progresando mi hijo en la escuela?' }
    ];

    const chatResults = [];

    for (const test of testMessages) {
      const mockUserProfile = {
        full_name: `Usuario ${test.role}`,
        role: test.role
      };

      const mockContext = {
        subject: 'matemáticas',
        difficulty: 'intermedio'
      };

      const response = await geminiDashboardService.chatWithContext(
        test.message,
        test.role,
        mockContext,
        mockUserProfile
      );

      chatResults.push({
        role: test.role,
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      });

      totalTests++;
      if (response.success) passedTests++;
    }

    results.chatTests.universal = chatResults;
    
    const passedChatCount = chatResults.filter(r => r.status === 'passed').length;
    console.log(`✅ Chat Universal: ${passedChatCount}/${chatResults.length} PASARON`);
    
  } catch (error) {
    console.error('❌ Error en Chat Universal:', error);
    results.chatTests.universal = { status: 'failed', error: error.message };
    totalTests++;
  }

  // Generar resumen
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  
  results.summary = {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate,
    overallStatus: successRate >= 80 ? 'excellent' : successRate >= 60 ? 'good' : 'needs_attention'
  };

  // Mostrar reporte en consola
  console.log('\n' + '='.repeat(60));
  console.log('📋 REPORTE DE PRUEBAS DE GEMINI AI');
  console.log('='.repeat(60));
  console.log(`📊 Total de pruebas: ${totalTests}`);
  console.log(`✅ Pruebas pasadas: ${passedTests}`);
  console.log(`❌ Pruebas fallidas: ${totalTests - passedTests}`);
  console.log(`📈 Tasa de éxito: ${successRate}%`);
  console.log('='.repeat(60));

  // Detalles por categoría
  console.log('\n📚 DASHBOARDS:');
  Object.entries(results.dashboardTests).forEach(([dashboard, result]) => {
    const status = result.status === 'passed' ? '✅' : '❌';
    console.log(`  ${status} ${dashboard.toUpperCase()}: ${result.status}`);
  });

  console.log('\n🎮 ACTIVIDADES:');
  Object.entries(results.activityTests).forEach(([test, result]) => {
    const status = result.status === 'passed' ? '✅' : '❌';
    console.log(`  ${status} ${test.toUpperCase()}: ${result.status}`);
  });

  console.log('\n💬 CHAT:');
  if (Array.isArray(results.chatTests.universal)) {
    results.chatTests.universal.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      console.log(`  ${status} CHAT ${test.role.toUpperCase()}: ${test.status}`);
    });
  }

  if (results.chatTests.responseAnalysis) {
    const status = results.chatTests.responseAnalysis.status === 'passed' ? '✅' : '❌';
    console.log(`  ${status} ANÁLISIS DE RESPUESTAS: ${results.chatTests.responseAnalysis.status}`);
  }

  console.log('\n' + '='.repeat(60));

  if (successRate >= 80) {
    console.log('🎉 ¡EXCELENTE! El sistema está funcionando correctamente con Gemini AI');
  } else if (successRate >= 60) {
    console.log('⚠️  BUENO: La mayoría de funciones están operativas, pero hay algunas fallas');
  } else {
    console.log('🚨 ATENCIÓN: Hay problemas significativos que requieren revisión');
  }

  console.log('='.repeat(60) + '\n');

  return results;
}

// Función de ayuda para mostrar instrucciones
window.showGeminiTestHelp = function() {
  console.log('\n🧪 INSTRUCCIONES PARA PROBAR GEMINI AI');
  console.log('='.repeat(50));
  console.log('📝 Comandos disponibles:');
  console.log('');
  console.log('⚡ Prueba rápida:');
  console.log('   testGeminiAI("quick")');
  console.log('');
  console.log('🔬 Suite completa:');
  console.log('   testGeminiAI("full")');
  console.log('');
  console.log('❓ Mostrar ayuda:');
  console.log('   showGeminiTestHelp()');
  console.log('');
  console.log('💡 Ejemplos:');
  console.log('   await testGeminiAI("quick")');
  console.log('   await testGeminiAI("full")');
  console.log('');
  console.log('⚠️  Nota: Usa "await" para esperar los resultados');
  console.log('='.repeat(50));
};

// Mostrar ayuda automáticamente
console.log('🧪 Gemini AI Test Suite cargado');
console.log('💡 Ejecuta showGeminiTestHelp() para ver las instrucciones');

export default {
  testGeminiAI: window.testGeminiAI,
  showGeminiTestHelp: window.showGeminiTestHelp
};
