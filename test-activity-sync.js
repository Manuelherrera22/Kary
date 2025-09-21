// Script de prueba para verificar la sincronización de actividades
import activityService from './src/services/activityService.js';
import notificationService from './src/services/notificationService.js';

console.log('🧪 Iniciando prueba de sincronización de actividades...\n');

// Función para simular delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testActivitySync() {
  try {
    // 1. Crear una actividad como profesor
    console.log('1️⃣ Creando actividad como profesor...');
    const activityData = {
      title: 'Matemáticas: Sumas y Restas',
      description: 'Resuelve los siguientes problemas de suma y resta',
      subject: 'Matemáticas',
      grade: '5to Primaria',
      difficulty: 'medium',
      duration: 30,
      type: 'interactive',
      objectives: 'Practicar operaciones básicas',
      materials: ['Lápiz', 'Papel', 'Calculadora'],
      steps: [
        'Lee cada problema cuidadosamente',
        'Identifica qué operación necesitas hacer',
        'Resuelve paso a paso',
        'Verifica tu respuesta'
      ],
      assessment: 'Evaluación automática con feedback',
      createdBy: 'teacher-1'
    };

    const createResult = await activityService.createActivity(activityData);
    console.log('✅ Actividad creada:', createResult.data.title);

    // 2. Asignar a estudiantes
    console.log('\n2️⃣ Asignando actividad a estudiantes...');
    const studentIds = ['student-1', 'student-2', 'student-3'];
    const assignResult = await activityService.assignActivityToStudents(
      createResult.data.id, 
      studentIds
    );
    console.log('✅ Actividad asignada a', assignResult.data.length, 'estudiantes');

    // 3. Crear notificaciones
    console.log('\n3️⃣ Creando notificaciones...');
    const notificationResult = await notificationService.createActivityNotifications(
      createResult.data, 
      assignResult.data
    );
    console.log('✅ Notificaciones creadas:', notificationResult.data.length);

    // 4. Simular progreso de estudiante
    console.log('\n4️⃣ Simulando progreso de estudiante...');
    const studentId = 'student-1';
    const activityId = assignResult.data[0].id;
    
    // Progreso 50%
    await activityService.updateActivityProgress(activityId, 50, studentId);
    console.log('✅ Progreso actualizado a 50%');

    // Crear notificación de progreso
    await notificationService.createProgressNotification(
      createResult.data, 
      studentId, 
      50
    );
    console.log('✅ Notificación de progreso creada');

    // 5. Simular entrega de actividad
    console.log('\n5️⃣ Simulando entrega de actividad...');
    const submission = 'He completado todos los problemas. Aquí están mis respuestas: 1) 15, 2) 23, 3) 8, 4) 31';
    const submitResult = await activityService.submitActivity(
      activityId, 
      submission, 
      studentId
    );
    console.log('✅ Actividad entregada por estudiante');

    // Crear notificación de entrega
    await notificationService.createSubmissionNotification(
      createResult.data, 
      studentId, 
      submitResult.data.submission
    );
    console.log('✅ Notificación de entrega creada');

    // 6. Simular feedback del profesor
    console.log('\n6️⃣ Simulando feedback del profesor...');
    const feedback = '¡Excelente trabajo! Tus respuestas son correctas. Sigue practicando para mejorar tu velocidad.';
    const feedbackResult = await activityService.addFeedback(
      activityId, 
      feedback, 
      'teacher-1'
    );
    console.log('✅ Feedback añadido por profesor');

    // Crear notificación de feedback
    await notificationService.createFeedbackNotification(
      createResult.data, 
      studentId, 
      feedbackResult.data.feedback
    );
    console.log('✅ Notificación de feedback creada');

    // 7. Verificar datos
    console.log('\n7️⃣ Verificando datos...');
    
    // Actividades del estudiante
    const studentActivities = await activityService.getStudentActivities(studentId);
    console.log('📚 Actividades del estudiante:', studentActivities.length);
    
    // Notificaciones del estudiante
    const studentNotifications = await notificationService.getUserNotifications(studentId, 'student');
    console.log('🔔 Notificaciones del estudiante:', studentNotifications.length);
    
    // Notificaciones del profesor
    const teacherNotifications = await notificationService.getUserNotifications('teacher-1', 'teacher');
    console.log('👨‍🏫 Notificaciones del profesor:', teacherNotifications.length);

    // 8. Estadísticas
    console.log('\n8️⃣ Estadísticas...');
    const studentStats = await activityService.getStudentStats(studentId);
    console.log('📊 Estadísticas del estudiante:', studentStats.data);
    
    const teacherStats = await activityService.getActivityStats('teacher-1');
    console.log('📈 Estadísticas del profesor:', teacherStats.data);

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('- ✅ Actividad creada y asignada');
    console.log('- ✅ Notificaciones enviadas');
    console.log('- ✅ Progreso actualizado');
    console.log('- ✅ Actividad entregada');
    console.log('- ✅ Feedback proporcionado');
    console.log('- ✅ Sincronización funcionando');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar prueba
testActivitySync();





