# 🔧 **CONFIGURACIÓN DE API DE GEMINI PARA KARY**

## 🚀 **PASOS PARA CONFIGURAR GEMINI**

### **1. Crear archivo .env** 📝

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
# Configuración de API Keys para Kary Platform
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui

# Configuración de desarrollo
NODE_ENV=development
VITE_APP_ENV=development

# Configuración de la aplicación
VITE_APP_NAME=Kary Platform
VITE_APP_VERSION=1.0.0

# Configuración de API endpoints
VITE_API_BASE_URL=http://localhost:3001
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com

# Configuración de features
VITE_ENABLE_GEMINI_CHAT=true
VITE_ENABLE_AI_INSIGHTS=true
VITE_ENABLE_SMART_ASSIGNMENT=true
VITE_ENABLE_PIAR_INTEGRATION=true

# Configuración de debug
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
```

### **2. Obtener API Key de Gemini** 🔑

1. **Ve a**: https://makersuite.google.com/app/apikey
2. **Inicia sesión** con tu cuenta de Google
3. **Crea una nueva API key**:
   - Haz clic en "Create API Key"
   - Selecciona tu proyecto o crea uno nuevo
   - Copia la API key generada
4. **Reemplaza** `tu_api_key_de_gemini_aqui` con tu API key real

### **3. Reiniciar el servidor** 🔄

```bash
# Detener el servidor actual (Ctrl+C)
# Luego ejecutar:
npm run dev
```

### **4. Verificar configuración** ✅

Una vez configurado, las herramientas de Gemini en Kary funcionarán correctamente:

- ✅ **Chat con Kary**: Respuestas inteligentes en tiempo real
- ✅ **Generación de actividades**: Contenido personalizado con IA
- ✅ **Planes de apoyo**: Basados en PIAR del estudiante
- ✅ **Insights educativos**: Análisis inteligente de datos
- ✅ **Adaptaciones múltiples**: Para diferentes estudiantes

---

## 🎯 **FUNCIONALIDADES HABILITADAS CON GEMINI**

### **Para Estudiantes** 👨‍🎓
- **Chat inteligente**: Preguntas y respuestas educativas
- **Recomendaciones personalizadas**: Basadas en su perfil
- **Actividades adaptadas**: Según sus necesidades

### **Para Profesores** 👨‍🏫
- **Generación de contenido**: Actividades y materiales
- **Insights de clase**: Análisis de rendimiento
- **Adaptaciones automáticas**: Para diferentes estudiantes

### **Para Psicopedagogos** 📊
- **Planes de apoyo**: Generados automáticamente
- **Análisis psicopedagógico**: Basado en datos
- **Seguimiento de casos**: Monitoreo inteligente

### **Para Padres** 👨‍👩‍👧‍👦
- **Insights del progreso**: Análisis del desarrollo
- **Recomendaciones para casa**: Actividades familiares
- **Comunicación mejorada**: Con el equipo educativo

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Error: "API key not valid"** ❌
- Verifica que la API key sea correcta
- Asegúrate de que no tenga espacios extra
- Reinicia el servidor después de cambiar la API key

### **Error: "API key not configured"** ⚠️
- Verifica que el archivo `.env` exista
- Confirma que la variable `VITE_GEMINI_API_KEY` esté definida
- Reinicia el servidor

### **Modo Demo activado** 🔧
- Si ves mensajes de "modo demo", significa que Gemini no está configurado
- Sigue los pasos de configuración arriba
- Verifica que la API key sea válida

---

## 📊 **ESTADO ACTUAL**

### **Dependencias instaladas** ✅
- `@google/generative-ai@0.24.1` ✅ Instalado
- `vite` ✅ Configurado para variables de entorno

### **Servicios configurados** ✅
- `geminiDashboardService.js` ✅ Listo para usar
- `SmartAssignment` ✅ Integrado con Gemini
- `PIAR Integration` ✅ Funcional con IA

### **Próximo paso** 🎯
**Crear el archivo `.env` con tu API key de Gemini**

---

## 🚀 **COMANDOS ÚTILES**

```bash
# Verificar dependencias
npm list @google/generative-ai

# Reiniciar servidor
npm run dev

# Verificar variables de entorno (en el navegador)
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

---

**¡Una vez configurado, todas las herramientas de IA de Kary funcionarán perfectamente!** 🎯✨
