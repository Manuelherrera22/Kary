/**
 * Servicio de Integración con APIs de IA
 * Maneja la comunicación con diferentes proveedores de IA
 */

import GeminiService from './geminiService.js';

class AIIntegration {
  constructor() {
    this.providers = {
      openai: {
        endpoint: import.meta.env.VITE_OPENAI_ENDPOINT || 'https://api.openai.com/v1',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        models: {
          gpt4: 'gpt-4',
          gpt35: 'gpt-3.5-turbo',
          embedding: 'text-embedding-ada-002'
        }
      },
      anthropic: {
        endpoint: import.meta.env.VITE_ANTHROPIC_ENDPOINT || 'https://api.anthropic.com/v1',
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        models: {
          claude: 'claude-3-sonnet-20240229',
          claudeHaiku: 'claude-3-haiku-20240307'
        }
      },
      local: {
        endpoint: import.meta.env.VITE_LOCAL_AI_ENDPOINT || 'http://localhost:11434/api',
        models: {
          llama: 'llama2',
          mistral: 'mistral'
        }
      },
      gemini: {
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBfQj3LxYUtLngyn3YPGJXiVs4xa0yb7QU',
        models: {
          geminiFlash: 'gemini-1.5-flash',
          geminiPro: 'gemini-1.5-pro'
        },
        service: new GeminiService(),
        available: true
      }
    };
    
    this.defaultProvider = import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'gemini';
    this.fallbackChain = ['gemini', 'openai', 'anthropic'];
  }

  /**
   * Genera respuesta usando IA con fallback automático
   */
  async generateResponse(prompt, type = 'general', options = {}) {
    const startTime = Date.now();
    const requestId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🚀 [${requestId}] Starting AI request - Type: ${type}, Provider: ${this.defaultProvider}`);
    
    try {
      // Intentar con el proveedor por defecto primero
      const response = await this.callProvider(this.defaultProvider, prompt, type, options);
      
      const duration = Date.now() - startTime;
      console.log(`✅ [${requestId}] AI Response generated in ${duration}ms using ${this.defaultProvider}`);
      
      // Agregar metadatos de la respuesta
      response.requestId = requestId;
      response.duration = duration;
      response.timestamp = new Date().toISOString();
      
      // Actualizar estadísticas
      this.updateUsageStats(response);
      
      return response;
    } catch (error) {
      console.warn(`⚠️ [${requestId}] Primary AI provider (${this.defaultProvider}) failed:`, error.message);
      
      // Intentar con proveedores de fallback
      for (const provider of this.fallbackChain) {
        if (provider === this.defaultProvider) continue;
        
        try {
          const response = await this.callProvider(provider, prompt, type, options);
          const duration = Date.now() - startTime;
          console.log(`✅ [${requestId}] AI Response generated using fallback provider: ${provider} (${duration}ms)`);
          
          response.requestId = requestId;
          response.duration = duration;
          response.timestamp = new Date().toISOString();
          response.fallback = true;
          
          // Actualizar estadísticas
          this.updateUsageStats(response);
          
          return response;
        } catch (fallbackError) {
          console.warn(`⚠️ [${requestId}] Fallback provider (${provider}) failed:`, fallbackError.message);
          continue;
        }
      }
      
      // Si todos los proveedores fallan, usar respuesta mock
      const duration = Date.now() - startTime;
      console.error(`❌ [${requestId}] All AI providers failed, using mock response (${duration}ms)`);
      
      const mockResponse = this.getMockResponse(type, prompt);
      mockResponse.requestId = requestId;
      mockResponse.duration = duration;
      mockResponse.timestamp = new Date().toISOString();
      mockResponse.fallback = true;
      
      // Actualizar estadísticas
      this.updateUsageStats(mockResponse);
      
      return mockResponse;
    }
  }

  /**
   * Llama a un proveedor específico de IA
   */
  async callProvider(provider, prompt, type, options) {
    const providerConfig = this.providers[provider];
    if (!providerConfig) {
      throw new Error(`Provider ${provider} not configured`);
    }

    switch (provider) {
      case 'openai':
        return await this.callOpenAI(providerConfig, prompt, type, options);
      case 'anthropic':
        return await this.callAnthropic(providerConfig, prompt, type, options);
      case 'local':
        return await this.callLocalAI(providerConfig, prompt, type, options);
      case 'gemini':
        return await this.callGemini(providerConfig, prompt, type, options);
      default:
        throw new Error(`Provider ${provider} not implemented`);
    }
  }

  /**
   * Integración con OpenAI
   */
  async callOpenAI(config, prompt, type, options) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const model = this.selectModel('openai', type, options);
    const systemPrompt = this.getSystemPrompt(type, options);

    const response = await fetch(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
      model: data.model,
      provider: 'openai'
    };
  }

  /**
   * Integración con Anthropic Claude
   */
  async callAnthropic(config, prompt, type, options) {
    if (!config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const model = this.selectModel('anthropic', type, options);
    const systemPrompt = this.getSystemPrompt(type, options);

    const response = await fetch(`${config.endpoint}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        top_p: options.topP || 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: data.usage,
      model: data.model,
      provider: 'anthropic'
    };
  }

  /**
   * Integración con IA Local (Ollama, LM Studio, etc.)
   */
  async callLocalAI(config, prompt, type, options) {
    const model = this.selectModel('local', type, options);
    const systemPrompt = this.getSystemPrompt(type, options);

    try {
      const response = await fetch(`${config.endpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt: `${systemPrompt}\n\n${prompt}`,
          stream: false,
          options: {
            temperature: options.temperature || 0.7,
            top_p: options.topP || 1,
            max_tokens: options.maxTokens || 2000
          }
        }),
        signal: AbortSignal.timeout(10000) // 10 segundos timeout
      });

      if (!response.ok) {
        throw new Error(`Local AI error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.response || '',
        usage: { total_tokens: data.prompt_eval_count + data.eval_count },
        model: data.model,
        provider: 'local'
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Local AI request timeout');
      }
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Local AI service not available');
      }
      throw error;
    }
  }

  /**
   * Selecciona el modelo apropiado según el tipo de tarea
   */
  selectModel(provider, type, options) {
    const providerConfig = this.providers[provider];
    const models = providerConfig.models;

    switch (type) {
      case 'support_plan':
      case 'predictive_alerts':
      case 'diagnostic_analysis':
        return models.gpt4 || models.claude || models.llama;
      case 'task_generation':
      case 'adaptive_content':
        return models.gpt35 || models.claudeHaiku || models.mistral;
      case 'role_assistance':
      case 'general':
      default:
        return models.gpt35 || models.claudeHaiku || models.llama;
    }
  }

  /**
   * Genera el prompt del sistema según el tipo de tarea
   */
  getSystemPrompt(type, options) {
    const basePrompt = "Eres un asistente de IA especializado en educación. Proporcionas respuestas útiles, precisas y contextualmente apropiadas para el entorno educativo.";

    const typeSpecificPrompts = {
      support_plan: `
        ${basePrompt}
        
        Especialización: Planes de Apoyo Educativo
        - Generas planes de apoyo personalizados basados en diagnósticos
        - Consideras las necesidades individuales del estudiante
        - Incluyes estrategias pedagógicas, emocionales y conductuales
        - Proporcionas cronogramas realistas y métricas de seguimiento
        - Respondes en formato JSON estructurado
      `,
      predictive_alerts: `
        ${basePrompt}
        
        Especialización: Alertas Predictivas Educativas
        - Analizas patrones de comportamiento y rendimiento académico
        - Identificas riesgos potenciales antes de que se manifiesten
        - Proporcionas recomendaciones de intervención temprana
        - Priorizas alertas según nivel de riesgo
        - Respondes en formato JSON con array de alertas
      `,
      diagnostic_analysis: `
        ${basePrompt}
        
        Especialización: Análisis de Diagnósticos Educativos
        - Analizas evaluaciones psicopedagógicas
        - Identificas patrones y tendencias
        - Sugieres intervenciones basadas en evidencia
        - Priorizas necesidades según impacto educativo
        - Respondes en formato JSON estructurado
      `,
      task_generation: `
        ${basePrompt}
        
        Especialización: Generación de Tareas Educativas
        - Creas tareas personalizadas según características del estudiante
        - Adaptas dificultad y contenido al nivel apropiado
        - Incluyes múltiples estilos de aprendizaje
        - Proporcionas criterios de evaluación claros
        - Respondes en formato JSON estructurado
      `,
      adaptive_content: `
        ${basePrompt}
        
        Especialización: Contenido Educativo Adaptativo
        - Generas contenido que se adapta al estilo de aprendizaje
        - Incluyes ejemplos relevantes y motivadores
        - Proporcionas múltiples formatos de presentación
        - Adaptas complejidad según nivel del estudiante
        - Respondes en formato JSON estructurado
      `,
      role_assistance: `
        ${basePrompt}
        
        Especialización: Asistencia por Roles Educativos
        - Proporcionas asistencia específica para cada rol educativo
        - Consideras las responsabilidades y contexto del rol
        - Sugieres acciones prácticas y realizables
        - Incluyes recursos y herramientas relevantes
        - Respondes en formato JSON estructurado
      `
    };

    return typeSpecificPrompts[type] || basePrompt;
  }

  /**
   * Genera respuesta mock cuando todos los proveedores fallan
   */
  getMockResponse(type, prompt) {
    const mockResponses = {
      support_plan: {
        title: "Plan de Apoyo Personalizado",
        objectives: [
          "Mejorar el rendimiento académico en las áreas identificadas",
          "Desarrollar habilidades socioemocionales",
          "Fortalecer la autoestima y motivación"
        ],
        strategies: [
          "Refuerzo académico individualizado",
          "Apoyo emocional y psicológico",
          "Estrategias de aprendizaje adaptadas"
        ],
        timeline: {
          duration: "8 semanas",
          phases: [
            { phase: "Evaluación inicial", duration: "1 semana" },
            { phase: "Implementación", duration: "6 semanas" },
            { phase: "Evaluación final", duration: "1 semana" }
          ]
        },
        resources: [
          "Material didáctico especializado",
          "Apoyo psicopedagógico",
          "Recursos tecnológicos"
        ],
        metrics: [
          "Progreso académico medible",
          "Bienestar emocional",
          "Participación en actividades"
        ],
        roles: {
          teacher: "Implementación de estrategias académicas",
          psychopedagogue: "Seguimiento y evaluación",
          parent: "Apoyo en casa y comunicación"
        }
      },
      predictive_alerts: [
        {
          type: "academic",
          priority: "medium",
          title: "Posible Disminución en Rendimiento",
          description: "Se detectan patrones que sugieren una posible disminución en el rendimiento académico",
          recommendations: [
            "Refuerzo académico inmediato",
            "Revisión de estrategias de enseñanza",
            "Seguimiento individualizado"
          ],
          estimatedInterventionTime: "24-48 horas",
          resources: [
            "Material de refuerzo",
            "Tiempo adicional de apoyo",
            "Comunicación con familia"
          ]
        }
      ],
      task_generation: [
        {
          title: "Actividad de Refuerzo Personalizada",
          description: "Actividad diseñada específicamente para reforzar las áreas identificadas",
          instructions: [
            "Leer cuidadosamente las instrucciones",
            "Completar cada sección paso a paso",
            "Revisar y corregir antes de entregar"
          ],
          evaluationCriteria: [
            "Completitud de la tarea",
            "Precisión en las respuestas",
            "Esfuerzo y dedicación demostrados"
          ],
          resources: [
            "Material de apoyo",
            "Ejemplos de referencia",
            "Guías de estudio"
          ],
          estimatedTime: "45 minutos",
          adaptations: {
            visual: "Incluir diagramas y gráficos",
            auditory: "Agregar explicaciones orales",
            kinesthetic: "Incorporar actividades prácticas"
          }
        }
      ],
      role_assistance: {
        analysis: "Análisis de la situación actual basado en los datos proporcionados",
        recommendations: [
          "Implementar estrategias de apoyo individualizado",
          "Mantener comunicación constante con la familia",
          "Utilizar recursos tecnológicos disponibles"
        ],
        immediateActions: [
          "Revisar y actualizar el plan de apoyo actual",
          "Programar reunión con el equipo multidisciplinario",
          "Documentar observaciones y progreso"
        ],
        resources: [
          "Manual de estrategias pedagógicas",
          "Herramientas de evaluación",
          "Recursos de comunicación familiar"
        ],
        strategies: [
          "Enfoque multidisciplinario",
          "Seguimiento sistemático",
          "Adaptación continua"
        ],
        metrics: [
          "Progreso académico",
          "Bienestar emocional",
          "Participación y engagement"
        ],
        confidence: 0.8
      },
      adaptive_content: {
        introduction: "Introducción motivadora al tema que conecta con los intereses del estudiante",
        mainContent: "Contenido principal adaptado al estilo de aprendizaje identificado",
        examples: [
          "Ejemplo práctico y relevante",
          "Ejemplo visual con diagramas",
          "Ejemplo de aplicación real"
        ],
        activities: [
          "Actividad de comprensión",
          "Ejercicio de aplicación",
          "Proyecto creativo"
        ],
        evaluation: {
          type: "Evaluación formativa",
          format: "Múltiples opciones y actividades prácticas",
          criteria: "Basada en objetivos de aprendizaje específicos"
        },
        additionalResources: [
          "Videos explicativos",
          "Lecturas complementarias",
          "Actividades interactivas"
        ],
        adaptations: {
          visual: "Diagramas, gráficos y mapas conceptuales",
          auditory: "Explicaciones orales y podcasts",
          kinesthetic: "Actividades prácticas y manipulativas"
        }
      }
    };

    return {
      content: JSON.stringify(mockResponses[type] || mockResponses.role_assistance),
      usage: { total_tokens: 0 },
      model: 'mock',
      provider: 'mock',
      fallback: true
    };
  }

  /**
   * Genera embeddings para búsqueda semántica
   */
  async generateEmbedding(text) {
    try {
      const response = await this.callProvider('openai', text, 'embedding');
      return response.content;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Fallback a embedding simple
      return this.simpleEmbedding(text);
    }
  }

  /**
   * Embedding simple como fallback
   */
  simpleEmbedding(text) {
    // Implementación básica de embedding
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(1536).fill(0);
    
    words.forEach(word => {
      const hash = this.simpleHash(word);
      embedding[hash % 1536] += 1;
    });
    
    // Normalizar
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Verifica la disponibilidad de proveedores
   */
  async checkProviderAvailability() {
    const availability = {};
    
    // Verificar Gemini como proveedor principal
    try {
      const geminiConfig = this.providers.gemini;
      if (geminiConfig && geminiConfig.apiKey) {
        // Probar conexión real con Gemini
        const testResult = await this.testGeminiConnection();
        availability['gemini'] = { 
          available: testResult, 
          error: testResult ? null : 'Connection test failed' 
        };
      } else {
        availability['gemini'] = { available: false, error: 'No Gemini API key configured' };
      }
    } catch (error) {
      availability['gemini'] = { available: false, error: error.message };
    }
    
    // Marcar otros proveedores como no disponibles para evitar errores
    availability['openai'] = { available: false, error: 'Not configured' };
    availability['anthropic'] = { available: false, error: 'Not configured' };
    availability['local'] = { available: false, error: 'Not configured' };
    
    return availability;
  }

  /**
   * Prueba la conexión real con Gemini
   */
  async testGeminiConnection() {
    try {
      const geminiConfig = this.providers.gemini;
      if (!geminiConfig || !geminiConfig.service) {
        return false;
      }
      
      const result = await geminiConfig.service.testConnection();
      return result;
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  /**
   * Integración con Google Gemini
   */
  async callGemini(config, prompt, type, options) {
    if (!config.service) {
      throw new Error('Gemini service not initialized');
    }

    try {
      // Usar el servicio de Gemini especializado para educación
      const response = await config.service.generateEducationalContent(prompt, {
        type,
        ...options
      });

      if (!response.success) {
        throw new Error(response.error || 'Gemini API error');
      }

      return {
        content: response.content,
        model: response.model,
        provider: 'gemini',
        timestamp: response.timestamp,
        context: response.context
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de uso
   */
  getUsageStats() {
    // Obtener estadísticas del localStorage si están disponibles
    const stats = JSON.parse(localStorage.getItem('kary_ai_stats') || '{}');
    
    return {
      totalRequests: stats.totalRequests || 0,
      successfulRequests: stats.successfulRequests || 0,
      failedRequests: stats.failedRequests || 0,
      averageResponseTime: stats.averageResponseTime || 0,
      providerUsage: stats.providerUsage || {},
      lastUpdated: stats.lastUpdated || null
    };
  }

  /**
   * Actualiza estadísticas de uso
   */
  updateUsageStats(response) {
    try {
      const stats = JSON.parse(localStorage.getItem('kary_ai_stats') || '{}');
      
      // Actualizar contadores
      stats.totalRequests = (stats.totalRequests || 0) + 1;
      
      if (response.fallback) {
        stats.failedRequests = (stats.failedRequests || 0) + 1;
      } else {
        stats.successfulRequests = (stats.successfulRequests || 0) + 1;
      }
      
      // Actualizar tiempo promedio de respuesta
      const totalTime = (stats.averageResponseTime || 0) * (stats.totalRequests - 1) + (response.duration || 0);
      stats.averageResponseTime = totalTime / stats.totalRequests;
      
      // Actualizar uso por proveedor
      const provider = response.provider || 'unknown';
      stats.providerUsage[provider] = (stats.providerUsage[provider] || 0) + 1;
      
      // Actualizar timestamp
      stats.lastUpdated = new Date().toISOString();
      
      // Guardar en localStorage
      localStorage.setItem('kary_ai_stats', JSON.stringify(stats));
      
      console.log(`📊 AI Stats updated - Total: ${stats.totalRequests}, Success: ${stats.successfulRequests}, Failed: ${stats.failedRequests}`);
    } catch (error) {
      console.error('Error updating AI usage stats:', error);
    }
  }
}

export default new AIIntegration();

