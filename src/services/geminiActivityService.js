import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configuración de generación
const GENERATION_CONFIG = {
  temperature: 0.8,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

/**
 * Genera actividades dinámicas e interactivas usando Gemini AI
 */
export const generateDynamicActivity = async (studentProfile, subject, difficulty, topic = null) => {
  try {
    const prompt = `
    Eres un experto educador especializado en crear actividades interactivas y personalizadas.
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name || 'Estudiante'}
    - Edad/Grado: ${studentProfile.grade || 'No especificado'}
    - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
    - Necesidades especiales: ${studentProfile.specialNeeds?.join(', ') || 'Ninguna'}
    - Intereses: ${studentProfile.interests?.join(', ') || 'Generales'}
    
    MATERIA: ${subject}
    DIFICULTAD: ${difficulty}
    TEMA ESPECÍFICO: ${topic || 'General'}
    
    Genera una actividad educativa interactiva que sea:
    1. Personalizada para este estudiante específico
    2. Apropiada para su nivel de dificultad
    3. Incorporando sus intereses y estilo de aprendizaje
    4. Adaptada a cualquier necesidad especial
    
    Responde SOLO con un JSON válido en este formato exacto:
    {
      "title": "Título atractivo de la actividad",
      "description": "Descripción clara y motivadora",
      "subject": "${subject}",
      "difficulty": "${difficulty}",
      "duration": 15,
      "objectives": [
        "Objetivo específico 1",
        "Objetivo específico 2",
        "Objetivo específico 3"
      ],
      "materials": [
        "Material necesario 1",
        "Material necesario 2"
      ],
      "gamifiedContent": {
        "theme": "Tema de la aventura",
        "story": "Breve historia contextual",
        "challenges": [
          {
            "id": 1,
            "question": "Pregunta interactiva",
            "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
            "correctAnswer": 0,
            "explanation": "Explicación de la respuesta correcta",
            "hint": "Pista útil",
            "points": 10
          }
        ]
      },
      "traditionalContent": {
        "steps": [
          {
            "id": 1,
            "title": "Paso 1",
            "instruction": "Instrucción detallada",
            "activity": "Actividad específica a realizar",
            "materials": ["Materiales para este paso"]
          }
        ]
      },
      "personalization": {
        "adaptations": ["Adaptación 1", "Adaptación 2"],
        "motivationalElements": ["Elemento motivacional 1"],
        "interestsIntegration": "Cómo se integran los intereses del estudiante"
      }
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = await result.response;
    const text = response.text();
    
    // Limpiar y parsear el JSON
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const activityData = JSON.parse(cleanText);
    
    return {
      success: true,
      data: {
        ...activityData,
        id: `gemini-activity-${Date.now()}`,
        generatedBy: 'gemini',
        generatedAt: new Date().toISOString(),
        studentProfile: studentProfile
      }
    };
    
  } catch (error) {
    console.error('Error generando actividad con Gemini:', error);
    
    // Fallback a actividad mock si Gemini falla
    return {
      success: false,
      error: error.message,
      data: generateMockActivity(studentProfile, subject, difficulty, topic)
    };
  }
};

/**
 * Analiza respuestas del estudiante y genera feedback inteligente
 */
export const analyzeStudentResponse = async (question, studentAnswer, correctAnswer, studentProfile) => {
  try {
    const prompt = `
    Eres un tutor personal inteligente especializado en educación.
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name || 'Estudiante'}
    - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
    - Necesidades especiales: ${studentProfile.specialNeeds?.join(', ') || 'Ninguna'}
    
    PREGUNTA: ${question}
    RESPUESTA CORRECTA: ${correctAnswer}
    RESPUESTA DEL ESTUDIANTE: ${studentAnswer}
    
    Analiza la respuesta del estudiante y proporciona:
    1. Evaluación de la respuesta
    2. Feedback constructivo y motivacional
    3. Sugerencias para mejorar
    4. Explicación educativa si es necesario
    
    Responde SOLO con un JSON válido:
    {
      "isCorrect": true/false,
      "score": 85,
      "feedback": "Feedback principal motivacional",
      "explanation": "Explicación educativa detallada",
      "suggestions": ["Sugerencia 1", "Sugerencia 2"],
      "encouragement": "Mensaje de aliento personalizado",
      "nextSteps": "Qué hacer a continuación"
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanText);
    
    return {
      success: true,
      data: analysis
    };
    
  } catch (error) {
    console.error('Error analizando respuesta con Gemini:', error);
    
    return {
      success: false,
      error: error.message,
      data: {
        isCorrect: studentAnswer === correctAnswer,
        score: studentAnswer === correctAnswer ? 100 : 0,
        feedback: studentAnswer === correctAnswer ? 
          "¡Excelente! Respuesta correcta." : 
          "No es correcto, pero sigue intentando.",
        explanation: "Explicación básica",
        suggestions: ["Revisa el material", "Practica más"],
        encouragement: "¡Sigue así!",
        nextSteps: "Continúa con la siguiente pregunta"
      }
    };
  }
};

/**
 * Genera preguntas dinámicas adicionales basadas en el progreso
 */
export const generateDynamicQuestions = async (studentProfile, subject, currentProgress, difficulty) => {
  try {
    const prompt = `
    Eres un experto en educación que genera preguntas dinámicas.
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name || 'Estudiante'}
    - Progreso actual: ${currentProgress}%
    - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
    - Intereses: ${studentProfile.interests?.join(', ') || 'Generales'}
    
    MATERIA: ${subject}
    DIFICULTAD: ${difficulty}
    
    Genera 3 preguntas adicionales que:
    1. Se adapten al progreso actual del estudiante
    2. Mantengan el nivel de dificultad apropiado
    3. Integren sus intereses
    4. Sean progresivamente más desafiantes
    
    Responde SOLO con un JSON válido:
    {
      "questions": [
        {
          "id": 1,
          "question": "Pregunta dinámica 1",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Explicación",
          "hint": "Pista",
          "points": 15,
          "difficulty": "intermediate"
        }
      ],
      "adaptiveInstructions": "Instrucciones adaptadas al progreso",
      "motivation": "Mensaje motivacional personalizado"
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const questionsData = JSON.parse(cleanText);
    
    return {
      success: true,
      data: questionsData
    };
    
  } catch (error) {
    console.error('Error generando preguntas dinámicas con Gemini:', error);
    return {
      success: false,
      error: error.message,
      data: { questions: [], adaptiveInstructions: "", motivation: "¡Sigue así!" }
    };
  }
};

/**
 * Chat interactivo con Gemini durante la actividad
 */
export const chatWithGemini = async (message, context, studentProfile) => {
  try {
    const prompt = `
    Eres Kary, un asistente educativo personal e inteligente.
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name || 'Estudiante'}
    - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
    - Necesidades especiales: ${studentProfile.specialNeeds?.join(', ') || 'Ninguna'}
    
    CONTEXTO DE LA ACTIVIDAD:
    - Materia: ${context.subject || 'No especificada'}
    - Progreso: ${context.progress || 0}%
    - Dificultad: ${context.difficulty || 'intermediate'}
    
    MENSAJE DEL ESTUDIANTE: ${message}
    
    Responde como Kary:
    1. Sé amigable, motivacional y educativo
    2. Adapta tu respuesta al perfil del estudiante
    3. Proporciona ayuda específica y útil
    4. Mantén un tono positivo y alentador
    5. Si es una pregunta sobre la actividad, da pistas útiles sin dar la respuesta
    
    Responde en máximo 2 párrafos, de manera natural y conversacional.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        ...GENERATION_CONFIG,
        temperature: 0.7, // Más creativo para chat
      },
    });

    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      data: {
        message: text.trim(),
        timestamp: new Date().toISOString(),
        context: context
      }
    };
    
  } catch (error) {
    console.error('Error en chat con Gemini:', error);
    return {
      success: false,
      error: error.message,
      data: {
        message: "Lo siento, no puedo responder en este momento. ¡Pero puedes seguir con tu actividad!",
        timestamp: new Date().toISOString(),
        context: context
      }
    };
  }
};

/**
 * Genera recomendaciones personalizadas post-actividad
 */
export const generatePersonalizedRecommendations = async (activityResults, studentProfile) => {
  try {
    const prompt = `
    Eres un experto en análisis educativo y recomendaciones personalizadas.
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name || 'Estudiante'}
    - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
    - Necesidades especiales: ${studentProfile.specialNeeds?.join(', ') || 'Ninguna'}
    - Intereses: ${studentProfile.interests?.join(', ') || 'Generales'}
    
    RESULTADOS DE LA ACTIVIDAD:
    - Puntuación: ${activityResults.score || 0}
    - Tiempo empleado: ${activityResults.timeSpent || 0} segundos
    - Precisión: ${activityResults.accuracy || 0}%
    - Materia: ${activityResults.subject || 'No especificada'}
    - Dificultad: ${activityResults.difficulty || 'intermediate'}
    
    Genera recomendaciones personalizadas:
    1. Análisis del rendimiento
    2. Fortalezas identificadas
    3. Áreas de mejora
    4. Actividades recomendadas
    5. Estrategias de estudio personalizadas
    
    Responde SOLO con un JSON válido:
    {
      "performanceAnalysis": "Análisis detallado del rendimiento",
      "strengths": ["Fortaleza 1", "Fortaleza 2"],
      "areasForImprovement": ["Área 1", "Área 2"],
      "recommendedActivities": [
        {
          "title": "Actividad recomendada",
          "reason": "Por qué es recomendada",
          "difficulty": "beginner/intermediate/advanced"
        }
      ],
      "studyStrategies": ["Estrategia 1", "Estrategia 2"],
      "motivationalMessage": "Mensaje motivacional personalizado",
      "nextSteps": "Próximos pasos recomendados"
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const recommendations = JSON.parse(cleanText);
    
    return {
      success: true,
      data: recommendations
    };
    
  } catch (error) {
    console.error('Error generando recomendaciones con Gemini:', error);
    return {
      success: false,
      error: error.message,
      data: {
        performanceAnalysis: "Análisis básico del rendimiento",
        strengths: ["Dedicación", "Esfuerzo"],
        areasForImprovement: ["Práctica adicional"],
        recommendedActivities: [],
        studyStrategies: ["Practicar regularmente"],
        motivationalMessage: "¡Sigue así!",
        nextSteps: "Continúa practicando"
      }
    };
  }
};

/**
 * Genera actividad mock como fallback
 */
const generateMockActivity = (studentProfile, subject, difficulty, topic) => {
  return {
    id: `mock-activity-${Date.now()}`,
    title: `Actividad de ${subject} - ${difficulty}`,
    description: `Actividad personalizada para ${studentProfile.full_name || 'el estudiante'}`,
    subject: subject,
    difficulty: difficulty,
    duration: 15,
    objectives: [
      `Aprender conceptos básicos de ${subject}`,
      `Desarrollar habilidades de ${difficulty}`,
      `Practicar con ${topic || 'contenido general'}`
    ],
    materials: ['Papel', 'Lápiz', 'Calculadora'],
    gamifiedContent: {
      theme: `Aventura de ${subject}`,
      story: `Una emocionante aventura en el mundo de ${subject}`,
      challenges: [
        {
          id: 1,
          question: `¿Qué es ${subject}?`,
          options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
          correctAnswer: 0,
          explanation: 'Explicación básica',
          hint: 'Pista útil',
          points: 10
        }
      ]
    },
    traditionalContent: {
      steps: [
        {
          id: 1,
          title: 'Paso 1',
          instruction: 'Instrucción básica',
          activity: 'Actividad simple',
          materials: ['Material básico']
        }
      ]
    },
    personalization: {
      adaptations: ['Adaptación básica'],
      motivationalElements: ['Motivación general'],
      interestsIntegration: 'Integración básica de intereses'
    },
    generatedBy: 'mock',
    generatedAt: new Date().toISOString()
  };
};

export default {
  generateDynamicActivity,
  analyzeStudentResponse,
  generateDynamicQuestions,
  chatWithGemini,
  generatePersonalizedRecommendations
};
