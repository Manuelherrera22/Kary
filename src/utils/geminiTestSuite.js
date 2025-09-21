/**
 * Suite de pruebas completa para verificar el funcionamiento de Gemini AI
 * en todos los dashboards y herramientas del sistema Kary
 */

import geminiDashboardService from '@/services/geminiDashboardService';
import { generateDynamicActivity, analyzeStudentResponse, chatWithGemini } from '@/services/geminiActivityService';

class GeminiTestSuite {
  constructor() {
    this.results = {
      dashboardTests: {},
      activityTests: {},
      chatTests: {},
      overallStatus: 'pending'
    };
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Ejecutar todas las pruebas
   */
  async runAllTests() {
    console.log('🧪 Iniciando Suite de Pruebas de Gemini AI...');
    this.startTime = new Date();

    try {
      // Test 1: Dashboard del Profesor
      await this.testTeacherDashboard();
      
      // Test 2: Dashboard del Estudiante
      await this.testStudentDashboard();
      
      // Test 3: Dashboard de Padres
      await this.testParentDashboard();
      
      // Test 4: Dashboard del Psicopedagogo
      await this.testPsychopedagogueDashboard();
      
      // Test 5: Dashboard del Administrador
      await this.testAdminDashboard();
      
      // Test 6: Sistema de Actividades
      await this.testActivitySystem();
      
      // Test 7: Chat Universal
      await this.testUniversalChat();
      
      // Test 8: Análisis de Respuestas
      await this.testResponseAnalysis();

      this.endTime = new Date();
      this.results.overallStatus = 'completed';
      
      this.generateReport();
      return this.results;
      
    } catch (error) {
      console.error('❌ Error en las pruebas:', error);
      this.results.overallStatus = 'failed';
      this.results.error = error.message;
      return this.results;
    }
  }

  /**
   * Test del Dashboard del Profesor
   */
  async testTeacherDashboard() {
    console.log('📚 Probando Dashboard del Profesor...');
    
    try {
      const mockStudentData = [
        { name: 'María González', performance: 85, subjects: ['Matemáticas', 'Ciencias'] },
        { name: 'Carlos Ruiz', performance: 92, subjects: ['Lectura', 'Escritura'] },
        { name: 'Ana López', performance: 68, subjects: ['Matemáticas'] }
      ];

      const mockClassPerformance = {
        averageScore: 82,
        attendance: 95,
        behavior: 88
      };

      const mockActivities = [
        { title: 'Matemáticas Básicas', completed: 15, total: 20 },
        { title: 'Lectura Comprensiva', completed: 12, total: 15 }
      ];

      const response = await geminiDashboardService.generateTeacherInsights(
        mockStudentData,
        mockClassPerformance,
        mockActivities
      );

      this.results.dashboardTests.teacher = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Dashboard del Profesor:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Dashboard del Profesor:', error);
      this.results.dashboardTests.teacher = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Dashboard del Estudiante
   */
  async testStudentDashboard() {
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

      this.results.dashboardTests.student = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Dashboard del Estudiante:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Dashboard del Estudiante:', error);
      this.results.dashboardTests.student = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Dashboard de Padres
   */
  async testParentDashboard() {
    console.log('👨‍👩‍👧‍👦 Probando Dashboard de Padres...');
    
    try {
      const mockChildProfile = {
        full_name: 'Sofia Martínez',
        grade: '3er Grado',
        age: '8 años'
      };

      const mockAcademicProgress = {
        overallScore: 82,
        strongSubjects: ['Lectura', 'Arte'],
        weakSubjects: ['Matemáticas']
      };

      const mockBehavioralNotes = [
        'Muy creativa en proyectos de arte',
        'Necesita apoyo en resolución de problemas matemáticos',
        'Excelente trabajo en equipo'
      ];

      const response = await geminiDashboardService.generateParentInsights(
        mockChildProfile,
        mockAcademicProgress,
        mockBehavioralNotes
      );

      this.results.dashboardTests.parent = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Dashboard de Padres:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Dashboard de Padres:', error);
      this.results.dashboardTests.parent = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Dashboard del Psicopedagogo
   */
  async testPsychopedagogueDashboard() {
    console.log('🧠 Probando Dashboard del Psicopedagogo...');
    
    try {
      const mockStudentData = {
        full_name: 'Diego Herrera',
        grade: '4to Grado'
      };

      const mockDiagnosticInfo = {
        primaryDiagnosis: 'TDAH',
        specialNeeds: ['apoyo en atención', 'organización'],
        learningStyle: 'kinestésico'
      };

      const mockInterventionHistory = [
        { type: 'Terapia ocupacional', description: 'Ejercicios de motricidad fina' },
        { type: 'Apoyo académico', description: 'Estrategias de organización' }
      ];

      const response = await geminiDashboardService.generatePsychopedagogueAnalysis(
        mockStudentData,
        mockDiagnosticInfo,
        mockInterventionHistory
      );

      this.results.dashboardTests.psychopedagogue = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Dashboard del Psicopedagogo:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Dashboard del Psicopedagogo:', error);
      this.results.dashboardTests.psychopedagogue = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Dashboard del Administrador
   */
  async testAdminDashboard() {
    console.log('🛡️ Probando Dashboard del Administrador...');
    
    try {
      const mockSchoolData = {
        totalStudents: 450,
        totalTeachers: 25,
        activeCourses: 18
      };

      const mockPerformanceMetrics = {
        averageScore: 84,
        passRate: 92,
        attendance: 96
      };

      const mockResourceUsage = {
        activitiesCompleted: 1250,
        totalUsageTime: 450
      };

      const response = await geminiDashboardService.generateAdminReport(
        mockSchoolData,
        mockPerformanceMetrics,
        mockResourceUsage
      );

      this.results.dashboardTests.admin = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Dashboard del Administrador:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Dashboard del Administrador:', error);
      this.results.dashboardTests.admin = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Sistema de Actividades
   */
  async testActivitySystem() {
    console.log('🎮 Probando Sistema de Actividades...');
    
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

      this.results.activityTests.generation = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Generación de Actividades:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Sistema de Actividades:', error);
      this.results.activityTests.generation = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test del Chat Universal
   */
  async testUniversalChat() {
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
      }

      this.results.chatTests.universal = chatResults;

      const passedCount = chatResults.filter(r => r.status === 'passed').length;
      console.log(`✅ Chat Universal: ${passedCount}/${chatResults.length} PASARON`);
      
    } catch (error) {
      console.error('❌ Error en Chat Universal:', error);
      this.results.chatTests.universal = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Test de Análisis de Respuestas
   */
  async testResponseAnalysis() {
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

      this.results.chatTests.responseAnalysis = {
        status: response.success ? 'passed' : 'failed',
        response: response.data,
        error: response.error
      };

      console.log('✅ Análisis de Respuestas:', response.success ? 'PASÓ' : 'FALLÓ');
      
    } catch (error) {
      console.error('❌ Error en Análisis de Respuestas:', error);
      this.results.chatTests.responseAnalysis = {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generar reporte completo
   */
  generateReport() {
    const duration = this.endTime - this.startTime;
    const durationSeconds = Math.round(duration / 1000);

    // Contar pruebas pasadas
    let totalTests = 0;
    let passedTests = 0;

    // Dashboard tests
    Object.values(this.results.dashboardTests).forEach(test => {
      totalTests++;
      if (test.status === 'passed') passedTests++;
    });

    // Activity tests
    Object.values(this.results.activityTests).forEach(test => {
      totalTests++;
      if (test.status === 'passed') passedTests++;
    });

    // Chat tests
    if (Array.isArray(this.results.chatTests.universal)) {
      this.results.chatTests.universal.forEach(test => {
        totalTests++;
        if (test.status === 'passed') passedTests++;
      });
    } else {
      totalTests++;
      if (this.results.chatTests.universal?.status === 'passed') passedTests++;
    }

    if (this.results.chatTests.responseAnalysis) {
      totalTests++;
      if (this.results.chatTests.responseAnalysis.status === 'passed') passedTests++;
    }

    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📋 REPORTE DE PRUEBAS DE GEMINI AI');
    console.log('='.repeat(60));
    console.log(`⏱️  Duración: ${durationSeconds} segundos`);
    console.log(`📊 Total de pruebas: ${totalTests}`);
    console.log(`✅ Pruebas pasadas: ${passedTests}`);
    console.log(`❌ Pruebas fallidas: ${totalTests - passedTests}`);
    console.log(`📈 Tasa de éxito: ${successRate}%`);
    console.log('='.repeat(60));

    // Detalles por categoría
    console.log('\n📚 DASHBOARDS:');
    Object.entries(this.results.dashboardTests).forEach(([dashboard, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`  ${status} ${dashboard.toUpperCase()}: ${result.status}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    console.log('\n🎮 ACTIVIDADES:');
    Object.entries(this.results.activityTests).forEach(([test, result]) => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`  ${status} ${test.toUpperCase()}: ${result.status}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });

    console.log('\n💬 CHAT:');
    if (Array.isArray(this.results.chatTests.universal)) {
      this.results.chatTests.universal.forEach(test => {
        const status = test.status === 'passed' ? '✅' : '❌';
        console.log(`  ${status} CHAT ${test.role.toUpperCase()}: ${test.status}`);
      });
    }

    if (this.results.chatTests.responseAnalysis) {
      const status = this.results.chatTests.responseAnalysis.status === 'passed' ? '✅' : '❌';
      console.log(`  ${status} ANÁLISIS DE RESPUESTAS: ${this.results.chatTests.responseAnalysis.status}`);
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

    // Agregar resumen al objeto de resultados
    this.results.summary = {
      duration: durationSeconds,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate,
      overallStatus: successRate >= 80 ? 'excellent' : successRate >= 60 ? 'good' : 'needs_attention'
    };

    return this.results;
  }

  /**
   * Ejecutar prueba rápida
   */
  async quickTest() {
    console.log('⚡ Ejecutando prueba rápida de Gemini AI...');
    
    try {
      // Test básico de chat
      const mockUserProfile = { full_name: 'Test User', role: 'teacher' };
      const mockContext = { subject: 'test' };
      
      const response = await geminiDashboardService.chatWithContext(
        'Hola, ¿puedes responder este mensaje?',
        'teacher',
        mockContext,
        mockUserProfile
      );

      if (response.success) {
        console.log('✅ Prueba rápida: PASÓ - Gemini AI está funcionando');
        return { status: 'passed', response: response.data };
      } else {
        console.log('❌ Prueba rápida: FALLÓ - Problema con Gemini AI');
        return { status: 'failed', error: response.error };
      }
      
    } catch (error) {
      console.log('❌ Prueba rápida: ERROR - No se pudo conectar con Gemini AI');
      return { status: 'error', error: error.message };
    }
  }
}

export default GeminiTestSuite;
