# Sistema de IA Educativa - Kary Platform

## Descripción General

El Sistema de IA Educativa de Kary es una plataforma inteligente que proporciona asistencia contextual para todos los roles educativos, generando planes de apoyo personalizados, alertas predictivas, tareas adaptativas y contenido educativo inteligente.

## Arquitectura del Sistema

### Componentes Principales

1. **EducationalAI** (`educationalAI.js`)
   - Servicio principal de IA educativa
   - Generación de planes de apoyo
   - Alertas predictivas
   - Tareas personalizadas
   - Análisis de diagnósticos

2. **EducationalContext** (`educationalContext.js`)
   - Gestión de contexto educativo
   - Análisis de patrones de aprendizaje
   - Identificación de necesidades específicas
   - Contexto institucional y por roles

3. **AIIntegration** (`aiIntegration.js`)
   - Integración con múltiples proveedores de IA
   - Fallback automático entre proveedores
   - Gestión de respuestas mock
   - Monitoreo de disponibilidad

4. **AIAssistant** (`AIAssistant.jsx`)
   - Interfaz principal del asistente de IA
   - Chat interactivo
   - Ejecución de capacidades específicas
   - Exportación de conversaciones

5. **AIFloatingButton** (`AIFloatingButton.jsx`)
   - Botón flotante para acceso rápido
   - Acciones rápidas contextuales
   - Indicador de estado de IA

## Capacidades de IA

### 1. Planes de Apoyo Personalizados
- **Función**: Genera planes de apoyo basados en diagnósticos estudiantiles
- **Input**: Datos de diagnóstico, perfil del estudiante, contexto educativo
- **Output**: Plan estructurado con objetivos, estrategias, cronograma y métricas
- **Uso**: Psicopedagogos, docentes

### 2. Alertas Predictivas
- **Función**: Detecta riesgos potenciales antes de que se manifiesten
- **Input**: Datos de comportamiento, rendimiento académico, patrones históricos
- **Output**: Alertas priorizadas con recomendaciones de intervención
- **Uso**: Directivos, psicopedagogos, docentes

### 3. Tareas Personalizadas
- **Función**: Crea tareas adaptadas a características individuales del estudiante
- **Input**: Perfil del estudiante, materia, nivel de dificultad, estilo de aprendizaje
- **Output**: Tareas estructuradas con instrucciones, criterios de evaluación y recursos
- **Uso**: Docentes, psicopedagogos

### 4. Análisis de Aprendizaje
- **Función**: Analiza patrones de aprendizaje y sugiere mejoras
- **Input**: Evaluaciones, historial académico, observaciones conductuales
- **Output**: Análisis de patrones, necesidades identificadas, recomendaciones
- **Uso**: Psicopedagogos, docentes, directivos

### 5. Asistencia por Rol
- **Función**: Proporciona ayuda específica para cada rol educativo
- **Input**: Contexto del rol, datos actuales, responsabilidades
- **Output**: Recomendaciones específicas, acciones inmediatas, estrategias
- **Uso**: Todos los roles

### 6. Contenido Adaptativo
- **Función**: Genera contenido educativo que se adapta al estilo de aprendizaje
- **Input**: Tema, objetivos de aprendizaje, perfil del estudiante
- **Output**: Contenido estructurado con actividades y recursos
- **Uso**: Docentes, estudiantes

## Integración con Proveedores de IA

### Proveedores Soportados

1. **OpenAI**
   - Modelos: GPT-4, GPT-3.5-turbo
   - Uso: Tareas complejas, análisis profundo
   - Configuración: `REACT_APP_OPENAI_API_KEY`

2. **Anthropic Claude**
   - Modelos: Claude-3-Sonnet, Claude-3-Haiku
   - Uso: Análisis de texto, generación de contenido
   - Configuración: `REACT_APP_ANTHROPIC_API_KEY`

3. **IA Local**
   - Modelos: Llama2, Mistral, CodeLlama
   - Uso: Desarrollo, pruebas, privacidad
   - Configuración: `REACT_APP_LOCAL_AI_ENDPOINT`

### Sistema de Fallback

El sistema implementa un fallback automático:
1. Intenta con el proveedor configurado por defecto
2. Si falla, intenta con proveedores alternativos en orden de prioridad
3. Si todos fallan, usa respuestas mock predefinidas

## Uso del Sistema

### Hook useAI

```javascript
import useAI from '@/hooks/useAI';

const MyComponent = () => {
  const ai = useAI();
  
  const generateSupportPlan = async () => {
    const plan = await ai.generateSupportPlan(
      studentId,
      diagnosticData,
      context
    );
  };
};
```

### Componente AIAssistant

```javascript
import AIAssistant from '@/components/ai/AIAssistant';

<AIAssistant
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialContext={context}
  studentId={studentId}
  role={userRole}
/>
```

### Botón Flotante

```javascript
import AIFloatingButton from '@/components/ai/AIFloatingButton';

// Se integra automáticamente en el dashboard
<AIFloatingButton />
```

## Configuración

### Variables de Entorno

```env
# Proveedor por defecto
REACT_APP_DEFAULT_AI_PROVIDER=openai

# OpenAI
REACT_APP_OPENAI_API_KEY=your_api_key
REACT_APP_OPENAI_ENDPOINT=https://api.openai.com/v1

# Anthropic
REACT_APP_ANTHROPIC_API_KEY=your_api_key
REACT_APP_ANTHROPIC_ENDPOINT=https://api.anthropic.com/v1

# IA Local
REACT_APP_LOCAL_AI_ENDPOINT=http://localhost:11434/api
```

### Configuración Personalizada

```javascript
import { AI_CONFIG } from '@/config/aiConfig';

// Personalizar configuración
AI_CONFIG.providers.openai.enabled = true;
AI_CONFIG.capabilities.supportPlan.maxObjectives = 8;
```

## Seguridad y Privacidad

### Medidas de Seguridad
- Sanitización de entrada de datos
- Validación de respuestas de IA
- Logging de interacciones
- Encriptación de datos sensibles

### Privacidad
- Los datos se procesan según políticas de privacidad
- No se almacenan conversaciones sin consentimiento
- Cumplimiento con regulaciones educativas

## Monitoreo y Analytics

### Métricas Rastreadas
- Uso de capacidades por rol
- Tiempo de respuesta de proveedores
- Tasa de éxito de generación
- Satisfacción del usuario

### Logging
- Interacciones con IA
- Errores y fallos
- Rendimiento del sistema
- Uso de recursos

## Desarrollo y Extensión

### Agregar Nueva Capacidad

1. Definir la función en `EducationalAI`
2. Crear el prompt del sistema correspondiente
3. Agregar traducciones
4. Integrar en la interfaz

### Agregar Nuevo Proveedor

1. Implementar método en `AIIntegration`
2. Configurar en `AI_CONFIG`
3. Agregar traducciones de estado
4. Probar integración

## Troubleshooting

### Problemas Comunes

1. **IA no disponible**
   - Verificar configuración de API keys
   - Comprobar conectividad de red
   - Revisar logs de consola

2. **Respuestas lentas**
   - Verificar estado de proveedores
   - Considerar usar proveedor local
   - Optimizar prompts

3. **Respuestas de baja calidad**
   - Ajustar configuración de temperatura
   - Mejorar prompts del sistema
   - Verificar contexto proporcionado

### Logs de Debug

```javascript
// Habilitar logs detallados
localStorage.setItem('ai-debug', 'true');
```

## Roadmap

### Próximas Características
- [ ] Integración con más proveedores de IA
- [ ] Capacidades de análisis de voz
- [ ] Generación de contenido multimedia
- [ ] IA conversacional avanzada
- [ ] Análisis predictivo institucional
- [ ] Integración con sistemas LMS

### Mejoras Técnicas
- [ ] Cache inteligente de respuestas
- [ ] Optimización de prompts
- [ ] Compresión de contexto
- [ ] Streaming de respuestas
- [ ] Análisis de sentimientos en tiempo real

## Contribución

Para contribuir al sistema de IA:
1. Revisar la documentación técnica
2. Seguir las convenciones de código
3. Agregar tests para nuevas funcionalidades
4. Documentar cambios en este README

## Soporte

Para soporte técnico:
- Revisar logs de consola
- Consultar documentación de proveedores de IA
- Contactar al equipo de desarrollo
- Reportar bugs en el sistema de issues

