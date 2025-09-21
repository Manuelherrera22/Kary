# 🧪 Guía de Pruebas de Gemini AI - Sistema Kary

Esta guía explica cómo verificar que todos los ciclos y herramientas del sistema Kary están funcionando correctamente con IA real de Gemini.

## 🚀 Métodos de Prueba Disponibles

### 1. 📊 Panel de Pruebas en Dashboard de Administrador

**Ubicación**: Dashboard de Administrador → Tarjeta "Pruebas de Gemini AI"

**Funcionalidades**:
- ✅ Prueba Rápida: Verifica conectividad básica con Gemini AI
- 🔬 Suite Completa: Ejecuta todas las pruebas del sistema
- 📈 Reportes Detallados: Muestra resultados por categoría
- 🎯 Análisis de Rendimiento: Tasa de éxito y recomendaciones

**Cómo usar**:
1. Accede al Dashboard de Administrador
2. Busca la tarjeta "Pruebas de Gemini AI" (ícono de cerebro púrpura)
3. Haz clic en "Prueba Rápida" para verificación básica
4. Haz clic en "Suite Completa" para análisis exhaustivo
5. Revisa los resultados y recomendaciones

### 2. 💻 Consola del Navegador

**Disponibilidad**: Funciones globales en la consola del navegador

**Comandos disponibles**:
```javascript
// Prueba rápida
await testGeminiAI("quick")

// Suite completa
await testGeminiAI("full")

// Mostrar ayuda
showGeminiTestHelp()
```

**Cómo usar**:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Ejecuta los comandos anteriores
4. Revisa los resultados en la consola

## 🔍 Tipos de Pruebas Incluidas

### 📚 Dashboards
- **Profesor**: Análisis de rendimiento de clase, recomendaciones pedagógicas
- **Estudiante**: Recomendaciones personalizadas, plan de estudio
- **Padres**: Insights familiares, apoyo en casa
- **Psicopedagogo**: Análisis de casos, estrategias de intervención
- **Administrador**: Reportes institucionales, tendencias

### 🎮 Sistema de Actividades
- **Generación Dinámica**: Creación de actividades personalizadas con Gemini
- **Análisis de Respuestas**: Evaluación inteligente de respuestas de estudiantes
- **Personalización**: Adaptación basada en perfil del estudiante

### 💬 Chat Universal
- **Chat por Rol**: Respuestas especializadas para cada tipo de usuario
- **Contexto Inteligente**: Análisis basado en datos actuales del usuario
- **Respuestas Naturales**: Conversación fluida y contextual

## 📊 Interpretación de Resultados

### 🎉 Excelente (80-100%)
- ✅ Todas las funciones principales operativas
- ✅ Gemini AI respondiendo correctamente
- ✅ Sistema listo para producción

### ⚠️ Bueno (60-79%)
- ✅ Mayoría de funciones operativas
- ⚠️ Algunas fallas menores detectadas
- 🔧 Revisar funciones específicas fallidas

### 🚨 Necesita Atención (<60%)
- ❌ Problemas significativos detectados
- 🚨 Revisión inmediata requerida
- 🔧 Posibles problemas de configuración

## 🔧 Solución de Problemas

### Problema: "No se puede conectar con Gemini AI"
**Soluciones**:
1. Verificar que `VITE_GEMINI_API_KEY` esté configurada en `.env`
2. Comprobar conexión a internet
3. Verificar que la API key sea válida

### Problema: "Error en generación de actividades"
**Soluciones**:
1. Verificar que el perfil del estudiante tenga datos válidos
2. Comprobar que la materia y dificultad sean válidas
3. Revisar logs de consola para errores específicos

### Problema: "Chat no responde"
**Soluciones**:
1. Verificar que el rol del usuario esté definido
2. Comprobar que el contexto tenga datos válidos
3. Revisar que el mensaje no esté vacío

## 📋 Checklist de Verificación

### ✅ Configuración Básica
- [ ] API Key de Gemini configurada
- [ ] Variables de entorno cargadas
- [ ] Conexión a internet estable

### ✅ Dashboards
- [ ] Dashboard del Profesor: Insights generados
- [ ] Dashboard del Estudiante: Recomendaciones personalizadas
- [ ] Dashboard de Padres: Análisis familiar
- [ ] Dashboard del Psicopedagogo: Análisis de casos
- [ ] Dashboard del Administrador: Reportes institucionales

### ✅ Sistema de Actividades
- [ ] Generación de actividades dinámicas
- [ ] Análisis de respuestas inteligente
- [ ] Personalización por perfil de estudiante
- [ ] Modo gamificado y tradicional

### ✅ Chat Universal
- [ ] Respuestas por rol de usuario
- [ ] Contexto inteligente
- [ ] Preguntas rápidas
- [ ] Minimización/maximización

## 🎯 Pruebas Específicas por Rol

### 👨‍🏫 Profesor
```javascript
// Probar insights de clase
await testGeminiAI("full")
// Verificar que se generen recomendaciones pedagógicas
```

### 👨‍🎓 Estudiante
```javascript
// Probar recomendaciones personalizadas
await testGeminiAI("full")
// Verificar que se generen planes de estudio
```

### 👨‍👩‍👧‍👦 Padres
```javascript
// Probar análisis familiar
await testGeminiAI("full")
// Verificar que se generen insights para el hogar
```

### 🧠 Psicopedagogo
```javascript
// Probar análisis de casos
await testGeminiAI("full")
// Verificar que se generen estrategias de intervención
```

### 🛡️ Administrador
```javascript
// Probar reportes institucionales
await testGeminiAI("full")
// Verificar que se generen análisis de tendencias
```

## 📈 Métricas de Rendimiento

### Tiempo de Respuesta Esperado
- **Prueba Rápida**: 2-5 segundos
- **Suite Completa**: 30-60 segundos
- **Chat Individual**: 1-3 segundos

### Tasa de Éxito Esperada
- **Producción**: ≥90%
- **Desarrollo**: ≥80%
- **Testing**: ≥70%

## 🔄 Mantenimiento Regular

### Pruebas Diarias
```javascript
// Ejecutar prueba rápida diaria
await testGeminiAI("quick")
```

### Pruebas Semanales
```javascript
// Ejecutar suite completa semanal
await testGeminiAI("full")
```

### Monitoreo Continuo
- Revisar logs de consola regularmente
- Monitorear tasa de éxito en panel de administrador
- Verificar respuestas de calidad en chat

## 📞 Soporte

Si encuentras problemas persistentes:

1. **Revisar Logs**: Consola del navegador y terminal
2. **Verificar Configuración**: Variables de entorno y API keys
3. **Probar Conectividad**: Prueba rápida desde consola
4. **Documentar Problemas**: Incluir mensajes de error específicos

## 🎉 ¡Sistema Verificado!

Una vez que todas las pruebas pasen exitosamente, tendrás la confirmación de que:

- ✅ Gemini AI está funcionando correctamente
- ✅ Todos los dashboards tienen IA integrada
- ✅ El sistema de actividades es inteligente
- ✅ El chat universal está operativo
- ✅ La personalización por rol funciona
- ✅ Los insights y recomendaciones se generan correctamente

**¡Tu sistema Kary está listo para proporcionar una experiencia educativa verdaderamente inteligente!** 🚀✨
